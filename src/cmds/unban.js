const { PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { generateCaseId } = require('../utils/utils');
const { cmdres } = require('../data/constants');

const { newModEmbed } = require('../utils/embeds');
const { modlogger } = require('../utils/webhooks');

const fs = require('fs');
const path = require('path');
const modlogsPath = path.join(__dirname, '../data/modlogs.json');

const unban = new SlashCommandBuilder()
  .setName('unban')
  .setDescription('Unbanning a user')
  .addStringOption(option =>
    option.setName('id')
      .setDescription('User ID')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('The reason for the unban')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

module.exports = {
  data: unban,

  async execute(interaction){
    await interaction.deferReply();

    const userId = interaction.options.getString('id');
    const reason = interaction.options.getString('reason');
    
    try {
      await interaction.guild.bans.fetch(userId);
    } catch {
      return interaction.editReply(cmdres.notBanned);
    }

    const caseId = `MOD-U${generateCaseId(7)}`;

    await interaction.guild.bans.remove(userId)
      .then(user => interaction.editReply(`✅ | Successfully unbanned \`${user.username}\` with case ID \`${caseId}.\``));
    
    const user = interaction.client.users.cache.get(userId);

    let modlogs = {};
    const data = await fs.promises.readFile(modlogsPath, 'utf-8');
    modlogs = JSON.parse(data);
    
    modlogs[user.id][caseId] = {
      type: 'Unban',
      user: user.username,
      uid: user.id,
      reason: reason,
      caseId: caseId,
      issued: `${Math.floor(Date.now())}`,
      mod: interaction.user.username
    };

    await fs.promises.writeFile(modlogsPath, JSON.stringify(modlogs, null, 2));

    modlogger.send({
      embeds: [
        newModEmbed({
          action: 'Unban',
          target: user,
          reason: reason,
          moderator: interaction.user
        })
      ]
    });
  }
}