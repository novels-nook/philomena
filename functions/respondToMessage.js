var Chance = require("chance"),
  chance = new Chance(),
  emoji = require('node-emoji');

module.exports = {
  execute: function(bot, args, message) {
    delete require.cache[require.resolve("../data/prompts.js")];
    prompts = require("../data/prompts.js");

    if (prompts.check(message, bot)) {
      return false;
    }

    if (message.content.split(" ").pop() == "/)") {
      var responseList = ["\(\\"];
    }
    if (bot.helpers.containsKeyword(message.content, [emoji.emojify(':cake:'), emoji.emojify(':birthday:'), emoji.emojify(':icecream:'), emoji.emojify(':shaved_ice:'), emoji.emojify(':ice_cream:'), emoji.emojify(':custard:'), emoji.emojify(':candy:'), emoji.emojify(':lollipop:'), emoji.emojify(':chocolate_bar:'), emoji.emojify(':doughnut:'), emoji.emojify(':cookie:')])) {
      var responseList = ["Mm, thanks!", "*chomp, chomp, burp*", "Yay!  You're the best!!", "Thanks so much!!  *nom*", "*nomnomnom*", "Oooh... my favorite!", "Wait, I need something for Mr. Clockerson!", "Wait, I need something for Plant!", "Don't forget Mr. Peepers, he likes treats, too!", "Ooh, that looks delicious!"];
    } else if (bot.helpers.containsKeyword(message.content, ["Star", "Origin"]) && bot.helpers.containsKeyword(message.content, ["avatar"])) {
      var responseList = ["It's not an Articuno!  It's Pura, Star's furry OC.", "Star's avatar is of their OC from another fandom.", "OMG it's not a pony!", "Did you know that this question has been answered, like, five times already today?  Yeah.", "Have you tried Google?  I hear Google has all the answers."];
    } else if (bot.helpers.containsWholeKeyword(message.content, ["hi", "hello", "hey"])) {
      var responseList = ["Hi there!", "How ya doin?", "Mr. Peepers says hi!", "Hello!", "Hi!"];
    } else if (bot.helpers.containsKeyword(message.content, ["good morning"])) {
      var responseList = ["Good morning!", "Today's going to be a great day!", "Did you just wake up?", "How did you sleep?", "Is it time for pancakes?!"];
    } else if (bot.helpers.containsKeyword(message.content, ["goodnight", "good night"])) {
      var responseList = ["Night night!", "Good night!", "Hush now, quiet now, it's time to go to bed...", "Have a good sleep!", "Don't forget to brush your teeth!", "See you in the morning!", "I wanna go to bed, too..."];
    } else if (bot.helpers.containsWholeKeyword(message.content, ["hug", "hugs"])) {
      var responseList = ["<:squee:276843929234571274>", "Aww, thanks!", "*hugs back*", "I love hugs!", "Hugs are the best!", "Can Pink Pony have a hug, too?", "Ack!  Too tight!  Can't breathe!!"];
    } else if (bot.helpers.containsWholeKeyword(message.content, ["short", "shorty", "shortie", "little", "tiny", "itty bitty", "itty-bitty", "teeny"])) {
      var responseList = ["No, I'm fun-sized!", "Your face is small!  *Pffbbtt!*", "Well, not everypony can be as big as you!", "You're just a giant!", "Excuse me?!", "How dare you!", "La la la, I can't hear you..."];
    } else if (bot.helpers.containsWholeKeyword(message.content, ["mean", "grumpy"]) && chance.rpg("1d20") > 17) {
      var questions = ["What is it", "What do you want", "Who said you could talk to me", "What is it now", "How dare you", "Have you thought about not talking to me", "Could you go away", "Can't you see I'm tired of being nice", "What now", "Can't you bother somepony else", "Do I look like I care", "Why don't you go take a long walk off a short rainbow", "Why don't you just go build sets", "I can't hear you over the sound of your neckbeard rustling", "Go away", "Talk to the hoof"],
        adjectives = ["yellow", "limp", "gassy", "braindead", "squeamish", "rude", "weepy", "introverted", "extroverted", "shy", "arrogant", "edgy", "inbred", "crusty", "smelly", "disappointing", "failing", "whiny", "stubborn", "hunchbacked", "mane-dying", "insecure", "overdramatic", "emasculated", "nagging", "deranged", "delusional", "pompous", "snot-nosed", "Sunny-stealing", "two-bit", "scuffed armor-wearing"],
        ponies = ["Twilight Sparkle", "Applejack", "Pinkie Pie", "Rarity", "Fluttershy", "Rainbow Dash", "Princess Celestia", "Princess Luna", "Shining Armor", "Cadence", "Vinyl Scratch", "Big Mac", "Granny Smith", "Cheerilee", "Sweetie Belle", "Apple Bloom", "Scootaloo", "Derpy Hooves", "Octavia", "Zecora", "Silver Spoon", "Diamond Tiara", "Flim", "Flam", "Lyra", "Bon Bon", "Photo Finish", "Discord", "Dr. Whooves", "Mayor Mare", "Spike", "Trixie", "Fancy Pants", "Diamond Dog", "Savoir Fare", "Mango"],
        verbs = ["kissing", "hugging", "cuddling", "touching", "stroking", "licking", "sniffing", "staring", "stalking", "spanking", "worshipping", "groveling", "adoring", "marker sniffing", "paint licking", "booping"],
        nouns = ["fanboy", "fangirl", "nerd", "trash panda", "redneck", "hillbilly", "G1 fan", "red-and-black alicorn", "Mango", "edgelord", "liar", "donkey", "ameritrash", "Canadian", "goldfish", "ferret", "rodent", "knave", "scoundrel", "cookie monster", "egghead", "old nag", "fillyfart", "muppet", "brat", "blank flank", "cheater", "airhead", "gryphonflank", "dam"];

      message.channel.sendMessage(chance.pickone(questions) + ", you " + chance.pickone(adjectives) + " " + chance.pickone(ponies) + "-" + chance.pickone(verbs) + " " + chance.pickone(nouns));
      return false;
    } else {
      var responseList = bot.data('basicResponses');

      if (bot.data('userResponses')[message.author.id]) {
        responseList = responseList.concat(bot.data('userResponses')[message.author.id]);
      }

      for (var group in bot.data('groupResponses')) {
        if (bot.helpers.memberHasRole(message.author.id, group)) {
          responseList = responseList.concat(bot.data('groupResponses')[group]);
        }
      }
    }

    message.channel.sendMessage(chance.pickone(responseList));
  }
}