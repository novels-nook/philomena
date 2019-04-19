module.exports = function (bot) {
  class JanetSoul extends bot.Soul {
    constructor () {
      super()
    }

    defaultResponse (msg) {
      bot.sendMessage(msg.channel, bot.random.pickone([
        "Hi, I'm Janet.",
        "Not a girl.",
        "Not a bot.",
        "I'm Janet."
      ]));
    }
  }

  return new JanetSoul;
}
