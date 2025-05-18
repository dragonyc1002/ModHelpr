const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const modlogsPath = path.join(__dirname, '../data/modlogs.json');

const { modEmbed } = require('../utils/EmbedManager');
const { modlogger } = require('../utils/WebhookManager');

const clearlogs = new SlashCommandBuilder()
  .setName('clearlogs')
  .setDescription('Clears the logs of the target user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The target user to clear the logs')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('The reason of the removal of the logs (not required)')
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

module.exports = {
  data: clearlogs,

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
  
    let modlogs = {};
    const data = await fs.promises.readFile(modlogsPath, 'utf-8');
    modlogs = JSON.parse(data);

    if (!modlogs[user.id]) {
      await interaction.editReply(`
        ⚠️ | Target is not in the database. This is likely due to they have not been taken against logged action in the past.`);
      return;
    }

    modlogs[user.id] = {};

    await fs.promises.writeFile(modlogsPath, JSON.stringify(modlogs, null, 2));
    await interaction.editReply(`✅ | Succesfully cleared logs of ${user.username}.`);

    modlogger.send({
      embeds: [
        modEmbed({
          action: 'Cleared Log',
          target: user,
          reason: reason ?? 'No reason given.',
          mod:interaction.user.username
        })
      ]
    });
  }
}