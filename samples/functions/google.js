module.exports = {
  command: {
    "name": "#google <term>",
    "desc": "If you're too lazy to check Google yourself, let me Google it for you.",
    "prompts": [
      "#google"
    ],
    "role": "Cadets",
    "group": "General",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    if (args == "") {
      message.channel.send("What do you want me to google?");
    } else {
      message.channel.send("Okay, Sergeant Lazypants.  http://lmgtfy.com/?q=" + args.replace(/\s/g, "+"));
    }
  }
}
