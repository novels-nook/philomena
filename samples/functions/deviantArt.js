var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "deviantArt Link Previews",
    "desc": "Discord and deviantArt do not get along.  Let SoulBot preview the images for you!",
    "priority": 500,
    "noMention": true,
    "prompts": [
      "(http(s)?:\/\/.*deviantart.com\/art\/[^ ]+)"
    ],
    "role": "All",
    "channels": [
      "All"
    ]
  },

  execute: function(bot, args, message) {
    var link = message.content.match(this.command.prompts[0]);

    bot.helpers.getMETA(link[0], function(meta) {
      var responseList = [
        "Oh! Let me get that for you!",
        "Wow, you found a great one!",
        "Here you go!",
        "Look at this!",
        "DeviantArt's previews don't work, but it's okay, I've got your back.",
        "Mr. Peepers thinks this pic is pretty cool.",
        "Oops, you dropped this!",
        "Picture, picture, in the preview, who's the coolest pony of all?  (It's me.)",
        "Aparecium!",
        "<:squee:276843929234571274>"
      ];

      message.reply(chance.pickone(responseList) + " " + meta.image);
    });
  }
}
