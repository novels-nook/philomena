var Chance = require("chance"),
  chance = new Chance(),
  emoji = require('node-emoji');

module.exports = {
  command: {
    "name": "#roll <x>d<y>",
    "desc": "Roll the dice!",
    "prompts": [
      "#roll"
    ],
    "role": "All",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    try {
      message.channel.send(emoji.emojify(':game_die: ') + " " + message.author.toString() + " rolls a " + chance.rpg(args.split(' ').shift(), {
        sum: true
      }));
    } catch (err) {
      message.channel.send(emoji.emojify(':game_die: ') + " " + message.author.toString() + " rolls a critical failure!");
    }
  }
}
