module.exports = {
  command: {
    "name": "#echo <text>",
    "desc": "I'm not your puppet!... But if you want me to say something, I will.",
    "prompts": [
      "#echo"
    ],
    "role": "Robotic Witches",
    "group": "Mod Tools",
    "channels": [
      "All"
    ],
    "noMention": true
  },
  execute: function(bot, args, message) {
    if (message.content.startsWith("#echo")) {
      let targetChannel = message.guild.channels.get(message.content.substring(5 + 1 + 2, 5 + 1 + 2 + 18));
      if (targetChannel) {
        targetChannel.send(message.content.substring(5 + 1 + 21)).catch(console.error);
      } else {
        message.channel.send(message.content.substring(5)).catch(console.error);
        message.delete().catch(console.error);
      }
    }
  }
}