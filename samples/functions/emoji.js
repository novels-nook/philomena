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
    ]
  },
  execute: function(bot, args, message) {
    var output = "";

    bot.server.emojis.map(function(emoji) {
      output += emoji.toString() + " :" + emoji.name + ": \r\n";
    });

    message.channel.sendMessage(output).catch(console.error);
  }
}
