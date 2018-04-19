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
    if (!item) return false;
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
