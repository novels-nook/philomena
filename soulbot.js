var Discord = require("discord.js"),
  Chance = require("chance"),
  chance = new Chance(),
  glob = require("glob"),
  fs = require("fs"),
  moment = require("moment-timezone"),
  timeouts = [];

var AzuBot = new function() {
  this.client = new Discord.Client();

  this.connected = false;
  this.cache = [];
  this.commands = [];
  this.helpers = {};
  this.pings = {};
  this.config = JSON.parse(fs.readFileSync("./data/no-git/config.json"));

  this.run = function() {
    var bot = this;

    bot.client.login(bot.config.clientId);

    bot.client.on("ready", function() {
      console.log("SoulBOT is ready!");

      bot.server = bot.client.guilds.get(bot.config.guildId);

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

            bot.commands.sort(function (a, b) {
              if (a.priority && b.priority) {
                return a.priority > b.priority ? -1 : 1;
              }
              else if (a.priority) {
                return -1;
              }
              else {
                return 1;
              }
            });

            // Shortcut the data & soul helpers function
            bot.data = bot.helpers.data;
			bot.soul = bot.helpers.soul;

            // Clear memory
            delete require.cache[require.resolve(path)];
          }
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
            bot.server.channels.find("name", bot.config.mainChat).send(bot.soul("newUserGreeting").serverMessage.replace("{newUser}", user.toString()));
		  }
          if (bot.config.greetNewUsersPersonally) {
            user.sendMessage(bot.soul("newUserGreeting").userMessage);
		  }
        },
        2500
      );
    });

    bot.client.on("message", function(message) {
      // Empty the cache
      for (var key in bot.cache) {
        delete bot.cache[key];
      }

      if (!bot.helpers.isBot(message.author.id)) {
        var isDeviantArtLink = message.content.match("(http(s)?:\/\/.*.deviantart.com\/art\/[^ ]+)");

        if (isDeviantArtLink && bot.config.previewDeviantArt) {
          bot.helpers.getMETA(isDeviantArtLink[0], function(meta) {
            var responseList = [
              "Oh!  Let me get that for you!",
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
        } else if (message.channel.type == "dm" || message.isMentioned(bot.client.user)) {
          bot.helpers.isNobody(message.author.id).then(function(user) {
            if (bot.pings[message.channel.id] >= Date.now() - 500) {
              message.reply("Whoa!  Hold on, I'm a little overloaded at the moment.  Try again in a sec!!\nhttps://i.imgur.com/ciCUOiM.png");
              return false;
            }

            bot.pings[message.channel.id] = Date.now();

            for (var c = 0, clen = bot.commands.length; c < clen; c++) {
              for (var p = 0, plen = bot.commands[c].prompts.length; p < plen; p++) {
			    var prompt = bot.commands[c].prompts[p].replace(/\s/g, "\\s?") + "\\b";

				if (prompt[0] == bot.config.promptCharacter) {
				  prompt[0] = bot.config.promptCharacter + "\\b";
				}
				else {
                  prompt = "\\b" + prompt;
				}

                var prompt = new RegExp(prompt, "gi");

                if (message.content.match(prompt) && bot.helpers.isChannel(message.channel, bot.commands[c].channels) && bot.helpers.hasPermission(message.author.id, bot.commands[c].role)) {
                  var args = message.content.split(prompt).pop().trim();

                  try {
                    delete require.cache[require.resolve(bot.commands[c].path)];
                    theFunction = require(bot.commands[c].path);
                    theFunction.execute(bot, args, message);
                  } catch (err) {
                    console.log(err);
                  }

                  return true;
                }
              }
            }

            bot.helpers.basicResponse(message);
          }).catch(function(err) {
            console.log(err);
          });
        }
      }
    });
  };
}

AzuBot.run();

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
