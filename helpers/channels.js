module.exports = function (bot) {
  return {
    fetchChannelBy : function (selector, search) {
      return new Promise( async (resolve, reject) => {
        var channel = null;

        switch (bot.config.connector) {
          case 'discord':
            if (selector == 'message') {
              channel =  search.channel;
            }
            else {
              bot.client.guilds.filter( (guild) => {
                if (!channel) {
                  channel = guild.channels.find( (channel) => {
                    return channel[selector] == search;
                  });
                }
              });
            }

            if (!channel) {
              return reject('No channel found with the `' + selector + '` of `' + search + '`');
            }

            return resolve({
              id : channel.id,
              name: channel.name,
              ref: channel
            });

            break;
          case 'slack':
            let channels = [];
            let cursor = "";

            do {
              let response = await this.client.webClient.conversations.list({
                types: 'public_channel, private_channel, mpim, im',
                cursor: cursor,
                limit: 100
              }).catch( (err) => {
                console.log(err);

                return { channels : [], response_metadata : { next_cursor : "" } }
              });

              if (response.channels.length > 0) {
                channels = channels.concat(response.channels);
              }

              cursor = response.response_metadata.next_cursor;
            }
            while (cursor != "")

            if (!channels || channels.length == 0) {
              return reject('No channels found on server');
            }

            channel = channels.find(channel => channel[selector] === search);

            if (!channel) {
              return reject('No channel found with the `' + selector + '` of `' + search + '`');
            }

            return resolve({
              id : channel.id,
              name: channel.name
            });

            break;
          case 'local':
            return resolve({
              id: 0,
              name: 'Console'
            });

            break;
        }
      }).catch( (err) => {
        console.log(err);

        return null;
      });
    },

    setTopic : function (channel, topic) {
      switch (bot.config.connector) {
        case 'slack':
          bot.client.appClient.conversations.setTopic({ channel: channel.id, topic: topic }).catch( (err) => {
            console.log(err);
          });
          break;
      }
    }
  }
}
