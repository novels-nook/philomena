var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "Hello World",
    "desc": "Greetings and salutations from the bot!",
    "prompts": [
      "hello", "hiya", "hi there", "hi"
    ],
    "role": "All",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage(chance.pickone(bot.soul("helloWorld")));
  }
}
