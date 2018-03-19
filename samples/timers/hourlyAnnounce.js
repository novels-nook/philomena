var emoji = require('node-emoji'),
  moment = require("moment-timezone");

module.exports = {
  execute: function(bot) {
    var self = this,
      d = new Date(),
      secondsPastHour = ((d.getMinutes() * 60) + d.getSeconds()) * 1000,
      oneHour = 60 * 60 * 1000;

    setTimeout(function() {
      self.announce();
      setInterval(function() {
        self.announce();
      }, oneHour);
    }, oneHour - secondsPastHour);
  },

  announce: function() {
    var d = new Date();

    d.setMinutes(d.getMinutes() + 1);

    var hour = d.getHours();

    bot.server.channels.find("name", bot.config.mainChat).send(emoji.emojify(":clock" + (hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour)) + ":") + " \"Tickety-tock, it's " + hour + "'o'clock!\"");
  }
};
