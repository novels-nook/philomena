var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "Where in Equestria is Nen?",
    "desc": "Find the elusive Nen!",
    "prompts": [
      "where is nen",
      "where in equestria is nen",
      "who is nen",
      "where's nen"
    ],
    "role": "Cadets",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage("Looks like " + bot.server.members.get("121300472329011203").displayName + " is in " + chance.pickone(bot.data('no-git/qnbRPG').locations) + "!");
  }
}
