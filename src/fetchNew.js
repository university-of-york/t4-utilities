/**
   * NEW Function for getting external files
   * @param {string} url The URL to fetch
   * @param {string} onComplete The function to run when finished
   * @returns {boolean} True if file contents returned, false otherwise
   */
  fetchNew: function(url, onComplete) {

    this.writeLog("fn", "fetchNew");

    importPackage(java.io, java.net);

    var output = "";
    var filename = this.makeFilename(url);
    var tempDir = java.lang.System.getProperty("java.io.tmpdir");
    var filepath = tempDir+File.separator+filename;

    // create new file
    var f = new File(filepath);

    // tests if file exists
    var fileExists = f.exists();

    // Get the URL
    var thisUrl = new URL(url);

    try {

      var openConnection = new URL(thisUrl).openConnection();
      openConnection.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0");
      var urlStream = openConnection.getInputStream();

      var reader = new BufferedReader(new InputStreamReader(urlStream, "latin1"));

      var line;
      while ((line = reader.readLine()) !== null) {
        if (line == null) break;
        output+= line;
      }
      //this.console.log('File fetched successfully');
      //this.console.log(output);

      // Save it to temp file
      try {

        if (fileExists == true) {
          //this.console.log('File already exists');
          // TO DO back it up somewhere in case save doesn't work
        }
        // create new file in the system
        f.createNewFile();

      //write it
        try {
          var bw = new BufferedWriter(new FileWriter(f));
          bw.write(output);
          bw.close();
          //this.console.log('File saved successfully to '+f);
          //return true;
        } catch(e3) {
          document.write('<!-- '+e3.message+' -->\n');
          //this.console.log('Could not write to temp file');
          // TO DO reinstate backed up version
          //return false;
        }

      } catch(e2) {
        document.write('<!-- '+e2.message+' -->\n');
        //this.console.log('Could not create temp file');
        //return false;
      }

      return true;

    } catch(e) {

      // Load the temp file
      //this.console.log('File could not be loaded. Falling back to temp.');
      document.write('<!-- '+e.message+' -->\n');

      if (fileExists === false) {
      //this.console.log('Temp file does not exist yet');
        output = '{ "error":"Temp file does not exist yet." }';
        return false;
      }
      try {
        var fr = new FileReader(f);
        var br = new BufferedReader(fr);
        var line2;
        while((line2 = br.readLine()) !== null) {
          output+= line2;
        }
        br.close();
        return true;
      } catch (e) {
        //this.console.log('Could not read temp file');
        output = '{ "error":"Could not read temp file" }';
        return false;
      }

      // output = '{ "error":"Nothing happening" }';
      // return false;

    } finally {

      onComplete(output);

    }

    // return true;

  },
