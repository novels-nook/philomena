var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "Good night!",
    "desc": "THE HATEFUL ORB IS DOWN",
    "prompts": [
      "good night"
    ],
    "role": "All",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.send(chance.pickone(bot.soul("goodNight")));
  }
}
