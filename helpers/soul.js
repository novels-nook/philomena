module.exports = function (bot) {
  return {
    Soul : class Soul {
      constructor () {
        bot.on('messageReceived', (bot, msg) => {
          if (['message_replied'].includes(msg.originalEvent.subtype)) {
            return false; 
          }
          
          let {commands} = bot;

          var foundCommand = false;

          for (let command of commands) {
            if (command.members && command.members.indexOf(msg.sender.id) == -1) {
              continue;
            }
            
            if (!command.prompts) {
              continue;
            }

            for (let prompt of command.prompts) {
              if (!(prompt instanceof RegExp)) {
                prompt = new RegExp(prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
              }

              if (msg.content.match(prompt)) {
                delete require.cache[require.resolve(command.path)];

                let file = require(command.path);

                file.execute(bot, msg, msg.content.split(prompt).pop().trim());

                foundCommand = true;
                break;
              }
            }

            if (foundCommand) {
              break;
            }
          }

          if (!foundCommand) {
            this.respond(msg);
          }
        });
      }

      respond (msg) {
        this.defaultResponse(msg);
      }

      defaultResponse (msg) {
        bot.sendMessage(msg.channel, bot.random.pickone([
            "What's up?",
            "Huh?",
            "Sorry, I don't understand."
          ])
        );
      }
    }
  }
}
