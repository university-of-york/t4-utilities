/**
 * Function for getting external files
 * @param {string} url The URL to fetch
 * @returns {string} A string containing the file's contents
 */
fetch: function(url) {

  this.writeLog("fn", "fetch");

  importPackage(java.io, java.net);

  var thisUrl = new URL(url);
  var urlStream = thisUrl.getContent();
  var reader = new BufferedReader(new InputStreamReader(urlStream, "latin1"));

  var output = "";
  var line;
  while ((line = reader.readLine()) !== null) {
    if (line == null) break;
    output+= line;
  }
  return output;

},
