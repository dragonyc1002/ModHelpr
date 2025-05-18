const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const ms = require('ms');
const modlogsPath = path.join(__dirname, '../data/modlogs.json');

const modlogs = new SlashCommandBuilder()
  .setName('modlogs')
  .setDescription('Shows one\'s modlogs')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The target user, either ID or the user tag is applicable')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

module.exports = {
  data: modlogs,

  async execute(interaction) {
    await interaction.deferReply();

    const id = interaction.options.getUser('user').id;
    const data = await fs.promises.readFile(modlogsPath, 'utf-8');
    logs = JSON.parse(data);
    
    const cases = Object.keys(logs[id]);

    if(!cases || cases.length === 0) {
      await interaction.editReply('👉 | No mod logs found.');
      return;
    }

    let res = '';
    for(let i = cases.length - 1; i > -1; i--){
      res += `● __${ms(Date.now() - Number(logs[id][cases[i]].issued), { long: true })} ago__: ${logs[id][cases[i]].mod} issued a ${logs[id][cases[i]].type} (\`${logs[id][cases[i]].caseId}\`) for \`${logs[id][cases[i]].reason}\`.\n`;
    }

    await interaction.editReply(`> 🔨 | Found ${cases.length} logs:\n\n` + res);
  }
}