const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const ms = require('ms');
const modlogsPath = path.join(__dirname, '../data/modlogs.json');

const modlogscmd = new SlashCommandBuilder()
  .setName('modlogs')
  .setDescription('Shows a user\'s modlogs')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The target user to lookup modlogs')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

module.exports = {
  data: modlogscmd,

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user');
    const data = await fs.promises.readFile(modlogsPath, 'utf-8');
    modlogs = JSON.parse(data);
    
    const cases = modlogs[user.id] ? Object.keys(modlogs[user.id]) : null;

    if(!cases || cases.length === 0) {
      await interaction.editReply('👉 | No mod logs found.');
      return;
    }

    let res = '';
    for(let i = cases.length - 1; i > -1; i--){
      const user_cases = modlogs[user.id][cases[i]]
      res += `● __${ms(Date.now() - Number(user_cases.issued), { long: true })} ago__: ${user_cases.mod} issued a ${user_cases.type} (\`${user_cases.caseId}\`) for \`${user_cases.reason}\`.\n`;
    }

    await interaction.editReply(`> 🔨 | Found ${cases.length} logs:\n` + res);
  }
}