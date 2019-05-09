module.exports = function (bot) {
  return {
    messageReceived : (msg) => {
      return new Promise( async (resolve, reject) => {
        switch (bot.config.connector) {
          case 'discord':
            if (msg.author.id != bot.user.id) {
              let member = await bot.fetchMemberBy('author', msg);

              let channel = await bot.fetchChannelBy('message', msg);

              if (member && channel) {
                return resolve({
                  sender: member,
                  channel: channel,
                  content: msg.content,
                  timestamp: Date.now(),
                  originalEvent: msg
                });
              }
            }
            break;
          case 'slack':
            if (msg.type == "message" && !msg.subtype) {
              let member = await bot.fetchMemberBy('id', msg.user);

              let channel = await bot.fetchChannelBy('id', msg.channel);

              if (member && channel) {
                return resolve({
                  sender: member,
                  channel: channel,
                  content: msg.text,
                  timestamp: msg.ts,
                  originalEvent: msg
                });
              }
            }

            break;
          case 'local':
            let member = bot.config.mockData.user;

            let channel = bot.config.mockData.channel;

            return resolve({
              sender: member,
              channel: channel,
              content: msg,
              timestamp: '',
              originalEvent: msg
            });

            break;
        }

        resolve(null);
      });
    },

    /* Send a message. */
    sendMessage : function (target, content, args = {}) {
      return new Promise( (resolve, reject) => {
        bot.checkObject(target, { id : '' }, (err) => {
          if (err) {
            throw err;
          }

          args.sendMessage = true;

          bot.emit('sendingMessage', bot, { target : target, content : content, args : args });

          if (args.sendMessage) {
            switch (bot.config.connector) {
              case 'discord':
                target.ref.send(content);
                break;
              case 'slack':
                bot.client.webClient.chat.postMessage({
                  channel: target.id,
                  text: content
                }).then( (result) => {
                  resolve(result);
                });

                break;
              case 'local':
                console.log(content);

                bot.client.question('> ', (response) => {
                  bot.messageReceived(response).then( (msg) => {
                    bot.emit('messageReceived', this, msg);
                  });
                });
                break;
            }
          }
        });
      });
    }
  }
}
