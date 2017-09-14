var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "Good morning!",
    "desc": "THE HATEFUL ORB IS UP",
    "prompts": [
      "good morning"
    ],
    "role": "All",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage(chance.pickone(bot.soul("goodMorning")));
  }
}
