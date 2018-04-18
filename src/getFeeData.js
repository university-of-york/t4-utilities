/*
   * Get fee data for a course
   * @param {Object[]} opts Options object.
   * @param {string} opts[].title The course title
   * @param {string} opts[].level The course level (undergraduate or postgraduate)
   * @param {string} opts[].award The qualification awarded at the end of the course
   * @param {string} opts[].year  The start year
   * @param {string} onComplete Function to run when URL has been fetched
   * @returns {Object} { ukeu (String), international (String) }
   */
  getFeeData: function(opts, onComplete) {

    // Set up return value
    var r = [];

    // Split multiple departments by comma (except TFTV and PEP)
    var fixDepartment = function(d) {

      if (d === false) return false;

      var deptList = d.split(', ');
      var r = '';
      var i = 0;
      var l = deptList.length;
      for(;i < l; i++) {
        if (deptList[i] === false) return;
        deptList[i] = deptList[i].replace("'", "%27");
        if (deptList[i] == "Department of Theatre" || deptList[i] == "School of Politics") {
          r+= "'"+deptList[i]+", "+deptList[i+1]+"',";
        } else if (deptList[i] != "Film and Television" || deptList[i] != "Economics and Philosophy") {
          r+= "'"+deptList[i]+"',";
        }
      }

      // remove last comma
      r = r.substr(0,r.length-1);

      return r;
    };

    var department = fixDepartment(opts.department || '');
    var title = opts.title || false;
    var level = opts.level || false;
    var award = opts.award || false;
    var year = opts.year || false;

    // Both UG and PG must have level and year
    if (level === false || year === false) {
      return false;
    }

    // Check all opts are there
    if (level == "postgraduate") {
      // PG needs title and award
      if (title === false || award === false) {
        return false;
      }
    } else if (level == 'undergraduate') {
      // UG needs department
      if (department === false) {
        return false;
      }
    }

    // Make sure we get the right spreadsheet
    var data = {
      "undergraduate": {
        // Using new data for 16/17 entry too
        "2016/17": "1ZGFKXd1O4BH08WRu75nycLofR8UIIVUnYgBUDcRA",
        "2017/18": "1ZGFKXd1O4BH08WRu75nycLofR8UIIVUnYgBUDcRA",
        "2018/19": "1N6ErEQACaJ-AHm4ScgsSdqav-M1E_aY7SE6GhAi3"
      },
      "postgraduate": {
        "2016/17": "1nGFbOqNkCdc5_XpzN6yngtXsbxbePB8NRXCIOfd9",
        "2017/18": "1Wm3cgVa9T7lJkNz12n3ejii36A1C5zdVVMAadN1r",
        "2018/19": "1ll8-KzE9dR_THPbZYtQz-Ml06HAuboroRcuk9pvU"
      }
    };
    var docId = data[level][year];
    var apiKey = 'AIzaSyCp4UsdRMQRZYjgAcJghUXhAVlR0hXwBeY';
    var sql = "SELECT * FROM "+docId+" WHERE ";
    var awardColumn, modeColumn, ukeuColumn, internationalColumn, notesColumn;

    // Match course for PG, and Department name for UG
    if (level == "postgraduate") {
      sql+= "'Course title' = '"+title+"'";
      if (award !== false && award != 'All awards') {
        sql+= " AND 'Award' = '"+award+"'";
      }
      awardColumn = 2;
      modeColumn = 3;
      ukeuColumn = 4;
      internationalColumn = 5;
      notesColumn = 6;
    } else if (level == 'undergraduate') {
      sql+= "'Department' IN ("+department+")";
      awardColumn = false;
      modeColumn = false;
      ukeuColumn = 1;
      internationalColumn = 2;
      notesColumn = 3;
    }
    sql = encodeURIComponent(sql);
    var jsonUrl = 'https://www.googleapis.com/fusiontables/v2/query?sql='+sql+'&key='+apiKey;

    //document.write('<!--'+jsonUrl+' -->');

    var rr = this.fetchNew(jsonUrl, function(data) {

      //document.write('<pre>Got URL: '+jsonUrl+'</pre>');

      if (data == '') data = '{ "rows": [] }';
      var json = JSON.parse(data);
      var jsonRowLength = json.rows.length;
      var i = 0;

      for (;i < jsonRowLength; i++) {
        var row = json.rows[i];
        var o = {
          "ukeu": row[ukeuColumn].replace('Â£', '£'),
          "international": row[internationalColumn].replace('Â£', '£'),
          "notes": row[notesColumn].replace(/Â£/g, '£')
        };
        if (modeColumn !== false) {
          o["mode"] = row[modeColumn];
        }
        if (awardColumn !== false) {
          o["award"] = row[awardColumn];
        }

        r.push(o);
      }


      onComplete(r);

    });

    return rr;

  },
