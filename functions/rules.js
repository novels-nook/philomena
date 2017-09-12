module.exports = {
  command: {
    "name": "rules | what are the rules",
    "desc": "A link to the Quill & Blade Discord server rules.",
    "prompts": [
      "#rules",
      "what are the rules"
    ],
    "role": "Cadets",
    "group": "Information",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage("The rules can be found on the Quill & Blade site at <http://quillnblade.com/discord-app>");
  }
}