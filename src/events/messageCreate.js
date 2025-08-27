const { Message: message } = require('discord.js');
const { bot, botAdmins } = require('../../config');

module.exports = {
	name: 'messageCreate',

	async execute(message){
		/* messageCreate
		 - Mainly in this bot, it is used to execute specialised commands
		 - Particually related to owner-only private commands
		*/
		const prefix = bot.prefix;

		if (!botAdmins.includes(message.author.id)) return;
		if (!message.content.startsWith(prefix)) return;

		const args = message.content.slice(prefix).trim().split(' ');
		if (!args.length) {
      return message.channel.send(`No argument provided.`);
    }

    const command = args.shift().toLowerCase();
		switch(command) {
			case `${prefix}reload`:
				const commandName = args[0].toLowerCase();
    		const reloadCmd = message.client.commands.get(commandName);

				if(!reloadCmd){
					return message.reply('No command with the name provided found.');
				}

				delete require.cache[require.resolve(`../cmds/${reloadCmd.data.name}.js`)];

				const newCmd = require(`../cmds/${reloadCmd.data.name}.js`);
				await message.client.commands.set(newCmd.data.name, newCmd);
				await message.reply(`Successfully reloaded the command with name \`${newCmd.data.name}\`.`);
				break;
		}
	}
}