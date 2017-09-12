module.exports = {
  command: {
    "name": "goodbye",
    "desc": "*sniff, sniff* If you really want me to leave...",
    "prompts": [
      "goodbye"
    ],
    "role": "Royal Guards",
    "group": "Mod Tools",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage("Aww... okay.  Bye-bye!");
    bot.client.logout(function() {
      setTimeout(function() {
        process.exit(0);
      }, 1000);
    });
  }
}