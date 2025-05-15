require('dotenv').config();

const env = process.env;

if(!env.id) throw new Error('App ID not configured.');
if(!env.token) throw new Error('Bot token not configured.');
if(!env.loggerId) throw new Error('Logger ID not configured.');
if(!env.loggerToken) throw new Error('Logger token not configured.');
if(!env.botAdmins) throw new Error('Bot administrator not configured.');

module.exports = {
  bot: {
    id: env.id,
    token: env.token
  },
  logger: {
    id: env.loggerId,
    token: env.loggerToken
  },
  cmdGuilds: env.cmdGuilds.split(', '),
  botAdmins: env.botAdmins.split(', ')
}