var emoji = require('node-emoji'),
  moment = require("moment-timezone");

module.exports = {
  execute: function(bot) {
    var self = this,
      d = new Date(),
      secondsPastHour = ((d.getMinutes() * 60) + d.getSeconds()) * 1000,
      oneHour = 60 * 60 * 1000;

    // check hourly, on the hour
    setTimeout(function() {
      self.check();
      setInterval(function() {
        self.check();
      }, oneHour);
    }, oneHour - secondsPastHour);
  },

  check: function() {
    var d = new Date();
    // is it friday?
    // - yes: check roles on chat channel
    // - yes: if roles need to be updated, update them.
    // - yes: if roles need to be updated, place an announcement message

    // - no: if check roles on chat channel
    // - no: if roles need to be updated, update them.
  }
};
