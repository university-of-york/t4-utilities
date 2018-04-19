/**
 * Function to process the T4 Tag that is provided as a parameter.
 * @param {string} t4Tag       The T4 Tag to be processed
 * @param {string} mySection   The Section to process the tag within (defaults to "section", i.e. the one you're calling from)
 * @param {string} myContent   The Content to process the tag within (defaults to "content", i.e. the one you're calling from)
 * @returns {string} The result of the processed tag.
 */
processTags: function (t4Tag) {
  this.writeLog("fn", "processTags");
  var myContent = content || null;
  return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag);
},
