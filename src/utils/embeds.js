/**
 * Embeds that are frequently used
 *   - newCommandEmbed(): used to create embeds to log the use of application commands
 *   - newErrorEmbed(): used to create embeds to log errors occurred during interaction / event execution
 *   - newModEmbed(): used to create embeds to log moderative actions
 *   - [embed generator]: [purpose of the embed]
 */
const { EmbedBuilder } = require('discord.js');

const footerText = 'ModHelpr - powered by dragonyc1002';

function newCommandEmbed(props){
  return new EmbedBuilder()
    .setTitle(`Command Log`)
    .setColor(0x71da71)
    .addFields(
      {
        name: 'Command',
        value: `</${props.cmdname}:${props.cmdid}>`
      },
      {
        name: 'User',
        value: `${props.user.username} (${props.user.id})`
      },
      {
        name: 'Server',
        value: `${props.guild.name} (${props.guild.id})`
      },
      {
        name: 'Time',
        value: `<t:${props.timestamp}:f>`
      }
    )
    .setThumbnail(props.user.displayAvatarURL())
    .setFooter({
      text: footerText,
      iconURL: props.botavatar
    })
}

function newErrorEmbed(props){
  return new EmbedBuilder()
    .setTitle(`Error Log`)
    .setColor(0xeb0505)
    .addFields(
      {
        name: 'Command',
        value: `</${props.cmdname}:${props.cmdid}>`
      },
      {
        name: 'User',
        value: `${props.user.username} (${props.user.id})`
      },
      {
        name: 'Server',
        value: `${props.guild.name} (${props.guild.id})`
      },
      {
        name: 'Time',
        value: `<t:${props.timestamp}:f>`
      },
      {
        name: 'Error Message',
        value: `\`${props.errormsg ?? 'No error message given'}\``
      }
    )
    .setThumbnail(props.user.displayAvatarURL())
    .setFooter({
      text: footerText,
      iconURL: props.botavatar
    })
}

function newModEmbed(props){
  return new EmbedBuilder()
    .setTitle('Moderation Log')
    .setColor(0x25d964)
    .addFields(
      {
        name: 'Action',
        value: props.action
      },
      {
        name: 'Target',
        value: `${props.target.username} (${props.target.id})`
      },
      {
        name: 'Reason',
        value: `\`${props.reason}\``
      },
      {
        name: 'Moderator',
        value: `${props.moderator.username} (${props.moderator.id})`
      }
    )
    .setFooter({
      text: footerText,
      iconURL: props.botavatar
    })
}
  
module.exports = {
  newCommandEmbed,
  newErrorEmbed,
  newModEmbed
}