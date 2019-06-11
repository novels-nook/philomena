module.exports = {
  command: {
    "name": "#emoji",
    "desc": "A list of all Q&B Server emoji.",
    "group": "General",
    "prompts": [
      "#emoji"
    ],
    "role": "All",
    "channels": [
      "All"
    ],
    "noMention": true
  },
  execute: function(bot, args, message) {
    var output = "";

    bot.server.emojis.map(function(emoji) {
      output += emoji.toString() + " :" + emoji.name + ": \r\n";
      if (output.length >= 1500) {
        message.channel.send(output).catch(console.error);
        output = "";
      }
    });

    if (output.length > 0) {
      message.channel.send(output).catch(console.error);
    }
  }
}