var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "deviantArt Link Previews",
    "desc": "Discord and deviantArt do not get along.  Let SoulBot preview the images for you!",
    "priority": 500,
    "noMention": true,
    "noMentionLikelihood": 100,
    "prompts": [
      "(http(|s):\/\/(www|[a-zA-Z0-9\-\_]+)\.deviantart.com(|\/[a-zA-Z0-9\-\_]+)\/art\/[a-zA-Z0-9\-\_]+)"
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
        // "*Somepony get Novel to fix this! I'm tired of doing all the work around here!*",
        "*Silly filly, here's the right link!*",
        "*Needs more phoenix.*",
        "*Asanda warned me this might happen, but I didn't listen.*",
        "*DeviantArt's previews don't work, but it's okay, I was bored anyway.*",
        "*You're sure about this one? Well, okay.*",
        "*Oh yeah, this one! Faerana wouldn't stop singing about this pic.*",
        "*Yay! Something to do! Celestia had me on timeout after I burned Blueblood's mane off... again.*",
        // "*No matter what's in this picture, I'm hotter. Comes with being a phoenix.*",
        "*Hey, don't blame me! You're the one who picked it!*",
        "*Hmm... not bad. Not bad at all.*"
      ];

      message.reply(chance.pickone(responseList) + " " + meta.image);
    });
  }
}