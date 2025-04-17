const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js'); // importing djs classes
const fs = require('fs'); // importing fs for reading directories

const { bot } = require('../config'); // importing bot config for starting the bot

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember
  ]
});

client.commands = new Collection();

// cmd files and event handers

const cmdFiles = fs.readdirSync('./src/cmds')
  .filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events')
  .filter(file => file.endsWith('.js'));

for(const file of cmdFiles){
  const cmd = require(`./cmds/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

for(const file of eventFiles){
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args));
}

client.login(bot.token);