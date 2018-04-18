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
