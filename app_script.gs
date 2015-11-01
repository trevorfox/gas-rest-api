var ss = SpreadsheetApp.openById("1XPLvup4IUy4Ffeim8211rh1vRdDiTE2c6e9UtRSPGHk");
var sheet = ss.getSheetByName("app data")
var rng = ss.getDataRange()
var data = rng.getValues()
var headings = data[0]

/* Take a product ID as input and return the
 *  row corresponding to that product ID.*/

function productQuery(prodId){
  for (var i = 1; i < data.length; i++){
    if (prodId === data[i][0]){
      return data[i]
    }
  }
}

/* Take a spreadsheet (product) row and turn it into an object
 with spreadsheet headings as object keys. */

function formatProduct(rowData){
  var product = {}
  for (var i = 0; i < headings.length; i++){
    product[headings[i].toString()] = rowData[i]
  }
  return product
}

function doGet(request) {
  // Check for a valid request URI
  if (request.parameter.action !== undefined){
    if (request.parameter.prodid !== undefined){
      prodIds = request.parameters.prodid
      
      // The object to be returned as JSON
      response = {
        products : []
      }
      
      // Fill the products array with requested products
      for (var i = 0; i < prodIds.length; i++){   
        sheetData = productQuery(prodIds[i])
        product = formatProduct(sheetData)
        response.products.push(product)
      }
      
      if (response.products.length > 0){
        return ContentService.createTextOutput(JSON.stringify(response));
      } else {
        return ContentService.createTextOutput('Invalid Request. Product ID(s) not found.');
      }      
    } else {
      return ContentService.createTextOutput('Invalid Request. Use at least one valid "prodid" parameter.');
    } 
  } else {
    return ContentService.createTextOutput('Invalid Request. Use a valid "action" parameter.');
  }
}
