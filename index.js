require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages, // optional, in case you also want guild support
  ],
  partials: [Partials.Channel] // required to receive DMs
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Only respond to DMs (not in servers)
  if (message.channel.type !== 1) return; // type 1 = DMChannel

  // Command check
  if (message.content.trim().toLowerCase() === '!payment') {
    const qrImage = 'https://cdn.discordapp.com/attachments/1437027536914612255/1437967253793407107/PhonePeQR_India_Post_Payment_Bank_-_73520.png?ex=69152add&is=6913d95d&hm=e9b0d12fe26499345e82a566655e78d1346a666343e149b9a21cc4994faa37c4';

    try {
      await message.channel.send({
        content: '**📱 Scan this QR code to make your payment:**',
        files: [qrImage],
      });
      console.log(`Sent payment QR to ${message.author.tag}`);
    } catch (err) {
      console.error('Error sending DM:', err);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
