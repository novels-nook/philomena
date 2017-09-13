var emoji = require('node-emoji'),
  moment = require("moment-timezone");

moment.tz.setDefault("America/New_York");

module.exports = {
  command: {
    "name": "live event",
    "desc": "If I know when the next Live Event is, I'll tell you!",
    "prompts": [
      "live event"
    ],
    "role": "Cadets",
    "group": "Information",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    if (bot.data("no-git/persist").liveEvent > Date.now()) {
      var d = moment(bot.data("no-git/persist").liveEvent).tz("America/New_York");

      message.channel.sendMessage("The next live event is at " + d.format('Do MMMM YYYY H:mm z') + ".  Mark your " + emoji.emojify(":calendar_spiral:") + "!  For more information, check out <http://quillnblade.com/live-events>.  You can listen to all the past Live Events at <http://bit.ly/qnbliveevents>");
    } else {
      message.channel.sendMessage("I don't know when the next live event is yet, but you can always check out <http://quillnblade.com/live-events> in case the Quills just haven't told me when it is yet.  You can listen to all the past Live Events at <http://bit.ly/qnbliveevents>");
    }
  }
}