var Chance = require("chance"),
    chance = new Chance();

module.exports = {
  check: function(message, bot) {
    var currentTime = new Date();
    //Where is Sunny Day?

    if (bot.helpers.containsKeyword(message.content, "Sunny")) {
      var hours = (currentTime.getHours() < 10) ? "0" + currentTime.getHours() : currentTime.getHours();
      var minutes = (currentTime.getMinutes() < 10) ? "0" + currentTime.getMinutes() : currentTime.getMinutes();
      var hoursMinutes = hours + "" + minutes;
      var sunnyAzu = ["Right here with me! Where else?", "We're playing hide and seek. I haven't found her yet.", "Getting ready for date night!", "Grooming Mr. Peepers.", "Snuggling with me.", "Snuggling with Soarin.", "Flying kites with me and Sandy!"]

      if ((hoursMinutes >= 0001 && hoursMinutes <= 0630) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("*yawn* What are you doing in my house in the middle of the night? I'm telling Sunny and Soarin!");
      } else if (((hoursMinutes >= 0631 && hoursMinutes <= 1159) || (hoursMinutes >= 1401 && hoursMinutes <= 1630)) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("She's still working. At least she better be!");
      } else if ((hoursMinutes >= 1200 && hoursMinutes <= 1400) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("We're going to go meet for lunch.");
      } else if ((hoursMinutes >= 1631 && hoursMinutes <= 1850) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("Sunny just got home so we're going to get our primp on.");
      } else if ((hoursMinutes >= 1851 && hoursMinutes <= 1959) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("We're going to go meet Soarin for dinner.");
      } else {
        message.channel.sendMessage(chance.pickone(sunnyAzu));
      }
      return true;
    }

    if (bot.helpers.containsKeyword(message.content, "Soarin")) {
      var hours = (currentTime.getHours() < 10) ? "0" + currentTime.getHours() : currentTime.getHours();
      var minutes = (currentTime.getMinutes() < 10) ? "0" + currentTime.getMinutes() : currentTime.getMinutes();
      var hoursMinutes = hours + "" + minutes;
      var soarinAzu = ["Right here with me! Where else?", "We're playing hide and seek. I haven't found him yet.", "Getting ready for date night!", "Grooming Mr. Peepers.", "Snuggling with me.", "Snuggling with Sunny.", "About to take me for a flight around Canterlot!"]

      if ((hoursMinutes >= 0001 && hoursMinutes <= 0630) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("*yawn* What are you doing in my house in the middle of the night? I'm telling Sunny and Soarin!");
      } else if (((hoursMinutes >= 0631 && hoursMinutes <= 1159) || (hoursMinutes >= 1401 && hoursMinutes <= 1630)) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("He's still working. At least he better be!");
      } else if ((hoursMinutes >= 1200 && hoursMinutes <= 1400) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("We're going to go meet for lunch.");
      } else if ((hoursMinutes >= 1631 && hoursMinutes <= 1850) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("Soarin just got home so he's going to take a shower... and I'm going to help him!");
      } else if ((hoursMinutes >= 1851 && hoursMinutes <= 1959) && (currentTime.getDay() != 6 && currentTime.getDay() != 0)) {
        message.channel.sendMessage("Sunny and I are going to go meet Soarin for dinner.");
      } else {
        message.channel.sendMessage(chance.pickone(soarinAzu));
      }

      return true;
    }

    if (bot.helpers.containsKeyword(message.content, "cute") || bot.helpers.containsKeyword(message.content, "adorable")) {
      var cuteAs = ["Cute as a", "Adorable as a", "You bet your flank I'm like a", "You're sweet. Everyone knows I'm just like a", "And how! I'm as sweet as a"];
      var cuteA = ["button", "parrot with a box", "fun-sized pony", "puppy with two tails", "Azurite with a cookie", "Sunny Day with three mares before she met Azurite and quit doing stuff like that!"];
      var cuteNormy = ["Aww, thank you! I know I am", "Well, obviously! I'm fun-sized", "True, true"];
      if (message.author.id == 121283841506803714) {
        message.channel.sendMessage(chance.pickone(cuteAs) + " " + chance.pickone(cuteA) + ".");
      } else {
        message.channel.sendMessage(chance.pickone(cuteNormy));
      }
      return true;
    }
    if (bot.helpers.containsKeyword(message.content, "Good morning") && message.author.id == 121283841506803714) {
      var greeting = ["Good morning, boss!", "Hello there, sir!", "Well hello, sailor!", "Ugh, what is good about it?", "Huh? What! I wasn't napping!", "Mr. Clockerson would like to point out that it isn't morning, sir."];
      var item = ["water cup", "copy of the Manehattan Journal", "itenerary", "plush dolls you don't want anypony to see", "a bill for all the damage I— somepony else did last night", "—not today jack!", "fuzzy slippers", ":watermelon:"];
      message.channel.sendMessage(chance.pickone(greeting) + " I've brought your " + chance.pickone(item) + ".");
      return true;
    }
    if (message.content.match(/What day is it(.*)?(please)?/i)) {
      var buildDate = bot.helpers.days[currentTime.getDay()] + ", " + bot.helpers.months[currentTime.getMonth()] + " " + currentTime.getDate() + " " + currentTime.getFullYear();
      var theDay = ["I don't know that!", buildDate, "I'm not telling you!", "Try asking nicely!"];
      if (bot.helpers.containsKeyword(message.content, "please")) {
        message.channel.sendMessage(buildDate);
      } else {
        message.channel.sendMessage(chance.pickone(theDay));
      }
      return true;
    }
    if (bot.helpers.containsKeyword(message.content, "Painted Wave")) {
      var naluSexy = ["is super sexy", "is amazing at Adult Happy Fun Times™", "draws me like one of her French ponies", "is aces"];
      var naluBeauty = ["looks great in socks", "has the largest axe", "has the best looking mane"];
      var naluRandom = naluSexy.concat(naluBeauty);
      if (message.author.id == 121043399435354116) {
        message.channel.sendMessage("Oh my gosh! " + bot.server.members.get("121043399435354116").toString() + " talked to me! She " + chance.pickone(naluBeauty) + "!");
      } else {
        message.channel.sendMessage("Painted Wave? Well she " + chance.pickone(naluRandom) + "!");
      }
      return true;
    }
    if (bot.helpers.containsKeyword(message.content, "Boop")) {
      var boopedResponse = ["How dare you!", "I'm telling Sunny!", "I'm telling Soarin!", "*giggles*", "Tee hee.", "That will be 10 bits, please.", "Is that the kind of pony you are? An unsolicited booper?", "Help! Help! I need an pondult.", "Aww... you're silly.", "Mr. Peepers likes boops too!", "*sneezes*", "This won't get you extra points in the QnB RPG.", "*flops over*", "*stares blankly*", "*hides*", "*boops back*", "Careful, Pink Pony gets *very* jealous!", "Look, we can sit here all day and boop but shouldn't you be writing or something?", "Are you just going to boop me or are you going to help get my kite down?", "Cookie now please!"],
          boops = bot.data('no-git/persist').boops,
		  today = currentTime.getDate() + "" + currentTime.getMonth() + "" + currentTime.getFullYear();

      if (!bot.data('no-git/persist').boops || bot.data('no-git/persist').boops.date != today) {
	    bot.cache['no-git/persist'].boops = {
          date : today,
		  total : 0,
		  boopers : {}
		};
	  }

      if (!bot.data('no-git/persist').boops.boopers[message.author.id]) {
        bot.cache['no-git/persist'].boops.boopers[message.author.id] = 0;
      }

      if (bot.helpers.containsKeyword(message.content, "How many boops")) {
        message.channel.sendMessage("I was booped " + bot.data('no-git/persist').boops.total + " times today." + ((bot.data('no-git/persist').boops.total == 0) ? " Which isn't bad." : " My nose is sore!"));
      }
	  else if (bot.helpers.containsKeyword(message.content, "Who boops")) {
        var biggestBooper = [0, 0];
        var smallestBooper = [0, 0];

        for (var booper in bot.data('no-git/persist').boops.boopers) {
          if (bot.data('no-git/persist').boops.boopers[booper] > biggestBooper[1]) {
            biggestBooper = [booper, bot.data('no-git/persist').boops.boopers[booper]];
          }
        }

        for (var booper in bot.data('no-git/persist').boops.boopers) {
          if (smallestBooper[1] == 0 || bot.data('no-git/persist').boops.boopers[booper] < smallestBooper[1]) {
            smallestBooper = [booper, bot.data('no-git/persist').boops.boopers[booper]];
          }
        }

        if (biggestBooper[0] == 0) {
          message.channel.sendMessage("No boops for Azu today.");
        } else {
          message.channel.sendMessage(bot.server.members.get(biggestBooper[0]).user.username + " boops waaaay too much and " + bot.server.members.get(smallestBooper[0]).user.username + " boops so very little.");
        }
      } else {
        var boopedPissed = ["That is it! I've had enough boops! *boops* *boops* *boops* How do you like it!", "Seriously? You're still booping? I've got a nose bleed!", "No means no!", "AAAAGH!", "I'm telling Silent Knight and he *will* arrest you!", "That is it! I'm filing a restraining order!"];
        var boopedAnnoyed = ["Ha ha ha, you're so cute.", "Please don't do that anymore.", "Sunny, help a fun-sized pony out here!", "If you boop me again, I'm turning this cart around.", "Come on, be a pal and quit it?", "It was only cute the first 15 times."];
        bot.cache['no-git/persist'].boops.total++;
        bot.cache['no-git/persist'].boops.boopers[message.author.id]++;
	
        if (bot.data('no-git/persist').boops.total >= 20 && chance.rpg("1d4") >= 2) {
          message.channel.sendMessage(chance.pickone(boopedPissed));
        } else if (bot.data('no-git/persist').boops.total >= 10 && chance.rpg("1d6") <= 2) {
          message.channel.sendMessage(chance.pickone(boopedAnnoyed));
        } else {
          message.channel.sendMessage(chance.pickone(boopedResponse));
        }
      }


      bot.helpers.updateData('no-git/persist');
      return true;
    }

    if (bot.helpers.containsKeyword(message.content, "pancake")) {
      var today = currentTime.getDate() + "" + currentTime.getMonth() + "" + currentTime.getFullYear();
      var pancakeResponse = chance.pickone(bot.data('pancakeResponses'));

      if (!bot.data('pancakes')[today]) {
        bot.cache.pancakes[today] = {
          "total": 0
        };
      }
      if (!bot.data('pancakes')[today][message.author.id]) {
        bot.cache.pancakes[today][message.author.id] = 0;
      }
      if (bot.helpers.containsKeyword(message.content, "fresh pancake")) {
        bot.cache.pancakes[today]["total"]++;
        bot.cache.pancakes[today][message.author.id]++;
        message.channel.sendMessage(
          "```    _____===_____      __\r\n" +
          "   (_____________)    <__|\r\n" +
          "    (_____________)   |  |)\r\n" +
          "   (_____________)    |__|```");
      } else if (bot.helpers.containsKeyword(message.content, "How many pancake")) {
        message.channel.sendMessage("I've dispensed " + bot.cache.pancakes[today]["total"] + " pancakes of wisdom today.");
      } else if (bot.helpers.containsKeyword(message.content, "Who pancake")) {
        var biggestPancaker = [0, 0];
        for (var pancaker in bot.cache.pancakes[today]) {
          if (pancaker != "total" && bot.cache.pancakes[today][pancaker] > biggestPancaker[1]) {
            biggestPancaker = [pancaker, bot.cache.pancakes[today][pancaker]];
          }
        }
        if (biggestPancaker[0] == 0) {
          message.channel.sendMessage("No pancakes of wisdom yet today.");
        } else {
          message.channel.sendMessage(bot.server.members.get(biggestPancaker[0]).username + " is a little obsessed with pancakes.");
        }
      } else {
        bot.cache.pancakes[today]["total"]++;
        bot.cache.pancakes[today][message.author.id]++;
        message.channel.sendMessage(pancakeResponse);
      }

      bot.helpers.updateData("pancakes");
      return true;
    }



    return false;
  }
}
