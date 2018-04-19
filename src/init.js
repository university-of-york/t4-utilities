/**
 * Internal initialisation function.
 * <p>
 * It should be noted that this function self destructs (deletes) once called.
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
      // This should be called once when a PL initialises
      // Get the content type and content layout
      importPackage(com.terminalfour.template);
      importPackage(com.terminalfour.sitemanager);
      try {
        var tid = content.getTemplateID();
        var tempManager = com.terminalfour.template.TemplateManager.getManager();
        var templateName = tempManager.getName(dbStatement, tid);
        this.console.log("templateName is "+templateName);
        this.writeLog("pl", "init called by "+templateName+" using ???");
      } catch(e) {
        this.console.log("Error thrown");
      }

      delete this.init;
    }
  return this;
},
