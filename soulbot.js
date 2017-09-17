var Discord = require("discord.js"),
  glob = require("glob"),
  fs = require("fs"),
  moment = require("moment-timezone"),
  heart = require('fuse.js'),
  chance = require('chance'),
  chance = new chance();

var SoulBot = new function() {
  this.client = new Discord.Client();
  this.connected = false;
  this.cache = [];
  this.commands = [];
  this.helpers = {};
  this.pings = {};
  this.config = JSON.parse(fs.readFileSync("./data/config.json"));

  this.run = function() {
    var bot = this;

    bot.client.login(bot.config.clientId);

    bot.client.on("ready", function() {
      console.log("Logged in as " + bot.client.user.username + " (" + bot.client.user.id + ")");
      console.log("No matter who I am logged in as, I am still SoulBot at heart.")
      console.log("Currently connected to:")
      bot.client.guilds.map(server => server.name).forEach(function(item) {console.log("  - " + item);})

      bot.server = bot.client.guilds.get(bot.config.guildId);

      if (!bot.connected) {
	    var prompts = [];

        bot.connected = true;

        glob('./+(helpers|functions|timers|heart)/**/*.js', function(err, files) {
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
			  case 'heart':
			    prompts.push(file);
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

			bot.heart = new heart(prompts, { keys : ['prompts'], threshold : 0.5 });

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
      if (!bot.helpers.isBot(message.author.id)) {
        bot.helpers.isNobody(message.author.id).then(function(user) {
      // Empty the cache
      for (var key in bot.cache) {
        delete bot.cache[key];
      }

	  var isMentioned = false;

		    if (message.channel.type == "dm" || message.isMentioned(bot.client.user)) {
              if (bot.pings[message.channel.id] >= Date.now() - 500) {
                message.reply("Whoa! Hold on, I'm a little overloaded at the moment. Try again in a sec!!\nhttps://i.imgur.com/ciCUOiM.png");
                return false;
              }

              bot.pings[message.channel.id] = Date.now();
			  isMentioned = true;
			}

            for (var c = 0, clen = bot.commands.length; c < clen; c++) {
              for (var p = 0, plen = bot.commands[c].prompts.length; p < plen; p++) {
                var prompt = new RegExp(bot.commands[c].prompts[p].trim().replace(/^([^A-Z0-9])?([A-Z0-9_])([^A-Z0-9])?$/gi, "$1\\b$2\\b$3").replace(/\s/g, "\\s?"), "gi");

                if (
				      message.content.match(prompt) && // Prompt matches
				      bot.helpers.isChannel(message.channel, bot.commands[c].channels) && // Correct channel
					  bot.helpers.hasPermission(message.author.id, bot.commands[c].role) && // Correct permission level
					  (bot.commands[c].noMention || isMentioned) // Doesn't require mentioning or bot is mentioned
				   ) {
                  try {
                    delete require.cache[require.resolve(bot.commands[c].path)];
                    theFunction = require(bot.commands[c].path);
                    theFunction.execute(bot, message.content.split(prompt).pop().trim(), message);
                  } catch (err) {
                    console.log(err);
                  }

                  return true;
                }
              }
            }

			var thought = bot.heart.search(message.cleanContent);

			if (thought.length > 0) {
			  try {
			    if (isMentioned || (thought[0].noMention && chance.bool({ likelihood : 10 }))) {
                  message.channel.send(chance.pickone(thought[0].execute(bot, message.content.split(' '), message)));
				}
			  } catch (err) {
                console.log(err);
			  }
			}
			else if (isMentioned) {
              bot.helpers.basicResponse(message);
			}
          }).catch(function(err) {
            console.log(err);
          });
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
