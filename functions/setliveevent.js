var moment = require("moment-timezone");

moment.tz.setDefault("America/New_York");

module.exports = {
  command: {
    "name": "#set live event",
    "desc": "Set the date for the next live event.",
    "prompts": [
      "#set live event"
    ],
    "role": "Quills",
    "group": "Mod Tools",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var d = moment(args).tz("America/New_York");

    bot.data("no-git/persist");
    bot.cache['no-git/persist'].liveEvent = d.valueOf();
    bot.helpers.updateData("no-git/persist");

    message.channel.sendMessage("Okay!  I will tell everypony that the next live event is at " + d.format('Do MMMM YYYY H:mm z') + ".");
  }
}