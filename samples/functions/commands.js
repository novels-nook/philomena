module.exports = {
  command: {
    "name": "#commands <command>",
    "desc": "A list of commands I respond to.",
    "prompts": [
      "#commands",
      "#command"
    ],
    "role": "All",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var output = "";

    if (args) {
      for (var c = 0, clen = bot.commands.length; c < clen; c++) {
        if (args.containsKeyword(bot.commands[c].prompts)) {
          if (bot.helpers.hasPermission(message.author.id, bot.commands[c].role)) {
            output += bot.commands[c].name + " — " + bot.commands[c].desc;
          }
          break;
        }
      }

      if (output == "") {
        output = "Sorry, I don't recognize that command.  Try \"#commands\" for a list of ones available to you.";
      }

      message.author.sendMessage(output);
    } else {
      message.author.sendMessage("Here is my current list of commands!").then(function() {
        var commands = {};

        for (var c = 0, clen = bot.commands.length; c < clen; c++) {
          if (bot.helpers.hasPermission(message.author.id, bot.commands[c].role) && bot.commands[c].group) {
            if (!commands[bot.commands[c].group]) {
              commands[bot.commands[c].group] = [];
            }

            commands[bot.commands[c].group].push(bot.commands[c]);
          }
        }

        for (var group in commands) {
          var output = "**" + group + "**```\r\n";

          for (var c = 0, clen = commands[group].length; c < clen; c++) {
            output += commands[group][c].name + " — " + commands[group][c].desc + "\r\n";
          }

          output += "```";

          message.author.sendMessage(output);
        }
      });
    }
  }
}
