/**
 * Get a variant according to opts, or create one if it doesn't exist
 * @param {Object[]} opts Options object, containing
 * @param {string} opts[].contentName The name of the Content Element with the image
 * @param {string} opts[].variantName The name of the variant
 * @returns {(string|boolean)} variant id if it exists, false if not
 */
getVariant: function(opts) {

  this.writeLog("fn", "getVariant");

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
