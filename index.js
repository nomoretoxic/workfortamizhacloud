require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages // optional, in case you want guild support
  ],
  partials: [Partials.Channel] // required to receive DMs
});

// 🔧 Load variables from .env
const PREFIX = process.env.BOT_PREFIX || '!';
const PAYMENT_IMAGE_URL = process.env.PAYMENT_IMAGE_URL;
const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`💬 Prefix: ${PREFIX}`);
  console.log(`🖼️ Payment Image: ${PAYMENT_IMAGE_URL ? 'Loaded' : 'Missing'}`);
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Only respond to DMs (type 1 = DMChannel)
  if (message.channel.type !== 1) return;

  // Check for payment command
  if (message.content.trim().toLowerCase() === `${PREFIX}payment`) {
    try {
      await message.channel.send({
        content: '**📱 Scan this QR code to make your payment:**',
        files: [PAYMENT_IMAGE_URL],
      });
      console.log(`✅ Sent payment QR to ${message.author.tag}`);
    } catch (err) {
      console.error('❌ Error sending DM:', err);
    }
  }
});

// 🧠 Login using token
client.login(TOKEN);
