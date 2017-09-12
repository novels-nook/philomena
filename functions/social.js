module.exports = {
  command: {
    "name": "#social",
    "desc": "A list of links for Quill & Blade social media venues.",
    "prompts": [
      "#social"
    ],
    "role": "Cadets",
    "group": "Information",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.sendMessage("You can find Quill & Blade on the following social venues:\r\n" +
      "```\r\nTwitter: twitter.com/QuillnBlade                  |  deviantART: quillnblade.deviantart.com" + "\r\n" +
      "  Steam: steamcommunity.com/groups/quillandblade  |     YouTube: youtube.com/c/QuillnBlade```");
  }
}