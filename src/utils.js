/* global dbStatement, publishCache, section, content, language, isPreview, com, org */

/**
 * Javascript utilities for use within programmable layouts.
 */
({
  /**
   * Version
   */
  version: "0.0.1",

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

  /**
   * Utilities for news listings
   * @namespace
   */
  listing: {
    /**
     * Create a listing (not in use)
     * @param {Object} item The news/event item to convert
     * @returns {string} A static string
     */
    makeListing: function(item) {
      return "<p>news/event item</p>";
    },
    /**
     * List of icons used for listings
     */
    icons: {
      "News": "newspaper-o",
      "Event": "calendar"
    }
  },

  /**
   * Function to process the T4 Tag that is provided as a parameter.
   * @param {string} t4Tag       The T4 Tag to be processed
   * @param {string} mySection   The Section to process the tag within (defaults to "section", i.e. the one you're calling from)
   * @param {string} myContent   The Content to process the tag within (defaults to "content", i.e. the one you're calling from)
   * @returns {string} The result of the processed tag.
   */
  processTags: function (t4Tag) {
    var myContent = content || null;
    return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag);
  },

  /**
   * Render content using a different content layout
   * @param {string} contentLayout The content layout to use
   * @returns {string} The generated markup
   */
  renderLayout: function (contentLayout) {

    importPackage(com.terminalfour.template);
    importPackage(com.terminalfour.sitemanager);
    try {
      var tid = content.getTemplateID();
      var tempManager = com.terminalfour.template.TemplateManager.getManager();
      var formatter = contentLayout;
      var format = tempManager.getFormat(dbStatement,tid,formatter); //bring back an object of this template
      var formatString = format.getFormatting(); //render the content on that object

      return eval(String(formatString));

    } catch(e) {
      return e;
    }

  },

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

  /**
   * Function to find out if current content is on a responsive page
   * TO DO: find the group it belongs to instead of Page Layout ID
   * @returns {boolean}
   */
  isResponsivePage: function() {
    // Get the style ID from the URL of the page layout
    // e.g. https://cms.york.ac.uk/terminalfour/SiteManager?ctfn=style&fnno=10&styleid=532966
    var styleIds = [
      "414045",
      "414044",
      "391953",
      "393767",
      "388211",
      "391951",
      "392141",
      "381136",
      "532966"
    ];
    var channel = publishCache.getChannel();
    var pageLayoutId = section.getStyle(channel).toString();
    var r = styleIds.indexOf(pageLayoutId) > -1;
    return r;
  },

  /**
   * Function to find out if current content is first or last of its type
   * @returns {(object|boolean)} false if opts is not complete, or object like { isFirst: Boolean, isLast: Boolean }
   */
  firstOrLast: function(onComplete) {

    var contentID = content.getID();
    var contentTemplateID = content.getTemplateID();

    var cachedContent = isPreview === true ? com.terminalfour.sitemanager.cache.CachedContent.CURRENT : com.terminalfour.sitemanager.cache.CachedContent.APPROVED ;
    //var cachedContent = com.terminalfour.sitemanager.cache.CachedContent.APPROVED;

    var contentList = com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent (com.terminalfour.sitemanager.cache.utils.CSHelper.removeSpecialContent (section.getContent (publishCache.getChannel(), language, cachedContent)));

    var sectionContent = [];
    var contentLength = contentList.length;
    var i = 0;

    for (;i < contentLength; i++) {
      var con = contentList[i];
      try {
        sectionContent.push(con);
        if (sectionContent.length === contentLength) {
          // document.write('<!-- Reached end of content -->');
          loopContent();
        }
      } catch (err) {
        document.write("<!-- "+err.message+"-->");
      }
    }

    // Get the template ID of a prev/next published sibling
    function getContentTemplateID(index, isPrev) {

      var newIndex = isPrev === true ? index-1 : index+1 ;
      if (newIndex < 0) return true;
      var newContent = sectionContent[newIndex];
      if (!newContent) return false;
      var newContentExpiry = newContent.getExpiryDate();
      var newContentStatus = newContent.getStatus().toString();

      // Not published content
      //document.write('<!-- newContentStatus: '+newContentStatus+', isPreview: '+isPreview+' -->');
      if (newContentStatus === "0" && !isPreview) {
        return getContentTemplateID(newIndex, isPrev);
      }

      // Expirable content
      if (newContentExpiry) {
        var now = java.util.Date();

        var compare = newContentExpiry.compareTo(now);
        if (compare < 0) {
          return getContentTemplateID(newIndex, isPrev);
        }
      }

      return newContent.getTemplateID();

    }

    // Loop through contents and check self
    function loopContent() {

      var r = {
        isFirst: false,
        isLast: false
      };

      // Array.some loops through elements until return true
      sectionContent.some(function(con, i) {

        var thisContent = con;
        var thisContentID = false;

        try {
          thisContentID = thisContent.getID();
        } catch (err) {
          document.write("<!-- "+err.message+"-->");
          onComplete(r);
        }

        //document.write('<!-- Section #'+i+', '+thisContentID+', '+contentID+'-->');

        // Check this one's siblings
        if (thisContentID === contentID) {

          //Check if it's first
          if (i === 0) {
            r.isFirst = true;
          } else {
            var prevContentTemplateID = getContentTemplateID(i, true);
            if (prevContentTemplateID !== contentTemplateID) r.isFirst = true;
          }

          // Check if it's last
          if (i === sectionContent.length - 1) {
            r.isLast = true;
          } else {
            var nextContentTemplateID = getContentTemplateID(i, false);
            if (nextContentTemplateID !== contentTemplateID) r.isLast = true;
          }

          onComplete(r);

          return true;

        } else if (i === sectionContent.length - 1) {

          onComplete(r);

        }

      });
    }

  },

  /**
   * Get a variant according to opts, or create one if it doesn't exist
   * @param {Object[]} opts Options object, containing
   * @param {string} opts[].contentName The name of the Content Element with the image
   * @param {string} opts[].variantName The name of the variant
   * @returns {(string|boolean)} variant id if it exists, false if not
   */
  getVariant: function(opts) {

    if (!opts.contentName) return false;
    if (!opts.variantName) return false;

    importPackage(java.lang);
    importPackage(com.terminalfour.media);
    importPackage(com.terminalfour.sitemanager);
    importPackage(com.terminalfour.publish.utils);
    importPackage(com.terminalfour.media.utils);

    try {

      var thisContent = content.get(opts.contentName);
      var thisContentId = thisContent.getID();
      var mediaManager = MediaManager.getManager();
      var variantIds = mediaManager.getMediaVariants(dbStatement.getConnection(), thisContentId, language);

      var l = variantIds.length;
      if (l === 0) return false;

      var i = 0;

      for(;i < l; i++) {
        var variantId = variantIds[i];
        var variant = mediaManager.get(dbStatement.getConnection(), variantId, language);
        var variantName = variant.getVariantName();
        //document.write('<!-- '+variantName+', '+opts.variantName+' -->');
        // variantName is an Object, so needs stringifying
        if (variantName+"" === opts.variantName) {
          return variantId;
        }
        if (i === l-1) {
          return false;
        }
      }

    } catch (err) {
      document.write(err);
    }

    //return false;
  },

  /**
   * Create a variant using the set parameters
   * @param {Object[]} opts Options object.
   * @param {string} opts[].mediaID The ID of the media item to use
   * @param {string} opts[].size The size of the image
   * @returns {boolean} true if variant is created, false if not
   */
  createVariant: function(opts) {
    return true;
  },

  /**
   * Function to make filename from URL
   * @param {string} url The URL to convert to a string
   * @returns {string} A filename string
   */
  makeFilename: function(url) {
    url = ""+url; // Make sure it's a string!
    url = url.replace(':', '');
    url = url.replace(/\//g, '-');
    return url;
  },

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

  /**
   * NEW Function for getting external files
   * @param {string} url The URL to fetch
   * @param {string} onComplete The function to run when finished
   * @returns True if file contents returned, false otherwise
   */
  fetchNew: function(url, onComplete) {

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
      while (line = reader.readLine()) {
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
        while((line = br.readLine()) != null) {
          output+= line;
        }
        br.close();
        return true;
      } catch (e) {
        //this.console.log('Could not read temp file');
        output = '{ "error":"Could not read temp file" }';
        return false;
      }

      output = '{ "error":"Nothing happening" }';
      return false;

    } finally {

      onComplete(output);

    }

    return true;
  },

  /**
   * Function for getting external files
   * @param {string} url The URL to fetch
   * @returns {string} A string containing the file's contents
   */
  fetch: function(url) {

    importPackage(java.io, java.net);

    var thisUrl = new URL(url);
    var urlStream = thisUrl.getContent();
    var reader = new BufferedReader(new InputStreamReader(urlStream, "latin1"));

    var output = "";
    var line;
    while (line = reader.readLine()) {
      if (line == null) break;
      output+= line;
    }
    return output;

  },
  /**
   * Function for getting external JSON files
   * @param {string} url The URL to fetch
   * @returns {Object} A JSON object
   */
  fetchJSON: function(url) {

    var output = this.fetch(url);
    return output;

  },
  /**
   * Function for getting author details from ID
   * @param {string} authorID     ID of the author
   * @param {string} onComplete   Function to run on completion. Takes categoryId as argument.
   * @returns {(Object|boolean)} Author object or false if ID doesn't match an author
   */
  getAuthor: function(authorID, onComplete) {

    var autorDetails = false;

    // Get author details
    var authorOptions = {
      type: 'users',
      id: authorID
    };

    this.fetchWP(authorOptions, function(authorDetails) {

      authorDetails = JSON.parse(authorDetails);
      onComplete(authorDetails);

    });

  },
  /**
   * Function for getting category ID from name
   * @param {string} categoryName The category name
   * @param {string} onComplete   Function to run on completion. Takes categoryId as argument.
   * @returns {boolean} True if it runs successfully
   */
  getCategoryID: function(categoryName, onComplete) {

    var done = false;

    if (categoryName !== false) {

      var catOptions = {
        type: 'categories',
        search: encodeURIComponent(categoryName)
      };

      this.fetchWP(catOptions, function(categories) {

        categories = JSON.parse(categories);

        categories.forEach(function(cat, i, allCategories) {

          if (cat.name == categoryName) {
            onComplete(cat.id);
            done = true;
          }

          if (i == allCategories.length-1 && done === false) {
            onComplete(false);
          }

        });

      });

    } else {

      onComplete(false);

    }

  },
  /**
   * Function for querying WP API
   * @param {Object[]} options    Options object
   * @param {string}   onComplete Function to run on completion. Takes postId as argument.
   * @returns {boolean} True if it runs successfully
   */
  fetchWP: function(options, onComplete) {

    var test = options.test || false;
    var type = options.type || 'posts';
    var id = options.id || false;
    var fields = options.fields || false;
    var category = options.category || false;
    var search = options.search || false;
    var siteURL = test === true ? 'https://uoy.staging.wpengine.com/student-voices' : 'https://blogs.york.ac.uk/student-voices' ;


    // Query API for post details
    var queryURL = siteURL+'/wp-json/wp/v2/';
    queryURL+= type+'/';
    if (!!id === true) queryURL+= id;
    if ((!!fields === true) || (!!category === true) || (!!search === true)) queryURL+= '?';
    if (!!fields === true) queryURL+= 'fields='+fields+'&';
    if (!category === false && category !== 'all') queryURL+= 'categories='+category+'&';
    if (!!search === true) queryURL+= 'search='+search+'&';

    //document.write('\n'+'<!-- '+queryURL+' -->'+'\n');

    this.fetchNew(queryURL, onComplete);

  },

  /**
   * Function for getting ID of blog post from HTML content
   * @param {string} postURL    The URL of the post, or an ID
   * @param {string} onComplete Function to run on completion. Takes postId as argument.
   * @returns {boolean} True if it runs successfully
   */
  getPostId: function(postURL, onComplete) {

    this.fetchNew(postURL, function(postHtml) {

      if (postHtml === false) onComplete(false);

      try {
        var outputJSON = JSON.parse(postHtml);
        if (outputJSON.error) {
          document.write('<!-- Error: '+outputJSON.error+' -->');
        }
      } catch(err) {
          // Fine - it's not JSON
          //document.write('<!-- Error: '+err.message+' -->');
      }

      //document.write('<!-- '+postHtml+' -->');

      // Get Post ID from <body> class attribute
      // <body class="single single-post postid-158 single-format-standard logged-in admin-bar no-customize-support custom-background">
      var idBodyClassStart = postHtml.indexOf('postid-');
      var idBodyClassEnd = postHtml.indexOf(' ', idBodyClassStart);
      var idBodyClass = (idBodyClassStart > -1 && idBodyClassEnd > -1) ? postHtml.substring(idBodyClassStart+7, idBodyClassEnd) : false ;

      // Can't check post ID from <link rel="shortcut"> as API links are wp.me links
      // <link rel='shortlink' href='http://blogs.york.ac.uk/student-voices/?p=158' />

      // Check post ID from article id
      // <article id="post-158">
      var idArticleIdStart = postHtml.indexOf('<article id=');
      var idArticleIdEnd = postHtml.indexOf(' ', idArticleIdStart+10);
      var idArticleId = (idArticleIdStart > -1 && idBodyClassEnd > -1) ? postHtml.substring(idArticleIdStart+18, idArticleIdEnd-1) : false ;

      if (idArticleId !== idBodyClass) {
        document.write('<!-- There was an error getting the correct ID from the Wordpress post. Please check the URL you have entered. -->');
      } else {
        document.write('<!-- The post ID is '+idBodyClass+'. -->');
      }

      var postId = idBodyClass || idArticleId;

      onComplete(postId);

    });

  },
  /**
   * Function to get human-readable date from date string
   * @param {string} datestring A date string e.g. 2015-12-02T12:25:15+00:00
   * @returns {string} A human-readable date e.g. 2 December 2015
   */
  getDate: function(datestring) {

    datestring+= ''; // Make sure it's a string

    var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // For some reason this implementation of Rhino doesn't understand a date string - we'll split it on the 'T' and then on the '-'
    //var theDate = new Date(datestring);
    var dateHalf = datestring.split('T');
    var dateBits = dateHalf[0].split('-');
    var theDate = new Date(dateBits[0],dateBits[1]-1,dateBits[2]); // Month is zero-based

    var theDay = theDate.getDate();
    var theMonth = theDate.getMonth();
    var theYear = theDate.getFullYear();

    if (isNaN(theDay) || isNaN(theMonth) || isNaN(theYear)) return 'Unknown date';

    return theDay+' '+monthArray[theMonth]+' '+theYear;

  },
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
     * @returns The JSON escaped version of the input string.
     */
    escapeString: function (input) {
      return org.apache.commons.lang.StringEscapeUtils.escapeJava(input);
    }
  },

  /**
   * Utility functions related to strings.
   * @namespace
   */
  string: {

    /**
     * Function to truncate a string if it's over a specified length.
     * @param  {string} input   The string to be truncated.
     * @param  {string} length  The length that the string should be truncated to.
     * @returns {string} The truncated string.
     */
    truncate: function (input, length) {
      if(input.length() <= length) {
        return input;
      }

      return input.substring(0, length);
    }
  },

  /**
   * Utility functionality related to media.
   * @namespace
   */
  media: {

    /**
     * Get the piece of media in the current language with the provided id.
     * @param {string} The media id.
     * @returns {Object} The media.
     */
    getMedia: function (mediaId) {
      if(this.base.t4.version().startsWith("7")) {
        return com.terminalfour.publish.utils.PublishUtils.getMedia(dbStatement, publishCache, mediaId, language);
      }
      else {
        return com.terminalfour.media.MediaManager.manager.get(dbStatement, mediaId, language);
      }
    },

    /**
     * Get the dimensions of a piece of media that is an image.
     * @param {number} media The piece of media to get the image dimensions of.
     * @returns {Array} The image dimensions as an array of numbers [ width | height ]
     */
    getMediaDimensions: function (media) {
      if (typeof this.base === "undefined") {
        throw "this.base not defined. \"init\" method must be called on main utils object.";
      }

      if ((typeof media === "number") || (!isNaN(media))) {
        media = this.getMedia(media);
      }

      return this.base.content.getImageDimensions(media.getContent(), "media");
    },

    /**
     * Get the id of all variants of the media with the provided id.
     * @param  {string} mediaId The id of the media to get the variants of.
     * @returns {Array} An array of the media variant ids.
     */
    getMediaVariants: function (mediaId) {
      return com.terminalfour.media.MediaManager.getMediaVariants(dbStatement.getConnection(), mediaId, language);
    }
  },

  /**
   * Utility functionality related to content.
   * @namespace
   */
  content: {
    /**
     * Get the dimensions of an element wthin content that contains an image.
     * <p>
     *  It should be noted that in this case the use of the word image refers to
     *  any element within the content that contains and image file, as opposed
     *  to the element being of type 'Image'.
     * </p>
     * @param {string} content The piece of content that contains the element.
     * @param {string} element The element within the content that contains the image.
     * @returns The image dimensions as an array of numbers [ width | height ]
     */
    getImageDimensions: function (content, element) {
      return content.get(element).getImageDimensions();
    }
  },

  /**
   * Utility functions related to arrays.
   * @namespace
   */
  array: {
    /**
     * Get the mimimum value from an array.
       * @param {Array} array The array to get the minimum value from.
       * @returns {number} The minimum value from the array.
     */
    min: function (array) {
      return Math.min.apply(Math, array);
    },
    /**
     * Get the maximum value from an array.
       * @param {Array} array The array to get the maximum value from.
       * @returns {number} The maximum value from the array.
     */
    max: function (array) {
      return Math.max.apply(Math, array);
    }
  },

  /**
   * Internal initialisation function.
   * <p>
   *  It should be noted that this function self destructs (deletes) once called.
   * </p>
   */
  init: function (node) {
    node = node || this;

    node.base = this;

    for (var i in node) {
      if ((i !== "base") && (typeof node[i] === "object")) {
        this.init(node[i]);
      }
    }
    if (this === node) {
      delete this.init;
    }
    return this;
  }
}).init();