module.exports = {
  command: {
    "name": "#echo <text>",
    "desc": "I'm not your puppet!... But if you want me to say something, I will.",
    "prompts": [
      "#echo"
    ],
    "role": "Moderators",
    "group": "Mod Tools",
    "channels": [
      "mod-chat",
      "admin",
      "bots"
    ]
  },

  execute: function(bot, args, message) {
    bot.client.channels.find("name", bot.config.mainChat).send(args);
  }
}
