var emoji = require('node-emoji'),
  moment = require("moment-timezone");

module.exports = {
  execute: function(bot) {
    var _this = this,
      d = new Date(),
      secondsPastHour = ((d.getMinutes() * 60) + d.getSeconds()) * 1000,
      oneHour = 60 * 60 * 1000;

    setTimeout(function() {
      _this.mrClockerson();
      setInterval(function() {
        _this.mrClockerson();
      }, oneHour);
    }, oneHour - secondsPastHour);
  },

  mrClockerson: function() {
    var _this = this,
      d = new Date();

    d.setMinutes(d.getMinutes() + 1);

    var hour = d.getHours(),
      minutes = d.getMinutes(),
      liveEvent = moment(bot.data("no-git/persist").liveEvent).tz("America/New_York");

    if (d.getDate() == liveEvent.date() && Date.now() < liveEvent.valueOf()) {
      liveEvent = "\n " + bot.helpers.timeString("until", liveEvent.valueOf()) + " until the Live Event!";
    } else {
      liveEvent = "";
    }

    bot.server.channels.find("name", bot.data("config").mainChat).sendMessage("Mr. Clockerson says, " + emoji.emojify(":clock" + (hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour)) + ":") + " \"Tickety-tock, it's " + hour + "'o'clock!\"" + liveEvent);


    bot.helpers.fetchUserData([{
      "action": "fetchPoll",
      "discordId": 0
    }], function(pollData) {
      if (!pollData.poll.endedAt) {
        bot.server.channels.find("name", bot.data("config").mainChat).sendMessage(emoji.emojify(":thought_balloon:") + " #vote now in the current poll, ``" + pollData.poll.name + "``");
      }
    });

    bot.helpers.fetchUserData([{
      "action": "fetchBirthdays",
      "discordId": 0
    }], function(userData) {
      var birthdays = [];

      for (var i = 0, len = userData.birthdays.length; i < len; i++) {
        if (userData.birthdays[i].birthday) {
          var user = bot.server.members.get(userData.birthdays[i].discordId);

          if (user !== undefined) {
            var birthDate = new Date();
            birthDate.setTime(new Date(userData.birthdays[i].birthday));
            birthDate.setFullYear(d.getFullYear());

            // HACK
            birthDate.setDate(birthDate.getDate() + 1);
            if (d.toDateString() == birthDate.toDateString()) {
              user.addRole(bot.server.roles.find('name', 'Birthday Princess'));
              birthdays.push(user.user.username);
            } else {
              try {
                user.removeRole(bot.server.roles.find('name', 'Birthday Princess'));
              } catch (e) {}
            }
          }
        }
      }

      if (birthdays.length > 0) {
        if (birthdays.length > 1) {
          birthdays[birthdays.length - 1] = "and " + birthdays[birthdays.length - 1];
        }

        bot.server.channels.find("name", bot.data("config").mainChat).sendMessage(emoji.emojify(":birthday:") + "  Happy birthday to " + birthdays.join(', ') + "!!  Hurray!!  " + emoji.emojify(":confetti_ball:"));
      }
    });
  }
};