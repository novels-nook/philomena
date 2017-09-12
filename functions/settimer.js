var moment = require("moment-timezone");

moment.tz.setDefault("America/New_York");

module.exports = {
  command: {
    "name": "set timer <time>",
    "desc": "I'll annoy you in a specified amount of time",
    "prompts": [
      "set timer"
    ],
    "group": "Miscellaneous",
    "role": "Cadets",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var d = moment().tz("America/New_York");

    args = arg.split(' ');

    for (var i = 0, len = args.length; i < len; i++) {
      d.add(args[i], args[i + 1]);
      i++;
    }

    var timeUntil = bot.helpers.timeString("until", d.valueOf());

    setTimeout(function() {
      message.author.sendMessage("Your " + timeUntil + " timer is up!");
    }, d.valueOf() - moment().tz("America/New_York").valueOf());

    message.reply("Okay!  I'm going to annoy you in " + timeUntil);
  }
}