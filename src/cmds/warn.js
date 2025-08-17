const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { generateCaseId } = require('../utils/utils');

const { newModEmbed } = require('../utils/embeds');
const { modlogger } = require('../utils/webhooks');

const fs = require('fs');
const path = require('path');
const modlogsPath = path.join(__dirname, '../data/modlogs.json');

const warn = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warns a user with specific duration')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The target user to warn')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('The reason for the warning')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

module.exports = {
  data: warn,

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    const member = interaction.guild.members.cache.get(user.id);
    if(!member) return interaction.editReply(cmdres.notInGuild);
    if(member.bot) return interaction.editReply(cmdres.isBot); 
    if(member.id === interaction.user.id) return interaction.editReply('🤦');
    if(!member.moderatable) return interaction.editReply(cmdres.cannotModerate);
    
    const caseId = `MOD-W${generateCaseId(7)}`;

    await member.send(`⚠️ | You have been **warned**.\nℹ️ | Reason: \`${reason}\`\n🔨 | Your moderation case ID: \`${caseId}\``)
      .then(interaction.editReply(`✅ | Warning issued successfully for ${user.username} for \`${reason}\` with case ID \`${caseId}\`.`));
    
    let modlogs = {};
    const data = await fs.promises.readFile(modlogsPath, 'utf-8');
    modlogs = JSON.parse(data);

    if (!modlogs[user.id]) {
      modlogs[user.id] = {}; // initialise an empty object if the user does not exist in modlogs
    }

    modlogs[user.id][caseId] = {
      type: 'Warning',
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
          action: 'Warning',
          target: user,
          reason: reason,
          moderator: interaction.user
        })
      ]
    });
  }
}