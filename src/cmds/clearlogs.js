const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const modlogsPath = path.join(__dirname, '../data/modlogs.json');

const { cmdres } = require('../data/constants.json');

const { newModEmbed } = require('../utils/embeds');
const { modlogger } = require('../utils/webhooks');

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

    if (user.bot) return interaction.editReply(cmdres.isBot);
  
    let modlogs = {};
    const data = await fs.promises.readFile(modlogsPath, 'utf-8');
    modlogs = JSON.parse(data);

    function no_modlogs(modlogobj) {
      return Object.keys(modlogobj).length === 0;
    }
    if (!modlogs[user.id] || no_modlogs(modlogs[user.id])) return interaction.editReply(`
      ⚠️ | Target does not have any modlogs in the database.
    `);

    modlogs[user.id] = {};

    await fs.promises.writeFile(modlogsPath, JSON.stringify(modlogs, null, 2));
    await interaction.editReply(`✅ | Succesfully cleared logs of ${user.username}.`);

    modlogger.send({
      embeds: [
        newModEmbed({
          action: 'Cleared Log',
          target: user,
          reason: reason ?? 'No reason given.',
          moderator:interaction.user
        })
      ]
    });
  }
}