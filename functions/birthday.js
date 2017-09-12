var moment = require("moment-timezone");

moment.tz.setDefault("America/New_York");

module.exports = {
  command: {
    "name": "#birthday <date>",
    "desc": "Tell me your birthday so I can make you a Princess!",
    "prompts": [
      "#birthday"
    ],
    "role": "Cadets",
    "group": "General",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    bot.helpers.fetchUserData([{
      "action": "fetchUser",
      "discordId": message.author.id
    }], function(userData) {
      var d = moment(new Date(args)).tz("America/New_York").year('2000'),
        users = message.mentions.users.array(),
        birthdays = [];

      if (users.length > 1) {
        for (var i = 0, len = users.length; i < len; i++) {
          if (bot.helpers.isBot(users[i].id)) {
            continue;
          }

          if (bot.helpers.memberHasRole(message.author.id, 'Quills')) {
            for (var i = 0, len = users.length; i < len; i++) {
              var user = bot.server.members.get(users[i].id);

              if (d.isSame(moment().tz("America/New_York").year('2000'), 'day')) {
                user.addRole(bot.server.roles.find('name', 'Birthday Princess'));
                birthdays.push(user.displayName);
              }

              bot.helpers.updateUserData({
                "action": "updateUser",
                "discordId": users[i].id,
                "birthday": '2000-' + d.format('MM-DD')
              });
            }

            message.reply("Okay! They will become a Princess on " + d.format('MMMM Do') + ".");
          } else {
            message.reply("Ooh, planning a birthday party?  Let me look that up for you!!");

            bot.helpers.fetchUserData([{
              "action": "fetchUser",
              "discordId": users[i].id
            }], function(userData) {
              var user = bot.server.members.get(userData.discordId);

              if (userData.birthday) {
                message.channel.sendMessage(user.displayName + "'s birthday is " + moment(userData.birthday).format('MMMM Do') + ".");
              } else {
                message.channel.sendMessage("I don't know when " + user.displayName + "'s birthday is.");
              }
            });
          }
        }
      } else if (userData.birthday) {
        d = moment(userData.birthday);
        message.reply("I have your birthday written down as " + d.format('MMMM Do') + ".  If that's not right, talk to my supervisor!");
      } else {
        if (args == "") {
          message.reply("When is your birthday?");
        } else {
          if (d.format('Do MMMM') == "Invalid date") {
            message.reply("Sorry, but I couldn't understand that date.  Maybe try again?");
          } else {
            message.reply("Okay! You will become a Princess on " + d.format('MMMM Do') + ".");
            bot.helpers.updateUserData({
              "action": "updateUser",
              "discordId": message.author.id,
              "birthday": '2000-' + d.format('MM-DD')
            });
            birthdays.push(message.author.uesrname);
          }
        }
      }

      if (birthdays.length > 0) {
        if (birthdays.length > 1) {
          birthdays[birthdays.length - 1] = "and " + birthdays[birthdays.length - 1];
        }

        message.channel.sendMessage("Wait... that's today!!  Oh my gosh, happy birthday " + birthdays.join(', ') + "!");
      }
    });
  }
}