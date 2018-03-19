var request = require('request'),
  fs = require('fs'),
  moment = require('moment-timezone');

module.exports = function(bot) {
  return {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    basicResponse: function(message) {
      if (message.channel.type == "dm" || message.isMentioned(bot.client.user)) {
        var responseList = [];

        if (bot.soul('userResponses')[message.author.id]) {
          responseList = responseList.concat(bot.soul('userResponses')[message.author.id]);
        }

        for (var group in bot.soul('groupResponses')) {
          if (bot.helpers.memberHasRole(message.author.id, group)) {
            responseList = responseList.concat(bot.soul('groupResponses')[group]);
          }
        }

        if (responseList.length == 0) {
          responseList = bot.soul('basicResponses');
        }

        if (responseList.length == 0) {
          responseList = ["I don't know!"];
        }

        message.channel.send(bot.random.pickone(responseList));
      }
    },

    containsKeyword: function(string, keyword) {
      if (Array.isArray(keyword)) {
        for (var i = 0, len = keyword.length; i < len; i++) {
          if (string.match(new RegExp(keyword[i], "gi")) != null) {
            return true;
          }
        }

        return false;
      } else {
        return string.match(new RegExp(keyword, "gi")) != null;
      }
    },

    containsWholeKeyword: function(string, keyword) {
      if (Array.isArray(keyword)) {
        for (var i = 0, len = keyword.length; i < len; i++) {
          if (string.match(new RegExp("\\b" + keyword[i] + "\\b", "gi")) != null) {
            return true;
          }
        }

        return false;
      } else {
        return string.match(new RegExp(keyword, "gi")) != null;
      }
    },

    getHTML: function(url, callback) {
      request({
          url: url,
          method: "GET",
          json: false
        },
        function(error, response, data) {
          try {
            callback(data);
          } catch (err) {
            console.log(data);
            console.error(err);
          }
        });
    },

    getJSON: function(data, callback) {
      if (typeof data == String) {
        data = {
          url: data
        };
      }

      var options = {
        url: data.url,
        method: data.method || "GET",
        qs: data.data,
        json: true,
        headers: data.headers || {}
      };

      if (options.method == "GET") {
        options.qs = data.data || {};
      } else {
        options.form = data.data || {};
      }

      request(options, function(error, response, data) {
        try {
          bot.helpers.scrubObject(data);

          if (callback) {
            callback(data);
          }
        } catch (err) {
          console.error(err);
        }
      });
    },

    getMETA: function(url, callback) {
      request({
          headers: {
            'User-Agent': 'SoulBOT/0.1'
          },
          url: url,
          method: "GET",
          json: false
        },
        function(error, response, data) {
          try {
            var regex = new RegExp('<meta property="og:([^"]+)" content="([^"]+)">', 'g'),
              meta = {},
              tmp;

            while (tmp = regex.exec(data)) {
              meta[tmp[1]] = tmp[2];
            }

            callback(meta);
          } catch (err) {
            console.log(data);
            console.error(err);
          }
        });
    },

    getMemberData: function(userId) {
      return new Promise(function(resolve, reject) {
        bot.server.fetchMember(userId).then(function(user) {
          resolve(user);
        }).catch(function(err) {
          console.error(err);
          reject(false);
        });
      });
    },

    memberHasRole: function(userId, checkRole) {
      if (!Array.isArray(checkRole)) {
        checkRole = [checkRole];
      }

      for (var i = 0, len = checkRole.length; i < len; i++) {
        var role = bot.server.roles.find('name', checkRole[i]);

        if (!role) {
          continue;
        } else if (bot.server.members.get(userId).roles.get(role.id) !== undefined || bot.server.members.get(userId).roles.get(checkRole[i]) !== undefined) {
          return true;
        }
      }

      return false;
    },

    isBot: function(userId) {
      return userId == bot.client.user.id;
    },

    hasPermission: function(userId, checkRole) {
      if (checkRole == "All") {
        return true;
      } else if (checkRole == "None") {
        return false;
      }

      var user = bot.server.members.get(userId),
        roles = bot.server.roles.array();

      roles.sort(function(a, b) {
        return a.position > b.position ? -1 : 1;
      });

      for (var i = 0, len = roles.length; i < len; i++) {
        if (user.roles.get(roles[i].id) !== undefined) {
          return true;
        }

        if (roles[i].name == checkRole || roles[i].id == checkRole) {
          break;
        }
      }

      return false;
    },

    isChannel: function(channel, checkChannels) {
      if (!Array.isArray(checkChannels)) {
        checkChannels = [checkChannels];
      }

      for (var c = 0, clen = checkChannels.length; c < clen; c++) {
        if (checkChannels[c] == "All" || (checkChannels[c] == "Private" && channel.type == "dm") || channel.name == checkChannels[c]) {
          return true;
        }
      }

      return false;
    },

    soul: function(file) {
      return bot.helpers.getFromCache('soul', file);
    },

    data: function(file) {
      return bot.helpers.getFromCache('data', file);
    },

    getFromCache: function(type, file) {
      if (!bot.cache[file]) {
        var json = fs.readFileSync(type + "/" + file + ".json");

        try {
          bot.cache[file] = JSON.parse(json);
        } catch (err) {
          console.error("There has been an error parsing " + type + "/" + file + ".json", err);
          return [];
        }
      }

      var output = bot.cache[file].constructor === Object ? {} : [];

      for (var key in bot.cache[file]) {
        if ((!!bot.cache[file][key]) && (bot.cache[file][key].constructor === Object)) {
          output[key] = Object.assign({}, bot.cache[file][key]);
        } else {
          output[key] = bot.cache[file][key];
        }
      }

      return output;
    },

    updateSoul: function(file) {
      bot.helpers.updateFromCache('soul', file);
    },

    updateData: function(file) {
      bot.helpers.updateFromCache('data', file);
    },

    updateFromCache: function(type, file) {
      var data = JSON.stringify(bot.cache[file]);

      if (data) {
        fs.writeFile(type + "/" + file + ".json", data, {
          flag: 'w'
        }, function() {});
      }
    },

    scrubObject: function(obj) {
      if (obj) {
        var keys = Object.keys(obj);

        keys.forEach(function(key) {
          var value = obj[key];

          if (typeof value === 'string') {
            var lvalue = value.toLowerCase();
            if (lvalue === 'true') {
              obj[key] = true;
            } else if (lvalue === 'false') {
              obj[key] = false;
            } else if (!isNaN(lvalue)) {
              if (lvalue.length < 15) {
                obj[key] = lvalue * 1;
              }
            }
          } else if (value != null && typeof value === 'object') {
            bot.helpers.scrubObject(obj[key]);
          }
        });
      }
    },

    urlExists: function(url, callback) {
      request({
        url: url,
        method: "HEAD"
      }, function(error, response, data) {
        try {
          callback(data);
        } catch (err) {}
      });
    },

    getArticle: function(object) {
      object = object.toLowerCase();

      if (object == "unicorn") {
        return "a";
      }

      return ["a", "e", "i", "o", "u"].indexOf(object[0]) >= 0 ? "an" : "a";
    },

    getPronoun: function(gender) {
      return gender == "male" ? "he" : (gender == "female" ? "she" : "they");
    },

    getPossessive: function(gender) {
      return gender == "male" ? "his" : (gender == "female" ? "her" : "their");
    },

    getObject: function(gender) {
      return gender == "male" ? "him" : (gender == "female" ? "her" : "them");
    },

    timeString: function(dir, date) {
      var seconds;

      if (dir == "since") {
        seconds = Math.floor((new Date() - date) / 1000);
      } else {
        seconds = Math.floor((date - new Date()) / 1000);
      }

      var interval = Math.ceil(seconds / 31536000);
      if (interval > 1) {
        return interval + " years";
      }

      interval = Math.ceil(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }

      interval = Math.ceil(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }

      interval = Math.ceil(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }

      interval = Math.ceil(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }

      return Math.ceil(seconds) + " seconds";
    },

    unique: function(elem, pos, arr) {
      return arr.indexOf(elem) == pos;
    }
  }
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
