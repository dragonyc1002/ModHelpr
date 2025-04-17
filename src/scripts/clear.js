const axios = require('axios');

const { bot } = require('../../config');
const { cmdGuilds } = require('../data/constants');

clear(bot.token, cmdGuilds[0]); 

async function clear(token, guild) {
  const { id } = await getDataByToken(token);
  const data = JSON.stringify([]);
  const baseurl = `https://discord.com/api/v10/applications/${id}`;
  const requrl = guild
    ? `${baseurl}/guilds/${guild}/commands`
    : `${baseurl}/commands`;

  await axios.put(requrl, data, {
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
      Authorization: `Bot ${token}`
    }
  }).then((res) => {
    if (res.status !== 200) {
      console.error(JSON.parse(res.data));
      throw new Error('Failed to clear commands.');
    }

    console.log('✅| Successfully cleared application commands.\nℹ️| Guild ID: ' + guild);
  });
}

function getDataByToken(token) {
  return new Promise((resolve, reject) => {
    axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bot ${token}`
      }
    }).then((res) => {
      if (res.status !== 200) return reject(JSON.parse(res.data));
      resolve(res.data);
    });
  });
}