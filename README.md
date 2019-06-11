# Philomena (Based on SoulBot!) — A Discord Bot with a Soul!

Welcome to the work in progress that is SoulBOT, a NodeJS bot utilization the Discord.JS library.  The main feature of SoulBOT is its soul, which allows you to give your bot a personality.  Will yours be friendly?  Snarky?  Shy?  The possibilities are as endless as your imagination!

To see a live version of SoulBOT, drop by the Quill & Blade Discord server at http://quillnblade.com/discord-app and meet Azurite, our friendly and quirky chat bot who loves treats and runs a text-based RPG for our Patrons.

## Installation

SoulBOT is built using [discord.js](https://github.com/hydrabolt/discord.js/) and, therefore, requires **node.js 8.0.0 or newer**.  You will also need npm to install dependencies as well as utilize the built-in shortcuts.

After getting node and npm on your server, you'll want to download or clone the master branch of this repo.  There is a little setup required before your Discord bot will work:

- If you haven't already, then create your bot.  You can find instructions for this here: https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
- If you haven't already, run `npm install` while in the root folder of this repo
- Copy `config.json` from the `samples/data` folder to the root folder and:
  - Update the `clientId` with the Token from your bot's page
  - *Optional but Recommended*: Update the `mainChat` with the name of your "main" chatroom (e.g. general)
- Run `node app.js` and you should be good to go!

## Warning

This bot is not currently Plug-and-Play.  She will not work if you clone this repository and run it straightaway; she has been built specifically for our server with no intention of sharing her code.  I am working on getting her in a state where that is a possibility, but she is nowhere near ready for that.

I am not available to be tech support or to help you get a bot working on your Discord server.  This is a pet project of a pet project.

The end state will be SoulBot, the bot with soul!  Her notable feature will be the soul folder, where all personality-related configuration will be stored.

In no particular order, and definitely not comprehensive
- [ ] Neverending cleanup
- [ ] Make a proper README
- [ ] Comment the code?  Maybe?  yeah that'd be nice.
- [ ] Make as much of her moved into configuration files as possible
- [ ] Make a bash script that will ease setup and initialization
- [ ] Add "moods"
