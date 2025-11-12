// --- Load environment variables ---
require('dotenv').config();

// --- Import modules ---
const express = require('express');
const { Client, GatewayIntentBits, Partials, ChannelType } = require('discord.js');

// --- Simple web server (for Render/Replit keep-alive) ---
const app = express();
app.get('/', (req, res) => res.send('✅ Bot is running and connected to Discord.'));
app.listen(process.env.PORT || 3000, () => {
  console.log(`🌐 Web server running on port ${process.env.PORT || 3000}`);
});

// --- Environment variables ---
const PREFIX = process.env.BOT_PREFIX || '!';
const PAYMENT_IMAGE_URL = process.env.PAYMENT_IMAGE_URL;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// --- Discord client setup ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel], // Needed for DMs
});

// --- Bot ready event ---
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  console.log(`🧩 Prefix: "${PREFIX}"`);
});

// --- Message handler ---
client.on('messageCreate', async (message) => {
  // Ignore bots
  if (message.author.bot) return;

  // Log all received messages for debugging
  console.log(`📩 [${message.channel.type}] ${message.author.tag}: ${message.content}`);
