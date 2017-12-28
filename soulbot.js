var Discord = require('discord.js'),
  glob = require('glob'),
  fs = require('fs'),
  moment = require('moment-timezone'),
  brain = require('natural'),
  memory = require('node-persist'),
  chance = require('chance');

moment.tz.setDefault("America/New_York");
memory.initSync();

var SoulBot = new function() {
  this.client = new Discord.Client();
  this.connected = false;
  this.brain = brain;
  this.memory = memory;
  this.random = new chance();
  this.cache = [];
  this.commands = [];
  this.helpers = {};
  this.pings = {};
  this.config = JSON.parse(fs.readFileSync("./config.json"));

  this.run = function() {
    var bot = this;

    bot.client.login(bot.config.clientId);

    bot.client.on("ready", function() {
      console.log("Logged in as " + bot.client.user.username + " (" + bot.client.user.id + ")");
      console.log("No matter who I am logged in as, I am still SoulBot at heart.");

      if (bot.client.guilds.length == 0) {
        console.error("Please add me to a server first!");

        return false;
      }

      var servers = bot.client.guilds.array();

      servers.sort(function (a, b) {
        return a.joinedTimestamp - b.joinedTimestamp;
	  });

      bot.server = servers.shift();

      if (servers.length > 0) {
        console.log("My home is " + bot.server.name + ", but I am also hanging out in:");

        for (var i = 0, len = servers.length; i < len; i++) {
          console.log(" - " + servers[i].name);
        }
      } else {
        console.log("I currently live in " + bot.server.name + ".");
      }

      if (!bot.connected) {
        bot.connected = true;

        glob('./+(helpers|functions|timers)/**/*.js', function(err, files) {
          for (var i = 0, len = files.length; i < len; i++) {
            var path = files[i],
              file = require(path),
              folder = files[i].split('/');

            folder = folder[1];

            switch (folder) {
              case 'functions':
                if (file.command) {
                  file.command.path = path;
                  bot.commands.push(file.command);
                } else {
                  console.error(path + ' does not have COMMAND information.');
                }
                break;
              case 'helpers':
                bot.helpers = Object.assign(bot.helpers, file(bot));
                break;
              case 'timers':
                file.execute(bot);
                break;
            }
          }

          bot.commands.sort(function(a, b) {
            if (a.priority && b.priority) {
              return a.priority > b.priority ? -1 : 1;
            } else if (a.priority) {
              return -1;
            } else {
              return 1;
            }
          });

          // Shortcut the data & soul helpers function
          bot.data = bot.helpers.data;
          bot.soul = bot.helpers.soul;

          // Clear memory
          delete require.cache[require.resolve(path)];
        });
      }
    });

    bot.client.on("disconnected", function(err) {
      console.log("Disconnected.  Logging back in.");
      setTimeout(function() {
        bot.client.loginWithToken(bot.config.clientId);
      }, 5000);
    });

    bot.client.on("guildMemberAdd", function(user) {
      setTimeout(function() {
          if (bot.config.announceNewUsers) {
            bot.server.channels.find("name", bot.config.mainChat).send(bot.soul("configuration").newUser.messageServer.replace("{newUser}", user.toString()));
          }

          if (bot.config.greetNewUsersPersonally) {
            user.send(bot.soul("configuration").newUser.messageUser);
          }
        },
        2500
      );
    });

    bot.client.on("message", function(message) {
      if (!bot.helpers.isBot(message.author.id)) {
        // Empty the cache
        for (var key in bot.cache) {
          delete bot.cache[key];
        }

        var isMentioned = false;

        if (message.channel.type == "dm" || message.isMentioned(bot.client.user)) {
          if (bot.pings[message.channel.id] >= Date.now() - 500) {
            message.reply(bot.soul("configuration").overloaded);
            return false;
          }

          bot.pings[message.channel.id] = Date.now();

          var context = bot.helpers.getContext(message.author.id);

          if (context && !bot.helpers.containsKeyword(message.content, "!context")) {
            delete require.cache[require.resolve(context.command)];
            theFunction = require(context.command);

            if (bot.helpers.isChannel(message.channel, theFunction.command.channels)) {
              var args = message.cleanContent.replace('@' + bot.client.user.username, '').trim();
              theFunction.context = context;
              theFunction.execute(bot, args, message);
              return false;
            }
          }

          isMentioned = true;
        }

        for (var c = 0, clen = bot.commands.length; c < clen; c++) {
          var command = bot.commands[c];

          for (var p = 0, plen = command.prompts.length; p < plen; p++) {
		    var prompt, args, match;

			if (command.prompts[p] instanceof RegExp) {
			  prompt = command.prompts[p];
			}
			else {
			  prompt = new RegExp(command.prompts[p].replace(/\s/g, "\\s?"), "gi");
			}

            if (command.conversational) {
              args = message.cleanContent.replace('@' + bot.client.user.username, '').trim();

              try {
                match = (bot.brain.JaroWinklerDistance(command.prompts[p], message.cleanContent) + bot.brain.DiceCoefficient(command.prompts[p], message.cleanContent)) / 2 >= .70;
              } catch (e) {
                match = false;
              }
            } else {
              args = message.cleanContent.split(prompt).pop().trim()
              match = message.cleanContent.match(prompt);
            }

            if (
              match && // is a match
              bot.helpers.isChannel(message.channel, command.channels) && // Correct channel
              bot.helpers.hasPermission(message.author.id, command.role) && // Correct permission level
              (
                isMentioned || // Is mentioned OR
				// Doesn't require mentioning and triggers likelihood check (default: always)
                (command.noMention && bot.random.bool({ likelihood: command.noMentionLikelihood || 100 }))
              )
            ) {
              try {
                delete require.cache[require.resolve(command.path)];
                theFunction = require(command.path);
                theFunction.execute(bot, args, message);
              } catch (err) {
                console.log(err);
              }

              return true;
            }
          }
        }

        bot.helpers.basicResponse(message);
      }
    });
  };
}

SoulBot.run();


// move these or something idk
function unique(elem, pos, arr) {
  return arr.indexOf(elem) == pos;
}

if (!Date.now) {
  Date.now = function() {
    return new Date().getTime();
  }
}

moment.createFromInputFallback = function(config) {
  config._d = new Date(config._i);
};

String.prototype.lcFirst = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
}

String.prototype.ucFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.ucEach = function() {
  var str = this.split(' ');

  for (var i = 0, len = str.length; i < len; i++) {
    str[i] = str[i].ucFirst();
  }

  return str.join(' ');
}

String.prototype.decode = function() {
  var str = this;

  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
}
