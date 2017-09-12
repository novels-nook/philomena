module.exports = {
  command: {
    "name": "#echo <text>",
    "desc": "I'm not your puppet!... But if you want me to say something, I will.",
    "prompts": [
      "#echo"
    ],
    "role": "Royal Guards",
    "group": "Mod Tools",
    "channels": [
      "mod-chat",
      "admin",
      "bots"
    ]
  },

  execute: function() {
    this.bot.client.channels.find("name", "general-chat").sendMessage(this.args);
  }
}