var emoji = require('node-emoji'),
  moment = require("moment-timezone");

module.exports = {
  execute: function(bot) {
    var _this = this,
      d = new Date(),
      secondsPastHour = ((d.getMinutes() * 60) + d.getSeconds()) * 1000,
      oneHour = 60 * 60 * 1000;

    setTimeout(function() {
      _this.announce();
      setInterval(function() {
        _this.announce();
      }, oneHour);
    }, oneHour - secondsPastHour);
  },

  announce: function() {
    var _this = this,
      d = new Date();

    d.setMinutes(d.getMinutes() + 1);

    var hour = d.getHours(),
      minutes = d.getMinutes();

    bot.server.channels.find("name", bot.config.mainChat).sendMessage(emoji.emojify(":clock" + (hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour)) + ":") + " \"Tickety-tock, it's " + hour + "'o'clock!\"");
  }
};
