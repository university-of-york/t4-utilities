/**
   * Function to get human-readable date from date string
   * @param {string} datestring A date string e.g. 2015-12-02T12:25:15+00:00
   * @returns {string} A human-readable date e.g. 2 December 2015
   */
  getDate: function(datestring) {

    datestring+= ''; // Make sure it's a string

    var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // For some reason this implementation of Rhino doesn't understand a date string - we'll split it on the 'T' and then on the '-'
    //var theDate = new Date(datestring);
    var dateHalf = datestring.split('T');
    var dateBits = dateHalf[0].split('-');
    var theDate = new Date(dateBits[0],dateBits[1]-1,dateBits[2]); // Month is zero-based

    var theDay = theDate.getDate();
    var theMonth = theDate.getMonth();
    var theYear = theDate.getFullYear();

    if (isNaN(theDay) || isNaN(theMonth) || isNaN(theYear)) return 'Unknown date';

    return theDay+' '+monthArray[theMonth]+' '+theYear;

  },
