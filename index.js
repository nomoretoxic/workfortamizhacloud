require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Partials, ChannelType } = require('discord.js');

// --- Start a simple web server (prevents "port not found" errors) ---
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
    GatewayIntentBits.GuildMessages, // optional (server message support)
  ],
  partials: [Partials.Channel], // required for DMs
});

// --- Log in confirmation ---
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// --- Message handling ---
client.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Only respond to DMs
  if (message.channel.type !== ChannelType.DM) return;

  // Command: !payment
  if (message.content.trim().toLowerCase() === '!payment') {
    const qrImage = 'https://cdn.discordapp.com/attachments/1437027536914612255/1437967253793407107/PhonePeQR_India_Post_Payment_Bank_-_73520.png?ex=69152add&is=6913d95d&hm=e9b0d12fe26499345e82a566655e78d1346a666343e149b9a21cc4994faa37c4';

    try {
      await message.channel.send({
        content: '**📱 Scan this QR code to make your payment:**',
        files: [qrImage],
      });
      console.log(`💸 Sent payment QR to ${message.author.tag}`);
    } catch (err) {
      console.error('❌ Error sending DM:', err);
    }
  }
});

// --- Log in with your bot token ---
client.login(process.env.DISCORD_TOKEN);

 
