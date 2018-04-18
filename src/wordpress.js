
  /**
   * Function for getting author details from ID
   * @param {string} authorID     ID of the author
   * @param {string} onComplete   Function to run on completion. Takes categoryId as argument.
   * @returns {(Object|boolean)} Author object or false if ID doesn't match an author
   */
  getAuthor: function(authorID, onComplete) {

    var authorDetails = false;

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
