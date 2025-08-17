const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

const { generateCaseId } = require('../utils/utils');
const { cmdres } = require('../data/constants');

const { newModEmbed } = require('../utils/embeds');
const { modlogger } = require('../utils/webhooks');

const fs = require('fs');
const path = require('path');
const modlogsPath = path.join(__dirname, '../data/modlogs.json');

const pban = new SlashCommandBuilder()
  .setName('pban')
  .setDescription('Permanently bans a user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The target user to ban')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('The reason for the ban')
      .setRequired(true)
  )
  .addNumberOption(option =>
    option.setName('deletemsg')
      .setDescription('Delete the message sent by the target user in the past x days')
      .setMaxValue(7)
      .setMinValue(0)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

module.exports = {
  data: pban,

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const deletemsg = interaction.options.getNumber('deletemsg')*86400 ?? null;

    const member = interaction.guild.members.cache.get(user.id);
    if(!member) return interaction.editReply(cmdres.notInGuild);
    if(member.bot) return interaction.editReply(cmdres.isBot); 
    if(member.id === interaction.user.id) return interaction.editReply('🤦');
    if(!member.moderatable) return interaction.editReply(cmdres.cannotModerate);
    
    const caseId = `MOD-P${generateCaseId(7)}`;

    await member.send(`⚠️ | You have been **permanently banned** from **${interaction.guild.name}**.\nℹ️ | Reason: \`${reason}\`\n🔨 | Your moderation case ID: \`${caseId}\``);
    await member.ban({ deleteMessageSeconds: deletemsg, reason: `${reason}` })
      .then(interaction.editReply(`✅ | Permanent Ban issued successfully for ${user.username} for \`${reason}\` with case ID \`${caseId}\`.`));
  
    let modlogs = {};
    const data = await fs.promises.readFile(modlogsPath, 'utf-8');
    modlogs = JSON.parse(data);

    if (!modlogs[user.id]) {
      modlogs[user.id] = {}; // initialise an empty object if the user does not exist in modlogs
    }

    modlogs[user.id][caseId] = {
      type: 'Permanent Ban',
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
          action: 'Permanent Ban',
          target: user,
          reason: reason,
          moderator: interaction.user
        })
      ]
    });
  }
}