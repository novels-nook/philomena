module.exports = {
  command: {
    "name": "story <storyID|keyword>",
    "desc": "Give me a story ID or keyword and I'll try to retrieve its information.",
    "prompts": [
      "#story"
    ],
    "role": "Cadets",
    "group": "General",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    var storyId = 0,
      keywords = {
        'wishes': 230097,
        'hopes': 281842,
        'memoirs': 230095,
        'secrets': 262566,
        'trials': 301607,
        'veil': 329741,
        'beyond the veil': 329741,
        'blood moon': 373983,
        'glow': 350834
      };

    if (!isNaN(parseFloat(args))) {
      storyId = args;
    } else if (keywords[args.toLowerCase()]) {
      storyId = keywords[args.toLowerCase()];
    }

    message.channel.sendMessage("Let me check my files...").then(function() {
      bot.helpers.getJSON({
        url: "https://www.fimfiction.net/api/v2/stories?sort=-relevance&" + (storyId != 0 ? 'filter[ids]=' + storyId : 'query=' + args),
        headers: {
          "User-Agent": "AzuBOT/1.0",
          "Authorization": "Bearer <FIMFICTION_API_KEY>"
        }
      }, function(response) {
        if (!response.data || response.data.length == 0) {
          message.channel.sendMessage("Hmm, sorry, I had trouble pulling that information.");
        } else {
          if (response.data[0].attributes.content_rating == "mature") {
            message.channel.sendMessage("Whoa!  Sorry, bucko, but you don't have clearance for that!");
          } else {
            var story = response.data[0],
              lastUpdated = story.attributes.date_updated,
              d = new Date(lastUpdated),
              tags = story.relationships.tags.data,
              tagsOutput = [],
              author = {
                name: "FiMFiction User",
                icon_url: "https://static.fimfiction.net/images/none_64.png"
              };

            lastUpdated = d.getDate() + ' ' + bot.helpers.months[d.getMonth()] + ' ' + d.getFullYear();

            for (var i = 0, len = tags.length; i < len; i++) {
              tags[i] = tags[i].id;
            }

            for (var i = 0, len = response.included.length; i < len; i++) {
              if (response.included[i].type == "story_tag") {
                if (tags.indexOf(response.included[i].id) >= 0) {
                  tagsOutput.push(response.included[i].attributes.name);
                }
              } else if (response.included[i].type == "user" && response.included[i].id == story.relationships.author.data.id) {
                author.name = response.included[i].attributes.name;
                author.icon_url = response.included[i].attributes.avatar['32'];
              }
            }

            message.channel.sendMessage("<" + story.meta.url + ">");
            message.channel.sendEmbed({
              color: parseInt(story.attributes.color.hex, 16),
              author: author,
              title: story.attributes.title,
              url: story.meta.url,
              description: story.attributes.short_description,
              thumbnail: {
                url: story.attributes.cover_image.medium
              },
              fields: [{
                  name: "Status",
                  value: story.attributes.completion_status.ucFirst(),
                  inline: true
                },
                {
                  name: "Last Updated",
                  value: lastUpdated + " (" + bot.helpers.timeString("since", d.getTime()) + " ago)",
                  inline: true
                },
                {
                  name: "# Chapters",
                  value: story.attributes.num_chapters,
                  inline: true
                },
                {
                  name: "# Words",
                  value: story.attributes.num_words.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  inline: true
                },
                {
                  name: "Tags",
                  value: tagsOutput.sort().join(', ')
                }
              ],
              footer: {
                icon_url: "https://static.fimfiction.net/images/logo-2x.png",
                text: "FiMFiction API"
              }
            });
          }
        }
      });
    });
  }
}