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
    delete this.init;
  }
  return this;
}
}).init();
