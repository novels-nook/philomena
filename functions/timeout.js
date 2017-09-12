module.exports = {
  command: {
    "name": "#timeout <user>",
    "desc": "Send a user to the penalty box for ten (10) minutes.",
    "prompts": [
      "#timeout"
    ],
    "role": "Royal Guards",
    "group": "Mod Tools",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var users = message.mentions.users.array();

    for (var i = 0, len = users.length; i < len; i++) {
      if (!bot.helpers.isBot(users[i].id)) {
        bot.server.members.get(users[i].id).addRole(bot.server.roles.find('name', 'Timeout'));
      }
    }

    if (users.length > 0) {
      setTimeout(function() {
        for (var i = 0, len = users.length; i < len; i++) {
          bot.server.members.get(users[i].id).removeRole(bot.server.roles.find('name', 'Timeout'));
        }
      }, 600000, users);

      message.channel.sendMessage("Uh-oh!  Somepony's been naughty and has been sent to timeout.");
    }
  }
}