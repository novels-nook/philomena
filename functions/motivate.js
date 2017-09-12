var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "motivate",
    "desc": "I'll help motivate you!",
    "prompts": [
      "motivate"
    ],
    "role": "Cadets",
    "group": "General",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var responseList = bot.data('motivate')["general"];

    if (bot.helpers.containsKeyword(message.content, ["write", "writing"])) {
      responseList = responseList.concat(bot.data('motivate')["writing"]);
    }

    if (bot.helpers.containsKeyword(message.content, "chores")) {
      responseList = responseList.concat(bot.data('motivate')["chores"]);
    }

    if (bot.helpers.containsKeyword(message.content, ["draw", "art"])) {
      responseList = responseList.concat(bot.data('motivate')["drawing"]);
    }

    message.channel.sendMessage(chance.pickone(responseList));
  }
}