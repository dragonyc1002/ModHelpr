const { WebhookClient } = require('discord.js');

const { logger } = require('../../config');

const { id, token } = logger;

// Webhook used to log moderative actions
const modActionLogger = new WebhookClient({
  id: id,
  token: token
});

module.exports = {
  modActionLogger
}