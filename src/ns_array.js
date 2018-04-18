/**
 * Utility functions related to arrays.
 * @namespace
 */
array: {
  /**
   * Get the mimimum value from an array.
   * @param {Array} array The array to get the minimum value from.
   * @returns {number} The minimum value from the array.
   */
  min: function (array) {
    return Math.min.apply(Math, array);
  },
  /**
   * Get the maximum value from an array.
   * @param {Array} array The array to get the maximum value from.
   * @returns {number} The maximum value from the array.
   */
  max: function (array) {
    return Math.max.apply(Math, array);
  }
},
