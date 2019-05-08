const {EventEmitter} = require('events');
const fs = require('fs');
const glob = require('glob');
const readline = require('readline');

class SoulBot extends EventEmitter {
  constructor (config) {
    super();

    this.user = {
      id   : "NaN",
      name : "N/A"
    }

    this.config = config;

    this.memory = require('node-persist');
    this.random = require('chance').Chance();

    this.commands = [];

    glob(__dirname + '/helpers/**/*.js', (err, files) => {
      for (let i = 0, len = files.length; i < len; i++) {
        let path = files[i];
        let file = require(path);
        let helpers = file(this);

        for (let helper in helpers) {
          if (this.hasOwnProperty(helper)) {
            console.log('! Overwriting `' + helper + '` helper');
          }

          this[helper] = helpers[helper];
        }
      }

      glob(process.cwd() + '/functions/**/*.js', (err, files) => {
        for (let i = 0, len = files.length; i < len; i++) {
          let path = files[i];
          let file = require(path);

          file.command.path = path;
          this.commands.push(file.command);

          delete require.cache[require.resolve(path)];
        }

        try {
          var soul = '/' + this.config.soul + '.js';

          if (fs.existsSync(process.cwd() + soul)) {
            soul = process.cwd() + soul;
          }
          else {
            soul = __dirname + '/souls' + soul;
          }

          this.soul = require(soul)(this);
        }
        catch (e) {
          this.soul = new this.Soul(this);
        }

        this.connect();
      });
    });
  }

  connect () {
    switch (this.config.connector) {
      case 'discord':
        const Discord = require('discord.js');

        this.client = new Discord.Client();

        this.client.login(this.config.botToken);

        this.client.on('ready', async () => {
          this.user.id = this.client.user.id;
          this.user.name = this.client.user.username;
          this.user.displayname = this.client.user.username;

          this.emit('connected', this);
        });

        this.client.on("message", (response) => {
          this.messageReceived(response).then( (msg) => {
            if (msg) {
              this.emit('messageReceived', this, msg);
            }
          });
        });

        break;
      case 'slack':
        const {RTMClient, WebClient} = require('@slack/client');

        this.client = new RTMClient(this.config.botToken);

        this.client.start();

        this.client.on('ready', async () => {
          let bot = await this.client.webClient.users.info({ user : this.client.activeUserId });

          this.user.id = bot.user.id;
          this.user.name = bot.user.name;
          this.user.displayname = bot.user.real_name;

          this.client.appClient = new WebClient(this.config.appToken);

          this.emit('connected', this);
        });

        this.client.on('message', (response) => {
          this.messageReceived(response).then( (msg) => {
            if (msg) {
              this.emit('messageReceived', this, msg);
            }
          });
        });

        break;
      case 'local':
        this.user.id = 1337;
        this.user.name = 'consolebot';
        this.user.displayname = 'ConsoleBot';

        this.client = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        this.emit('connected', this);

        this.client.question('> ', (response) => {
          this.messageReceived(response).then( (msg) => {
            this.emit('messageReceived', this, msg);
          });
        });

        break;
      default:
        throw "Unknown connector type";
    }
  }
}

module.exports = SoulBot;
