var moment = require('moment-timezone');

module.exports = function(bot) {
  return {
    setContext: function(userId, command, state) {
      var context = bot.memory.getItemSync('context') || {};

      context[userId] = {
        'command': command,
        'state': state,
        'expires': moment().add('1', 'hour').valueOf()
      };

      bot.memory.setItemSync('context', context);
    },

    clearContext: function(userId) {
      var context = bot.memory.getItemSync('context') || {};

      context[userId] = null;

      bot.memory.setItemSync('context', context);
    },

    getContext: function(userId) {
      var context = bot.memory.getItemSync('context') || {};

      if (context && context[userId] && context[userId].expires && context[userId].expires > moment().valueOf()) {
        return context[userId];
      } else {
        return false;
      }
    }
  }
}