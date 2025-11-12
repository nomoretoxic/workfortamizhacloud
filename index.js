// Load environment variables
require('dotenv').config();

// Import modules
const express = require('express');
const { Client, GatewayIntentBits, Partials, ChannelType } = require('discord.js');

// --- Simple web server (Render/Replit keep-alive) ---
const app = express();
app.get('/', (req, res) => res.send('✅ Bot is running and connected to Discord.'));
app.listen(process.env.PORT || 3000, () => {
  console.log(`🌐 Web server running on port ${process.env.PORT || 3000}`);
});

// --- Discord client setup ---
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages, // Optional: handle guild messages too
  ],
  partials: [Partials.Channel], // Needed for DMs
});

// --- Environment variables ---
const PREFIX = process.env.BOT_PREFIX || '!';
const PAYMENT_IMAGE_URL = process.env.PAYMENT_IMAGE_URL;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// --- When the bot is ready ---
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// --- Message handler ---
client.on('messageCreate', async (message) => {
  // Ignore other bots
  if (message.author.bot) return;

  // Only respond to DMs
  if (message.channel.type !== ChannelType.DM) return;

  // Command: e.g. !payment
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

  // Optional: !help command
  if (message.content.trim().toLowerCase() === `${PREFIX}help`) {
    await message.channel.send(
      `**Hi ${message.author.username}!** 👋\n` +
      `Here are my available DM commands:\n\n` +
      `• \`${PREFIX}payment\` — Get the QR code to make a payment.\n` +
      `• \`${PREFIX}help\` — Show this help message.`
    );
  }
});

// --- Log in the bot ---
client.login(DISCORD_TOKEN);


      
