/**
 * Functions to make working with and manipulating JSON easier.
 * @namespace
 */
json: {

  /**
   * Convert a JSON object to a string.
   * @param {string} input The JSON object.
   * @returns {string} The string representation of the json object.
   */
  stringify: function (input) {
    var json = "";
    for (var key in input) {
      if (typeof input[key] !== "function") {
        if (json !== "") {
          json += ",";
        }
        json += this.toNameValuePair(key, input[key]);
      }
    }
    json = "[{" + json + "}]";
    return json;
  },

  /**
   * Takes a name/value pair and escapes them into a combines them into a single string in JSON element format.
   * @param {string} name    The name.
   * @param {string} value   The value.
   * @returns {string} A stringified JSON element.
   */
  toNameValuePair: function (name, value) {
    return "\"" + this.escapeString(name) + "\": " + ((value == "[object Object]") ? this.stringify(value) : ("\"" + this.escapeString(value)) + "\""); //eslint-disable-line eqeqeq
  },

  /**
   * Function to properly escape a string for use within JSON.
   * @param {string} input The string to be escaped.
   * @returns {string} The JSON escaped version of the input string.
   */
  escapeString: function (input) {
    return org.apache.commons.lang.StringEscapeUtils.escapeJava(input);
  }
},
