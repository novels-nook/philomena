var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "#prompt",
    "desc": "A randomly generated writing prompt.",
    "group": "General",
    "prompts": [
      "#prompt"
    ],
    "role": "Cadets",
    "channels": [
      "creative-corner", "bots"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage("Hold on, Mr. Peepers has a great idea for a story!  Let's see what he says...");

    bot.helpers.getJSON({
      url: "https://thestoryshack.com/api/writing-prompt-generator/"
    }, function(data) {
      var protagonist = chance.pickone(bot.data('no-git/qnbRPG').questGivers.concat(bot.data('no-git/qnbRPG').adversaries)),
        character = data.character.lcFirst().replace(/man/g, protagonist.race),
        description = data.bonus.replace(/no one/g, 'nopony');

      message.channel.sendEmbed({
        title: '"' + data.sentence + '"',
        description: description,
        fields: [{
            name: "Genre",
            value: data.genre
          },
          {
            name: "Location",
            value: chance.pickone(bot.data('no-git/qnbRPG').locations).ucFirst()
          },
          {
            name: "Protagonist",
            value: protagonist.name + ' as ' + character
          },
          {
            name: "Special Prop",
            value: data.prop
          }
        ],
        footer: {
          icon_url: "https://thestoryshack.com/wp-content/uploads/2017/06/story-shack-logo.png",
          text: "The Story Shack"
        }
      });
    });
  }
}