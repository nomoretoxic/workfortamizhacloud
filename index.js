require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Partials, ChannelType } = require('discord.js');

// --- Start a simple web server (to prevent port errors) ---
const app = express();
app.get('/', (req, res) => res.send('✅ Bot is running!'));
app.listen(process.env.PORT || 3000, () => {
  console.log(`🌐 Web server running on port ${process.env.PORT || 3000}`);
});

// --- Create the Discord client ---
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages, // optional
  ],
  partials: [Partials.Channel], // required for DMs
});

// --- Variables from .env ---
const PREFIX = process.env.BOT_PREFIX || '!';
const PAYMENT_IMAGE_URL = process.env.PAYMENT_IMAGE_URL;

// --- When bot is ready ---
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// --- Handle messages ---
client.on('messageCreate', async (message) => {
  // Ignore bots
  if (message.author.bot) return;

  // Only respond to DMs
  if (message.channel.type !== ChannelType.DM) return;

  // Command: e.g. !payment or whatever prefix you set
  if (message.content.trim().toLowerCase() === `${PREFIX}payment`) {
    if (!PAYMENT_IMAGE_URL) {
      return message.channel.send('❌ Payment image URL not configured.');
    }

    try {
      await message.channel.send({
        content: '**📱 Scan this QR code to make your payment:**',
        files: [PAYMENT_IMAGE_URL],
      });
      console.log(`💸 Sent payment QR to ${message.author.tag}`);
    } catch (err) {
      console.error('❌ Error sending DM:', err);
    }
  }
});

// --- Log in with Discord token ---
client.login(process.env.DISCORD_TOKEN);

 
