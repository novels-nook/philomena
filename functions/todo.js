module.exports = {
  command: {
    "name": "todo",
    "desc": "A link to the Trello board of features to be implemented.",
    "prompts": [
      "todo"
    ],
    "role": "Cadets",
    "group": "Information",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage("The list of features to be implemented can be found on the Q&B Trello board here: <https://trello.com/b/jEbSLBci/q-b-to-do>");
  }
}