 /**
   * Function to write a line to a log file
   * @param {string} type What type of log is it (currently "fn" and "pl" are valid)
   * @param {string} message What message should be written to the log file
   * <ul>
   *   <li>"fn" is for logging which utility functions are used</li>
   *   <li>"pl" is for logging which programmable layout is used</li>
   * </ul>
   * @returns {Boolean} True if file wrote correctly, false if otherwise
   */
  writeLog: function (type, message) {

    importPackage(java.io, java.net);

    // Check the type matches expectations
    var allowedTypes = ["fn", "pl"];
    if (allowedTypes.indexOf(type) === -1) return false;

    // Check if it's a publish or a preview
    // If it's preview, do nothing
    //if (isPreview === true) return false;

    // Get todays date in YYYMMDD format
    var zeroPad = function(s) {
      return ("0"+s).slice(-2);
    };
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth();
    var nowDate = now.getDate();

    var datestring = nowYear+zeroPad(nowMonth+1)+zeroPad(nowDate);
    //this.console.log('datestring is '+datestring);

    // Work out what publish it is (0000, 1000, 1230, 1500, 1730, 2000) and add to datestring
    var publishTimes = [
      new Date(nowYear, nowMonth, nowDate),
      new Date(nowYear, nowMonth, nowDate, 10),
      new Date(nowYear, nowMonth, nowDate, 12, 30),
      new Date(nowYear, nowMonth, nowDate, 15),
      new Date(nowYear, nowMonth, nowDate, 17, 30),
      new Date(nowYear, nowMonth, nowDate, 20)
    ];
    var publishstring = false;
    publishTimes.forEach(function(t) {
      if (now.getTime() > t.getTime()) {
        publishstring = zeroPad(t.getHours())+zeroPad(t.getMinutes());
      }
    });
    //this.console.log('publishstring is '+publishstring);

    if (publishstring === false) return false;

    // Add content and section details to each message
    message+= '; ';
    message+= content.get('Name');
    message+= ' (#';
    message+= content.getID();
    message+= '); ';
    message+= section.getName('en');
    message+= ' (#';
    message+= section.getID();
    message+= ')';

    // Check what type it is, and select the target folder/file appropriately
    var filename = type+'audit.'+datestring+publishstring+'.log';
    var tempDir = java.lang.System.getProperty("java.io.tmpdir");
    var filepath = tempDir+File.separator+filename;
    //this.console.log('Filepath is '+filepath);

    // Create new file
    var f = new File(filepath);

    // Check if file already exists
    var fileExists = f.exists();

    if (fileExists === true) {
      //this.console.log('File already exists');
      // TO DO back it up somewhere in case save doesn't work
    } else {
      // Create new file in the system
      try {
        f.createNewFile();
      } catch(e2) {
        document.write('<!-- '+e2.message+' -->\n');
        //this.console.log('Could not create temp file');
        return false;
      }
    }

    //write it
    try {
      var bw = new BufferedWriter(new FileWriter(f, true));
      if (fileExists === false) {
        var headerLine;
        switch (type) {
          case "pl":
            headerLine = "Timestamp; Content Type; Content Layout; Content name (#id); Section name (#id)";
            break;
          case "fn":
            headerLine = "Timestamp; Function name; Content name (#id); Section name (#id)";
            break;
        }
        bw.write(headerLine);
        bw.newLine();
      }
      bw.write(now+"; "+message);
      bw.newLine();
      bw.close();
      //this.console.log('File saved successfully to '+f);
      return true;
    } catch(e3) {
      document.write('<!-- '+e3.message+' -->\n');
      //this.console.log('Could not write to temp file');
      // TO DO reinstate backed up version
      return false;
    }

  },
