module.exports = {
  command: {
    "name": "#mercy <user>",
    "desc": "Show mercy to a user in the penalty box.",
    "prompts": [
      "#mercy"
    ],
    "role": "Royal Guards",
    "group": "Mod Tools",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var users = bot.helpers.getMentions(message.content);

    for (var i = 0, len = users.length; i < len; i++) {
      users[i].removeRole(bot.server.roles.find('name', 'Timeout'));
    }
  }
}