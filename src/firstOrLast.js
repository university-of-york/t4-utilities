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
