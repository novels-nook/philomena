var emoji = require('node-emoji');

module.exports = {
  command: {
    "name": "what time is it | what is the time",
    "desc": "Mr. Clockerson will tell you what time it is (Eastern Time).",
    "prompts": [
      "what is the time",
      "what time is it"
    ],
    "role": "Cadets",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var d = new Date(),
      hour = d.getHours(),
      minutes = d.getMinutes();

    message.channel.sendMessage("Mr. Clockerson says, " + emoji.emojify(":clock" + (hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour)) + ":") + " \"Tick tickety tick, it's " + hour + ":" + (minutes > 9 ? minutes : ('0' + minutes)) + "!\"");
  }
}