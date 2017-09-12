module.exports = {
  command: {
    "name": "Tell Nen",
    "desc": "It's hard to find Nen, so I'll find him for you.",
    "prompts": [
      "tell nen"
    ],
    "role": "Cadets",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage(bot.server.members.get("121300472329011203").toString() + " " + message.author.username + " says: " + args);
  }
}