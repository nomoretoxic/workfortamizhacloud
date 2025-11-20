// --- Load environment variables ---
require('dotenv').config();

// --- Import modules ---
const express = require('express');
const { Client, GatewayIntentBits, Partials } = require('discord.js');

// --- Simple web server (for Render/Replit keep-alive) ---
const app = express();
app.get('/', (req, res) => res.send('✅ Bot is running and connected to Discord.'));
app.listen(process.env.PORT || 3000, () => {
  console.log(`🌐 Web server running on port ${process.env.PORT || 3000}`);
});

// --- Environment variables ---
const PREFIX = '!'; // prefix confirmed
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
  if (message.author.bot) return;

  console.log(`📩 [${message.channel.type}] ${message.author.tag}: ${message.content}`);

  // Only respond in DMs
  if (message.channel.type !== 1) return; // 1 = DM

  // Must start with prefix
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // --- !payment command (DM ONLY) ---
  if (command === "payment") {
    return message.reply({
      content: "Here is your payment info:",
      files: [PAYMENT_IMAGE_URL]
    });
  }
});

// --- Login ---
client.login(DISCORD_TOKEN);

  
