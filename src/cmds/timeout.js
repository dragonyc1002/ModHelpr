const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

const { generateCaseId } = require('../utils/utils');
const { cmdres } = require('../data/constants');

const { newModEmbed } = require('../utils/embeds');
const { modlogger } = require('../utils/webhooks');

const fs = require('fs');
const path = require('path');
const modlogsPath = path.join(__dirname, '../data/modlogs.json');

const ms = require('ms');

const timeout = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('Times out a user for a duration')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The target user to timeout')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('duration')
      .setDescription('The duration of the timeout (e.g. 1h)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('The reason of the moderative action')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers);

module.exports = {
  data: timeout,

  async execute(interaction){
    await interaction.deferReply();

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason');

    const member = interaction.guild.members.cache.get(user.id);
    if(!member) return interaction.editReply(cmdres.notInGuild);
    if(member.bot) return interaction.editReply(cmdres.isBot); 
    if(member.id === interaction.user.id) return interaction.editReply('🤦');
    if(!member.moderatable) return interaction.editReply(cmdres.cannotModerate);
    
    const caseId = `MOD-T${generateCaseId(7)}`;

    const convertedms = ms(duration);
    if(!convertedms) return interaction.editReply(cmdres.incorrectDuration);
    
    if(member.isCommunicationDisabled()) return interaction.editReply('❌ | User is already timed out.');

    await member.send(`⚠️ | You have been **timed out** from **${interaction.guild.name}**.\nℹ️ | Reason: \`${reason}\`\n🔨 | Your moderation case ID: \`${caseId}\`.`);
    await member.timeout(convertedms, reason)
      .then(interaction.editReply(`✅ | Timeout of ${ms(convertedms, { long: true })} issued successfully for ${user.username} for \`${reason}\` with case ID \`${caseId}\`.`));
    
    let modlogs = {};
    const data = await fs.promises.readFile(modlogsPath, 'utf-8');
    modlogs = JSON.parse(data);

    if (!modlogs[user.id]) {
      modlogs[user.id] = {}; // initialise an empty object if the user does not exist in modlogs
    }

    modlogs[user.id][caseId] = {
      type: 'Timeout',
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
          action: 'Timeout',
          target: user,
          reason: reason,
          moderator: interaction.user
        })
      ]
    });
  }
}