require('dotenv').config();

const env = process.env;

if(!env.id) throw new Error('App ID not configured.');
if(!env.token) throw new Error('Bot token not configured.');

if(!env.botloggerId) throw new Error('Bot Logger ID not configured.');
if(!env.botloggerToken) throw new Error('Bot Logger token not configured.');
if(!env.modloggerId) throw new Error('Moderation Logger ID not configured.');
if(!env.modloggerToken) throw new Error('Moderation Logger token not configured.');

if(!env.botAdmins) throw new Error('Bot administrator not configured.');

module.exports = {
  bot: {
    id: env.id,
    token: env.token,
    prefix: 'm.'
  },
  botloggerprops: {
    id: env.botloggerId,
    token: env.botloggerToken
  },
  modloggerprops: {
    id: env.modloggerId,
    token: env.modloggerToken
  },
  cmdGuilds: env.cmdGuilds.split(', '),
  botAdmins: env.botAdmins.split(', ')
}