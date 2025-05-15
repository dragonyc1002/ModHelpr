const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const fs = require('fs');

const { bot, cmdGuilds } = require('../../config');

const { token, id } = bot;

const commands = [];

const commandFiles = fs.readdirSync('./src/cmds')
  .filter(file => file.endsWith('.js'));

for(const file of commandFiles){
  const command = require(`../cmds/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({
  version: '10'
}).setToken(token);

(async () => {
  try {
    console.log('Started deploying application commands...');
  
    await rest.put(
      Routes.applicationCommands(id, cmdGuilds),
      { body: commands }
    );
  } catch(err){
    console.log(err);
  }
})();

// for now, commands are only available for specified guilds as this bot is for private use
// guilds where the commands are available are listed in constants.json