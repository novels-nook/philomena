module.exports = {
  command: {
    "name": "!clearContext",
    "desc": "If you're tired of me asking contextual prompts over and over, type this to take care of things.",
    "priority": 1000,
    "prompts": [
      "!context"
    ],
    "role": "All",
    "group": "General",
    "channels": [
      "All"
    ]
  },

  execute: function(bot, args, message) {
    bot.helpers.clearContext(message.author.id);
	message.channel.send("Context cleared.");
  }
}
