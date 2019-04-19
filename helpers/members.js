module.exports = function (bot) {
  return {
    fetchMemberBy : function (selector, search) {
      return new Promise( async (resolve, reject) => {
        var member = null;

        switch (bot.config.connector) {
          case 'discord':
            if (selector == 'author') {
              member = search.guild.members.find( (member) => {
                return member.id == search.author.id;
              });
            }
            else {
              bot.client.guilds.filter((guild) => {
                if (!member) {
                  member = guild.members.find( (member) => {
                    return member[selector] == search;
                  });
                }
              });
            }

            if (!member) {
              return reject('No member found with the `' + selector + '` of `' + search + '`');
            }

            return resolve({
              id : member.user.id,
              name: member.user.username,
              nickname: member.nickname
            });

            break;
          case 'slack':
            var members = [];
            var cursor = "";

            do {
              var response = await bot.client.webClient.users.list({ cursor: cursor, limit: 100 }).catch( (err) => {
                console.log(err);

                return { members : [], response_metadata : { next_cursor : "" } }
              });

              if (response.members.length > 0) {
                members = members.concat(response.members);
              }

              cursor = response.response_metadata.next_cursor;
            }
            while (cursor != "")


            if (!members || members.length == 0) {
              return reject('No members found on server');
            }

            // TODO: check if selector is even valid

            member = members.find(member => member[selector] === search);

            if (!member) {
              return reject('No member found with the `' + selector + '` of `' + search + '`');
            }

            return resolve({
              id : member.id,
              name: member.name,
              nickname: member.profile.display_name
            });

            break;
          case 'local':
            return resolve({
              id: 0,
              name: 'person',
              nickname: 'Person McPersonface'
            });

            break;
        }
      }).catch( (err) => {
        console.log(err);

        return null;
      });
    }
  }
}
