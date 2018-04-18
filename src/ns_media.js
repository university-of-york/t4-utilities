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
