module.exports = {
  command: {
    "name": "#story <storyID|keyword>",
    "desc": "Give me a story ID or keyword and I'll try to retrieve its information.",
    "prompts": [
      "#story"
    ],
    "role": "All",
    "group": "General",
    "channels": [
      "All"
    ],
    "noMention": true
  },
  execute: function(bot, args, message) {
    var storyId = 0,
      keywords = {
        'habits': 365518,
        'diamonds': 365518,
        'prerogative': 380656,
        'alchemy': 352029
      };

    if (!isNaN(parseFloat(args))) {
      storyId = args;
    } else if (keywords[args.toLowerCase()]) {
      storyId = keywords[args.toLowerCase()];
    }

    message.channel.send("Let me check my files...").then(function() {
      bot.helpers.getJSON({
        url: "https://www.fimfiction.net/api/v2/stories?sort=-relevance&" + (storyId != 0 ? 'filter[ids]=' + storyId : 'query=' + args),
        headers: {
          "User-Agent": "PhilomenaBOT/1.2",
          "Authorization": "Bearer " + "X2DMOQd4GVwep9kMIQkjLt0iTThEuFjN",
        }
      }, function(response) {
        if (!response.data || response.data.length == 0) {
          message.channel.send("Hmm, sorry, I had trouble pulling that information.");
        } else {
          if (response.data[0].attributes.content_rating == "mature") {
            message.channel.send("Whoa!  Sorry, bucko, but you don't have clearance for that!");
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

            for (let i = 0, len = tags.length; i < len; i++) {
              tags[i] = tags[i].id;
            }

            for (let i = 0, len = response.included.length; i < len; i++) {
              if (response.included[i].type == "story_tag") {
                if (tags.indexOf(response.included[i].id) >= 0) {
                  tagsOutput.push(response.included[i].attributes.name);
                }
              } else if (response.included[i].type == "user" && response.included[i].id == story.relationships.author.data.id) {
                author.name = response.included[i].attributes.name;
                author.icon_url = response.included[i].attributes.avatar['32'];
              }
            }

            message.channel.send("<" + story.meta.url + ">");
            message.channel.send({
              embed: {
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
              }
            });
          }
        }
      });
    });
  }
}