/**
 * Function for getting external JSON files
 * @param {string} url The URL to fetch
 * @returns {Object} A JSON object
 */
fetchJSON: function(url) {

  this.writeLog("fn", "fetchJSON");

  var output = this.fetch(url);
  return output;

},
