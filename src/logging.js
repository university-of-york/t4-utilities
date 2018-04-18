/**
 * Enable console.logging.
 * @namespace
 */
console: {
  /**
   * Write a log to the console
   * @param {(string|Object)} textOrObj The string or object to log
   */
  log: function(textOrObj) {
    if (typeof textOrObj === "string") {
      document.write("<script>console.log('" + textOrObj + "');</script>\n");
    }
  },
  /**
   * Write a warning to the console
   * @param {(string|Object)} textOrObj The string or object to log
   */
  warn: function(textOrObj) {
    if(typeof textOrObj === "string") {
      document.write("<script>console.warn('" + textOrObj + "');</script>\n");
    }
  },
  /**
   * Write an error to the console
   * @param {(string|Object)} textOrObj The string or object to log
   */
  error: function(textOrObj) {
    if(typeof textOrObj === "string") {
      document.write("<script>console.error('" + textOrObj + "');</script>\n");
    }
  },
},
