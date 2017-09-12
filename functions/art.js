module.exports = {
  command: {
    "name": "#art <keyword>",
    "desc": "Pull up some Q&B art by keyword!",
    "prompts": [
      "#art"
    ],
    "role": "Cadets",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var self = this;

    bot.helpers.fetchUserData([{
      "action": "fetchArt",
      "keyword": args
    }], function(artData) {
      if (!artData.art && (!artData.art.source || !artData.art.image)) {
        message.channel.sendMessage(":no_entry_sign: Sorry, but I can't find any files for ``" + args + "``");
      } else {
        message.channel.sendMessage(":art: <" + artData.art.source + "> \r\n Direct Link: " + artData.art.image);
      }
    });
  }
}