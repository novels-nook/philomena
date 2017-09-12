var Chance = require("chance"),
  chance = new Chance();

module.exports = {
  command: {
    "name": "#vote <freeform option>",
    "desc": "Vote during a poll event!",
    "prompts": [
      "#vote",
      "#poll"
    ],
    "role": "Cadet",
    "channels": [
      "general-chat"
    ]
  },

  votingData: {},

  execute: function(bot, args, message) {
    var self = this;

    bot.helpers.fetchUserData([{
      "action": "fetchPoll",
      "discordId": message.author.id
    }], function(pollData) {
      self.votingData = pollData.poll;

      if (args.startsWith("leaderboard")) {
        self.votingLeaderboard(message);
      } else if (args.startsWith("start")) {
        self.votingStart(args, message);
      } else if (args == "end" || args == "stop") {
        self.votingEnd(message);
      } else if (args == "current") {
        self.votingCurrent(message);
      } else {
        self.vote(args, message);
      }
    });
  },

  vote: function(args, message) {
    if (this.votingData.endedAt) {
      message.channel.sendMessage("There is no currently active poll to vote in.");

      return false;
    }

    for (var i = 0, len = this.votingData.votes.length; i < len; i++) {
      if (this.votingData.votes[i].userId == message.author.id) {
        message.channel.sendMessage("Pink Pony has already dealt ``" + this.votingData.votes[i].vote + "`` " + this.votingData.votes[i].pts + " pts!");
        return false;
      }
    }

    var voteData = {
      vote: args,
      pts: chance.rpg("1d100", {
        sum: true
      })
    };

    bot.helpers.updateUserData([{
      "action": "insertPollVote",
      "pollId": this.votingData.id,
      "discordId": message.author.id,
      "vote": voteData.vote,
      "pts": voteData.pts
    }]);
    message.channel.sendMessage("Pink Pony has dealt ``" + voteData.vote + "`` " + voteData.pts + " points!");
  },

  votingCurrent: function(message) {
    if (!this.votingData.endedAt) {
      message.channel.sendMessage("The current poll is ``" + this.votingData.name + "``");
    } else {
      message.channel.sendMessage("There is no poll running currently.");
    }
  },

  votingLeaderboard: function(message) {
    var output = "The leaders of ``" + this.votingData.name + "`` are:\r\n```\r\n",
      flattenedVotes = [];

    for (var i = 0, len = this.votingData.votes.length; i < len; i++) {
      if (!flattenedVotes[this.votingData.votes[i].vote]) {
        flattenedVotes[this.votingData.votes[i].vote] = 0;
      }

      if (bot.helpers.containsWholeKeyword(message.content, ["total", "totals"])) {
        flattenedVotes[this.votingData.votes[i].vote]++;
      } else {
        flattenedVotes[this.votingData.votes[i].vote] = Math.max(flattenedVotes[this.votingData.votes[i].vote], this.votingData.votes[i].pts);
      }
    }

    flattenedVotes.sort(function(a, b) {
      return flattenedVotes[a] - flattenedVotes[b];
    });

    var i = 0;

    for (var vote in flattenedVotes) {
      if (i == 10) {
        break;
      }

      output += vote + ": " + flattenedVotes[vote] + " " + (bot.helpers.containsWholeKeyword(message.content, ["total", "totals"]) ? "votes" : "pts") + "\r\n";

      i++;
    };

    output += "```";

    message.channel.sendMessage(output);
  },

  votingStart: function(args, message) {
    if (!bot.helpers.hasPermission(message.author.id, "Royal Guards")) {
      message.channel.sendMessage("You are not authorized to start polls!");

      return false;
    }

    var poll = args.replace("start", "").trim();

    if (this.votingData.id > 0 && !this.votingData.endedAt) {
      message.channel.sendMessage("The current poll is ``" + this.votingData.name + "``");
    } else {
      bot.helpers.updateUserData([{
        "action": "updatePoll",
        "pollId": 0,
        "name": poll
      }]);

      message.channel.sendMessage("Okay, everypony!  Start voting in the poll ``" + poll + "`` by telling me #vote <freeform option>.  If you have any questions, just ask Anzel or Crystal!");
    }
  },

  votingEnd: function(message) {
    if (!bot.helpers.hasPermission(message.author.id, "Royal Guards")) {
      message.channel.sendMessage("You are not authorized to end polls!");

      return false;
    }

    bot.helpers.updateUserData([{
      "action": "updatePoll",
      "pollId": this.votingData.id
    }]);
    message.channel.sendMessage("The poll for ``" + this.votingData.name + "`` has closed!");
  }
}