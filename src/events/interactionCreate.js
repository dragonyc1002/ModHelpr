const { botlogger } = require('../utils/webhooks');
const { newCommandEmbed, newErrorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      const interatedTimestamp = Date.now().toString().substr(0, 10);

      try {
        await command.execute(interaction);
        botlogger.send({
          embeds: [
            newCommandEmbed({
              cmdname: interaction.commandName,
              cmdid: interaction.commandId,
              user: interaction.user,
              guild: interaction.guild,
              timestamp: interatedTimestamp,
              botavatar: interaction.client.user.avatarURL()
            })
          ]
        });
      } catch (err) {
        botlogger.send({
          embeds: [
            newErrorEmbed({
              cmdname: interaction.commandName,
              cmdid: interaction.commandId,
              user: interaction.user,
              guild: interaction.guild,
              timestamp: interatedTimestamp,
              botavatar: interaction.client.user.avatarURL(),
              errormsg: err.message
            })
          ]
        });
      } 
    }
  }
}