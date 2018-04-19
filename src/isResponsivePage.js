/**
 * Function to find out if current content is on a responsive page
 * <p>
 * <b>TO DO:</b> find the group it belongs to instead of Page Layout ID
 * </p>
 * @returns {boolean}
 */
isResponsivePage: function() {

  this.writeLog("fn", "isResponsivePage");

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
