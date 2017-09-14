var Chance = require('chance'),
    chance = new Chance(),
	emoji = require('node-emoji');

module.exports = {
  command: {
    "name": "Give a Bot a Treat",
    "desc": "OM NOM NOM",
    "prompts": [
	  emoji.emojify(':cake:'),
	  emoji.emojify(':birthday:'),
	  emoji.emojify(':icecream:'),
	  emoji.emojify(':shaved_ice:'),
	  emoji.emojify(':ice_cream:'),
	  emoji.emojify(':custard:'),
	  emoji.emojify(':candy:'),
	  emoji.emojify(':lollipop:'),
	  emoji.emojify(':chocolate_bar:'),
	  emoji.emojify(':doughnut:'),
	  emoji.emojify(':cookie:')
	],
    "role": "All",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage(chance.pickone(bot.soul("treatResponses")));
  }
}
