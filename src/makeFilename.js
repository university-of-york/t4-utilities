
  /**
   * Function to make filename from URL
   * @param {string} url The URL to convert to a string
   * @returns {string} A filename string
   */
  makeFilename: function(url) {

    this.writeLog("fn", "makeFilename");

    url = ""+url; // Make sure it's a string!
    url = url.replace(':', '');
    url = url.replace(/\//g, '-');
    return url;
  },
