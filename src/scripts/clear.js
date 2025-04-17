const https = require('https');

const { bot } = require('../../config');

clear(bot.token);

async function clear(token, guild) {
  const { id } = await getDataByToken(token);
  const data = JSON.stringify([]);
  const path = guild
    ? `/api/v10/applications/${id}/guilds/${guild}/commands`
    : `/api/v10/applications/${id}/commands`;

  const req = https.request({
    protocol: 'https:',
    hostname: 'discord.com',
    path: path,
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
      Authorization: `Bot ${token}`
    }
  }, res => {
    let r = '';

    res.on('data', (chunk) => {
        r += chunk;
    });

    res.once('end', () => {
      if (res.statusCode !== 200) {
        console.error(JSON.parse(r));
        throw new Error('Failed to clear commands.');
      }

      console.log('Commands has been cleared.')
      console.log('Guild id:' + guild);
    });
  });

  req.write(data);
  req.end();
}

function getDataByToken(token) {
  return new Promise((resolve, reject) => {
    https.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bot ${token}`
      }
    }, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.once('end', () => {
        if (res.statusCode !== 200) return reject(JSON.parse(data));
        resolve(JSON.parse(data))
      });
    });
  });
}