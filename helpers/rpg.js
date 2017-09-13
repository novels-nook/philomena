var Chance = require("chance"),
  chance = new Chance(),
  emoji = require("node-emoji"),
  moment = require("moment-timezone");

moment.tz.setDefault("America/New_York");

module.exports = function(bot) {
  return {
    confrontation: function() {
      var channel = bot.server.channels.find("name", "patron-rpg");

      if (bot.data('rpg/rpgConfrontations').current == 0 && bot.data('rpg/rpgConfrontations').next < moment().tz("America/New_York").valueOf()) {
        var tmp = bot.data('rpgConfrontations').confrontations.filter(function(val) {
          return bot.data('rpg/rpgConfrontations').recent.indexOf(val.id) == -1;
        });

        if (tmp.length == 0) {
          var confrontation = chance.pickone(bot.data('rpg/rpgConfrontations').confrontations);
          bot.data('rpg/rpgConfrontations').recent = [];
        } else {
          var confrontation = chance.pickone(tmp);
        }

        bot.cache['rpg/rpgConfrontations'].current = confrontation.id;
        bot.cache['rpg/rpgConfrontations'].next = moment().add(1, 'hour').add('9 minutes').tz("America/New_York").valueOf();
        channel.setTopic(bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].emoji + " " + confrontation.name + " (0/" + bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].totalSuccesses + ") " + bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].emoji);
        channel.sendMessage(bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].emoji + " Confrontation: **Begin!** " + bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].emoji + "\r\n\r\n" + confrontation.spawnText);

        bot.helpers.updateData("rpg/rpgConfrontations");
      } else if (bot.data('rpg/rpgConfrontations').current > 0 && bot.data('rpg/rpgConfrontations').next <= moment().tz("America/New_York").valueOf()) {
        for (var i = 0, len = bot.data('rpg/rpgConfrontations').confrontations.length; i < len; i++) {
          if (bot.data('rpg/rpgConfrontations').confrontations[i].id == bot.data('rpg/rpgConfrontations').current) {
            var confrontation = bot.data('rpg/rpgConfrontations').confrontations[i];
            break;
          }
        }

        for (var userId in bot.data('rpg/rpgConfrontations').participants) {
          bot.helpers.fetchUserData([{
            "action": "fetchUser",
            "discordId": userId
          }, {
            "action": "fetchBoons"
          }, {
            "action": "fetchInventory"
          }, {
            "action": "fetchItemLogs"
          }, {
            "action": "fetchAchievements"
          }], function(userData) {

            var saddlebag = bot.data('rpg/qnbRPG').saddlebags[userData.qnbRPG.saddlebagId],
              capacity = saddlebag.capacity,
              participation = bot.data('rpg/rpgConfrontations').participants[userData.discordId],
              levelInfo = bot.helpers.rpgLevel(userData.qnbRPG.exp, userData.qnbRPG.memoryCrystals),
              level = levelInfo[0],
              expEarned = 5,
              bitsEarned = Math.floor(+level * .2),
              tokensEarned = +bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].tokensEarned,
              itemEarned = false,
              itemDC = +bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].failItemDC,
              itemRolls = 1,
              toUpdate = [];

            if (participation > 1) {
              expEarned = Math.floor((3 * participation));
              bitsEarned = Math.floor(bitsEarned * participation);
              itemDC = itemDC - (participation * .25);
              tokensEarned = Math.floor(tokensEarned + (participation * .25));
            }

            expEarned = bot.helpers.rpgCanGainLevels(level, userData.qnbRPG.memoryCrystals) ? 0 : expEarned;

            toUpdate.unshift({
              "action": "updateExperience",
              "discordId": userData.discordId,
              "exp": isNaN(expEarned) ? 0 : expEarned
            });
            toUpdate.push({
              "action": "updateBits",
              "bits": isNaN(bitsEarned) ? 0 : bitsEarned
            });
            toUpdate.push({
              "action": "updateLogs",
              "log": "Bits Earned",
              "value": isNaN(bitsEarned) ? 0 : bitsEarned
            });
            toUpdate.push({
              "action": "updateToken",
              "token": "Harmony",
              "value": tokensEarned
            });

            for (var i = 0, len = itemRolls; i < len; i++) {
              if (+chance.rpg("1d20") >= itemDC) {
                var itemRoll = +chance.rpg("1d8") + +chance.rpg("1d8"),
                  rarity = "Common";

                switch (itemRoll) {
                  case 2:
                  case 16:
                    rarity = "Element of Harmony";
                    break;
                  case 3:
                  case 15:
                    rarity = "Legendary";
                    break;
                  case 4:
                  case 14:
                    rarity = "Rare";
                    break;
                  case 5:
                  case 6:
                  case 12:
                  case 13:
                    rarity = "Uncommon";
                    break;
                }

                var raritySlug = rarity.split(' ').shift().toLowerCase(),
                  item = bot.helpers.rpgGetRandomItem(raritySlug, userData, bot),
                  itemData = bot.helpers.rpgGetItemData(item, bot);

                toUpdate.push({
                  "action": "updateLogs",
                  "log": "Items Total",
                  "value": 1
                });
                toUpdate.push({
                  "action": "updateLogs",
                  "log": "Items " + raritySlug,
                  "value": 1
                });

                if (userData.qnbRPG.inventory.length >= capacity) {
                  var hasRoom = false,
                    items = userData.qnbRPG.inventory;

                  items.sort(function(a, b) {
                    aData = bot.helpers.rpgGetItemData(a, bot);
                    bData = bot.helpers.rpgGetItemData(b, bot);

                    return aData.rarity - bData.rarity;
                  });

                  for (var i = 0, len = items.length; i < len; i++) {
                    if (!items[i].locked && !items[i].worn) {
                      var temp = bot.helpers.rpgGetItemData(items[i], bot);
                      item.action = "updateInventory";
                      item.slot = items[i].slot;
                      toUpdate.push(item);
                      hasRoom = true;
                      itemEarned = itemData.name + " (after donating " + temp.name + " to charity to make room)";
                      break;
                    }
                  }

                  if (!hasRoom) {
                    itemEarned = false;
                  }
                } else {
                  itemEarned = itemData.name;
                  item.action = "updateInventory";
                  item.slot = userData.qnbRPG.inventory.length + 1;
                  toUpdate.push(item);
                }

                break;
              }
            }
            bot.helpers.updateUserData(toUpdate);
            bot.server.members.get(userData.discordId).sendMessage("For your participation in the confrontation against " + confrontation.name + ", you have earned: " + expEarned + " EXP, " + bitsEarned + " bits, " + (itemEarned ? "" : "and ") + tokensEarned + " Tokens of Harmony" + (itemEarned ? ", and " + itemEarned : "") + "!");
          });
        }

        channel.setTopic("http://quillnblade.com/qnb-rpg");
        channel.sendMessage(bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].emoji + " Confrontation: **Failed!** " + bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].emoji + "\r\n\r\n" + confrontation.failureText);

        bot.cache['rpg/rpgConfrontations'].next = moment().add(((bot.data('rpg/rpgConfrontations').successes + 10) * 4) + +chance.rpg("10d10", {
          sum: true
        }), 'minutes').tz("America/New_York").valueOf();
        bot.cache['rpg/rpgConfrontations'].successes = 0;
        bot.cache['rpg/rpgConfrontations'].participants = {};
        bot.cache['rpg//rpgConfrontations'].current = 0;
        bot.helpers.updateData("rpg/rpgConfrontations");
      } else if (bot.data('rpg/rpgConfrontations').current > 0) {
        for (var i = 0, len = bot.data('rpg/rpgConfrontations').confrontations.length; i < len; i++) {
          if (bot.data('rpg/rpgConfrontations').confrontations[i].id == bot.data('rpg/rpgConfrontations').current) {
            var confrontation = bot.data('rpg/rpgConfrontations').confrontations[i];
            break;
          }
        }

        channel.sendMessage(bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].emoji + " " + chance.pickone(confrontation.reminderText) + " " + bot.data('rpg/rpgConfrontations').difficulty[confrontation.difficulty].emoji);
      }
    },

    rpgCheckAchievements: function(bot, userId, userData) {
      var achievements = bot.data('rpg/qnbRPG').achievements,
        message = '';

      userData.qnbRPG.newAchievements = [];

      achievements = achievements.filter(function(val) {
        return userData.qnbRPG.achievements.indexOf(val.id) == -1;
      });

      for (var i = 0, len = achievements.length; i < len; i++) {
        if (achievements[i].preReq != 0) {
          var preReq = true;
          for (var p = 0, plen = achievements[i].preReq.length; p < plen; p++) {
            if (userData.qnbRPG.achievements.indexOf(+achievements[i].preReq[p]) == -1) {
              preReq = false;
              break;
            }
          }

          if (!preReq) {
            continue;
          }
        }

        try {
          if (eval('if (+' + achievements[i].check + ' >= +' + achievements[i].against + ') { true; } else { false; }')) {
            var message = "🏆 Achievement Unlocked 🏆 " + achievements[i].name + " (" + achievements[i].desc + ")";

            for (var r = 0, rlen = achievements[i].reward.length; r < rlen; r++) {
              if (bot.helpers.containsKeyword(achievements[i].reward[r], "Token")) {
                var token = achievements[i].reward[r].replace("Token", "").trim();
                message += "\r\nReward: " + achievements[i].value[r] + " Tokens of " + token;
                userData.qnbRPG.newAchievements.push({
                  "id": achievements[i].id,
                  "reward": {
                    "action": "updateToken",
                    "token": token,
                    "value": +achievements[i].value[r]
                  }
                });
                userData.qnbRPG.tokens[token] += +achievements[i].value[r];
              } else if (achievements[i].reward[r] == "Bits") {
                message += "\r\nReward: " + achievements[i].value[r] + " Bits";
                userData.qnbRPG.bits += +achievements[i].value[r];
                userData.qnbRPG.newAchievements.push({
                  "id": achievements[i].id,
                  "reward": {
                    "action": "updateBits",
                    "bits": +achievements[i].value[r]
                  }
                });
                userData.qnbRPG.logs.bits.earned += +achievements[i].value[r];
              }
            }

            bot.client.sendMessage(userId, message);
          }
        } catch (err) {}
      }

      return userData;
    },

    rpgLucky: function(bot) {
      var roll = +chance.rpg("2d12", {
          sum: true
        }),
        output = {
          "name": "Oops!",
          "text": "Something went wrong.",
          "effect": ""
        };

      switch (roll) {
        case 2:
          output.name = "Maximum Harmony";
          var tmp = chance.pickone(bot.data('rpg/qnbRPG').elements);
          output.text = "12 Tokens of " + tmp + " appear in a flash of light!";
          output.effect = "toUpdate.push({'action':'updateToken','token':'" + tmp + "', 'value': " + 12 + "});";
          break;
        case 3:
          output.name = "Perfect Harmony";
          output.text = "2 Tokens of each Element fall from the sky!";
          for (var i = 0, len = bot.data('rpg/qnbRPG').elements.length; i < len; i++) {
            output.effect += "toUpdate.push({'action':'updateToken','token':'" + bot.data('rpg/qnbRPG').elements[i] + "', 'value': " + 2 + "});";
          }
          break;
        case 4:
          output.name = "Broken Antique";
          output.text = "~crack~  Oh no!  One of the item dice broke.  Maybe nopony will notice...";
          output.effect = "itemRoll = +itemRoll; if (itemRoll > 9) { itemRoll -= 4; } else if (itemRoll < 9) { itemRoll += 4; };";
          break;
        case 5:
        case 21:
          output.name = "More Harmony";
          var tmp = chance.pickone(bot.data('rpg/qnbRPG').elements),
            tmpNum = +chance.rpg("1d8") + 2;
          output.text = tmpNum + " Tokens of " + tmp + " tumble into view!";
          output.effect = "toUpdate.push({'action':'updateToken','token':'" + tmp + "', 'value': " + tmpNum + "});";
          break;
        case 6:
          output.name = "Slow Leaner";
          output.text = "Wait... what just happened?  Anypony have the Hoof Notes?";
          output.effect = "expEarned = +expEarned * .5";
          break;
        case 7:
          output.name = "Take That!";
          output.text = "Oops...  Somepony bumped the dice and knocked them to different faces!";
          output.effect = "itemRoll = +itemRoll; if (itemRoll > 9) { itemRoll -= 2; } else if (itemRoll < 9) { itemRoll += 2; };";
          break;
        case 8:
        case 18:
          output.name = "Extra Harmony";
          var tmp = chance.pickone(bot.data('rpg/qnbRPG').elements),
            tmpNum = +chance.rpg("1d6") + 1;
          output.text = tmpNum + " Tokens of " + tmp + " suddenly appear!";
          output.effect = "toUpdate.push({'action':'updateToken','token':'" + tmp + "', 'value': " + tmpNum + "});";
          break;
        case 9:
          output.name = "Confusing Lesson";
          output.text = "What was the lesson, again?  Friendship is... what?";
          output.effect = "expEarned = (+chance.rpg('1d10') + +chance.rpg('1d14')) - (+chance.rpg('1d6') - +chance.rpg('1d12'));";
          break;
        case 10:
        case 16:
          output.name = "Harmony";
          var tmp = chance.pickone(bot.data('rpg/qnbRPG').elements),
            tmpNum = +chance.rpg("1d4");
          output.text = "Yay!  " + (tmpNum == 1 ? "1 Token" : tmpNum + " Tokens") + " of " + tmp + "!";
          output.effect = "toUpdate.push({'action':'updateToken','token':'" + tmp + "', 'value': " + tmpNum + "});";
          break;
        case 11:
          output.name = "Uh... What friendship lesson?"
          output.text = "Friendship lesson?  Ain't nopony got time for that!";
          output.effect = "expEarned = 1;";
          break;
        case 12:
          output.name = "Flat Broke";
          output.text = "Whoops!  There was a hole in the bit purse, and almost all of the coins fell out... save for one!";
          output.effect = "bitsEarned = 1;";
          break;
        case 13:
          output.name = "Extra Bits in the Saddle";
          output.text = "Cool!  Extra bits for the gumball machine!";
          output.effect = "bitsEarned = +bitsEarned + +chance.rpg('1d4');";
          break;
        case 14:
          output.name = "Forget the Lesson, Pay Me!";
          output.text = "Pffbbtt.  Forget the lesson.  Bits are better than experience!";
          output.effect = "expEarned = 0; bitsEarned = +bitsEarned + 10;";
          break;
        case 15:
          output.name = "The Lesson is Enough";
          output.text = "Bits are fleeting, but friendship is forever!  Screw the bits!";
          output.effect = "bitsEarned = 0; expEarned = (+expEarned + 5) + level;";
          break;
        case 17:
          output.name = "Organized Lesson";
          output.text = "Yup, yup, all the documents appear to be in order...  Somepony knows their friendship!";
          output.effect = "expEarned = +expEarned + +chance.rpg('1d16');";
          break;
        case 19:
          output.name = "Take This!";
          output.text = "Somepony bumped the dice, knocking them to a better roll!";
          output.effect = "itemRoll = +itemRoll; if (itemRoll > 9) { itemRoll += 2; } else if (itemRoll < 9) { itemRoll -= 2; };";
          break;
        case 20:
          output.name = "Fast Learner";
          output.text = "The lightbulb flickers on.  Oh, right!  ~That~ was the friendship lesson!  It all makes sense now!";
          output.effect = "expEarned = Math.ceil(+expEarned * 1.5)";
          break;
        case 22:
          output.name = "Treasure Hunter";
          output.text = "The dice glitter and sparkle as they roll!  Is somepony the next Dolly Dice?";
          output.effect = "itemRoll = +itemRoll; if (itemRoll >= 9) { itemRoll += 4; } else if (itemRoll < 9) { itemRoll -= 4; };";
          break;
        case 23:
          output.name = "It's Raining Bits";
          output.text = "Hallelu!  Praise Celestia, it's raining bits!";
          output.effect = "bitsEarned = (+bitsEarned + +chance.rpg('2d6', {sum:true})) * 2;";
          break;
        case 24:
          output.name = "All the Friendship Lessons!";
          output.text = "Generosity... Honesty... Kindness... Laughter... Loyalty... With these powers combined, ponies across Equestria understand the Magic of Friendship!";
          output.effect = "expEarned = (+expEarned + +chance.rpg('1d10')) * 100;";
          break;
      }

      return output;
    },

    rpgLevel: function(exp, memoryCrystals) {
      var level = 1,
        toLevel = 500,
        prevLevel = 500;

      if (exp < toLevel) {
        return [level, 500 - exp];
      } else {
        level++;

        while (level < 20) {
          prevLevel = prevLevel + ((level + 1) * 45);
          toLevel += prevLevel;

          if (exp < toLevel) {
            break;
          }

          level++;
        }

        if (level >= 20 && level - 20 < memoryCrystals) {
          while (level - 20 < memoryCrystals && level < 30) {
            prevLevel = prevLevel + ((level + 1) * 1000);
            toLevel += prevLevel;

            if (exp < toLevel) {
              break;
            }

            level++;
          }
        }
      }

      return [level, toLevel - exp];
    },

    rpgCanGainLevels: function(level, memoryCrystals) {
      if (level < 20) {
        return true;
      } else if (level <= 30 && level - 20 < memoryCrystals) {
        return true;
      } else {
        return false;
      }
    },

    rpgGetItemData: function(search, bot) {
      var item = null;

      for (var rarity in bot.data('rpg/qnbRPG').items) {
        for (var i = 0, len = bot.data('rpg/qnbRPG').items[rarity].length; i < len; i++) {
          if (bot.data('rpg/qnbRPG').items[rarity][i].id == search.itemId) {
            item = bot.data('rpg/qnbRPG').items[rarity][i];
            break;
          }
        }

        if (item !== null) {
          break;
        }
      }

      var rarity = bot.data('rpg/qnbRPG').rarity[item.rarity],
        prefix = search.prefixId != null ? bot.data('rpg/qnbRPG').prefixes[search.prefixId] : null,
        suffix = search.suffixId != null ? bot.data('rpg/qnbRPG').suffixes[search.suffixId] : null,
        output = {
          name: (prefix == null ? "" : prefix.name + " ") + item.name + (suffix == null ? "" : " " + suffix.name),
          bonus: [],
          text: "",
          status: "",
          rarity: item.rarity,
          bonusText: ""
        };

      if (prefix != null) {
        output.bonusText += ", +" + rarity.prefixBonus + " " + prefix.bonus.of.slice(0, 3);
        output.bonus.push({
          "element": prefix.bonus.of,
          "bonus": rarity.prefixBonus
        });
      }

      if (suffix != null) {
        output.bonusText += ", +" + rarity.suffixBonus + " " + suffix.bonus.of.slice(0, 3);
        output.bonus.push({
          "element": suffix.bonus.of,
          "bonus": rarity.suffixBonus
        });
      }

      if (rarity.special) {
        for (var i = 0, len = rarity.special.length; i < len; i++) {
          if (rarity.special[i].bonus) {
            output.bonusText += ", +" + rarity.special[i].bonus + " " + item[rarity.special[i].to].slice(0, 3);
            output.bonus.push({
              "element": item[rarity.special[i].to],
              "bonus": rarity.special[i].bonus
            });
          } else if (rarity.special[i].extraDice) {
            output.bonusText += ", " + "bonus " + rarity.special[i].extraDice + " " + item["element"].slice(0, 3);
            output.bonus.push({
              "element": item["element"],
              "dice": rarity.special[i].extraDice
            });
          }
        }
      }

      output.bonusText = output.bonusText.slice(2);
      output.status = (search.worn ? "[W] " : (search.locked ? "[L] " : "    "));
      output.text = (search.worn ? "[W] " : (search.locked ? "[L] " : "    ")) + output.name + " (" + output.bonusText + ")";

      return output;
    },

    rpgGetRandomItem: function(rarity, userData, bot) {
      var item = {
        itemId: 0,
        prefixId: null,
        suffixId: null,
        exp: 0,
        worn: false,
        locked: false
      };

      switch (rarity) {
        case "element":
        case "legendary":
          var tmp = bot.data('rpg/qnbRPG').items[rarity].filter(function(val) {
            return userData.qnbRPG.logs['Unique Items'].indexOf(val.id) == -1;
          });

          if (tmp.length == 0) {
            tmp = chance.pickone(bot.data('rpg/qnbRPG').items[rarity]);
          } else {
            tmp = chance.pickone(tmp);
          }

          break;
        default:
          var tmp = chance.pickone(bot.data('rpg/qnbRPG').items[rarity]);
          break;
      }

      item.itemId = tmp.id;
      rarity = bot.data('rpg/qnbRPG').rarity[tmp.rarity];
      prefixId = chance.integer({
        min: 0,
        max: bot.data('rpg/qnbRPG').prefixes.length - 1
      });
      suffixId = chance.integer({
        min: 0,
        max: bot.data('rpg/qnbRPG').suffixes.length - 1
      });

      if (rarity.numBonus == 2) {
        item.prefixId = prefixId;
        item.suffixId = suffixId;
      } else if (rarity.numBonus == 1) {
        if (chance.bool()) {
          item.prefixId = prefixId;
        } else {
          item.suffixId = suffixId;
        }
      }

      return item;
    },

    assignRPGTokens: function(token, userId, amount) {
      amount = amount * 1;

      if (token != "Harmony" && bot.data('rpg/qnbRPG').elements.indexOf(token) == -1) {
        console.log(token + " is not a valid token");
        return false;
      }

      console.log("Assigning " + amount + " tokens of " + token);

      if (userId > 0) {
        bot.helpers.updateUserData({
          "action": "updateToken",
          "discordId": userId,
          "token": token,
          "value": amount
        });
      } else {
        var users = bot.server.members.array(),
          d = new Date();

        d.setHours(0, 0, 0, 0);
        d = d.getTime();

        for (var i = 0, len = users.length; i < len; i++) {
          if (!bot.helpers.isBot(users[i].id) && bot.helpers.hasPermission(users[i].id, "Patrons")) {
            bot.helpers.updateUserData({
              "action": "updateToken",
              "discordId": users[i].id,
              "token": token,
              "value": amount,
              "limit": 12
            });
          }
        }

        if (bot.data("persist").tokensReset < d) {
          bot.helpers.updateUserData({
            "action": "resetTokensToday",
            "discordId": 0
          });
        }

        bot.data("persist").tokensReset = d;
        bot.helpers.updateData("persist");
      }
    },

    rpgAvailableBoons: function(levelBonuses, boons, accepted, level) {
      var boonTier = 0;

      if (!accepted) {
        accepted = [];
      }

      for (var i = (accepted.length * 2) + 2, len = level; i < len; i++) {
        for (var l = 0, llen = levelBonuses[i].length; l < llen; l++) {
          if (levelBonuses[i][l] == "boon") {
            boonTier = i + 1;
            i = len;
            break;
          }
        }
      }

      return boons.filter(function(val) {
        if (accepted.indexOf(val.id) >= 0) {
          return false;
        }

        if (val.preReq >= 0 && accepted.indexOf(val.preReq) == -1) {
          return false;
        }

        if (val.group) {
          var group = boons.filter(function(tmp) {
            return tmp.group == val.group;
          });

          for (var i = 0, len = group.length; i < len; i++) {
            if (accepted.indexOf(group[i].id) >= 0) {
              return false;
            }
          }
        }

        return val.levelUnlocked <= boonTier;
      });
    },

    rpgSaddlebagCost: function(saddlebag) {
      var level = 1,
        cost = 50;

      if (saddlebag == level) {
        return cost;
      } else {
        level++;

        while (level < 50) {
          cost = cost + (20 * (level + 1));

          if (level == saddlebag) {
            break;
          }

          level++;
        }
      }

      return cost;
    },

    rpgTokenCost: function(element, tokensToday) {
      var numTokens = 0,
        cost = 40,
        tokensToday = tokensToday || 0;

      if (numTokens == tokensToday) {
        return cost;
      } else {
        numTokens++;

        while (numTokens < 100) {
          cost = (cost + 5) + (5 * (numTokens + 1));

          if (numTokens == tokensToday) {
            return cost;
          }

          numTokens++;
        }
      }

      return cost;
    }
  }
}
