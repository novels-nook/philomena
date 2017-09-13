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
      console.log("AzuBOT is ready!");

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
          bot.server.channels.find("name", "general-chat").sendMessage("I spy with my little eye... somepony new to the Q&B Discord server!  Everypony say hello to " + user.toString() + "!  Once you get flagged as a Cadet, PM me #commands for a list of the fun things I can do.  If you haven't, don't forget to read the rules: <http://quillnblade.com/discord-app>");
          user.sendMessage("Welcome to the Q&B server!  I am the official Automated Pony Relations Pony, Azurite!  You can use the command ``#commands`` to see a list of everything I can do.  Be sure you read the rules, especially the part about how to become a Cadet!  <http://quillnblade.com/discord-app>");
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

        if (isDeviantArtLink) {
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
              message.reply("Whoa!  Hold on, I'm a little overloaded at the moment.  Try again in a sec, 'kay?");
              return false;
            }

            bot.pings[message.channel.id] = Date.now();

            for (var c = 0, clen = bot.commands.length; c < clen; c++) {
              for (var p = 0, plen = bot.commands[c].prompts.length; p < plen; p++) {
                var prompt = new RegExp("\\b" + bot.commands[c].prompts[p].replace(/\s/g, "\\s?") + "\\b", "gi");

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
