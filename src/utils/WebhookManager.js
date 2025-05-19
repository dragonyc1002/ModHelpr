const { WebhookClient } = require('discord.js');
const { botloggerprops, modloggerprops } = require('../../config');

const botlogger = new WebhookClient(botloggerprops);
const modlogger = new WebhookClient(modloggerprops);

module.exports = { botlogger, modlogger }