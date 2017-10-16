var moment = require('moment-timezone');

module.exports = function(bot) {
  return {
    setContext: function(user, command, state) {
      var context = bot.memory.getItemSync('context') || {};

      context[user.id] = {
        'command': command,
        'state': state,
        'expires': moment().add('1', 'hour').valueOf()
      };

      bot.memory.setItemSync('context', context);
    },

    clearContext: function(user) {
      var context = bot.memory.getItemSync('context') || {};

      context[user.id] = null;

      bot.memory.setItemSync('context', context);
    },

    getContext: function(user) {
      var context = bot.memory.getItemSync('context') || {};

      if (context && context[user.id] && context[user.id].expires && context[user.id].expires > moment().valueOf()) {
        return context[user.id];
      } else {
        return false;
      }
    }
  }
}