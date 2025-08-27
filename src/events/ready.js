const { EmbedBuilder } = require('discord.js');
const { botlogger } = require('../utils//webhooks');

module.exports = {
  name: 'ready',

  async execute(client) {
    await client.user.setActivity('ModHelpr - Your Best Moderator', { type: 4 });

    console.log(`
      Logged in: ${client.user.tag}.
      ----------------
      Logged time: ${new Date().toISOString()}
      ----------------
      ${client.user.username} is operational!
    `);

    botlogger.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xfff300)
          .setAuthor({
            name: client.user.tag,
            iconURL: client.user.avatarURL()
          })
          .addFields(
            {
              name: 'Login Time',
              value: `<t:${Math.floor(Date.now() / 1000)}:f>`
            }
          )
          .setFooter({
            text: 'ModHelpr - Powered by dragonyc1002'
          })
      ]
    })
  }
}

