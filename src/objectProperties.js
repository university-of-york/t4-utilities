/**
 * Function to list all of the available properties of an object
 * @param {Object} myObject The object to get information about
 * @returns {string} A list of all object information
 */
viewObjectProperties: function (myObject) {
  var output = "<pre>";
  for (var prop in myObject) {
    output += "object [" + prop + "] :  " + myObject[prop] + "<br/>";
  }
  output+= "</pre>";
  return output;
},
