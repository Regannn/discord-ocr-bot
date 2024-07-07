const Discord = require('discord.js');
const fetch = require('node-fetch');
const Tesseract = require('tesseract.js');
require('dotenv').config();

const prefix = '-';

const intents = new Discord.Intents([
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.DIRECT_MESSAGES,
]);

const client = new Discord.Client({ intents });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  
    // Define the target channel IDs where the bot should respond to commands
    const targetChannelIds = ['target channel IDs'];

    // Check if the message is from a target channel and meets other conditions
    if (!targetChannelIds.includes(message.channel.id) || !message.content.startsWith(prefix) || message.author.bot) {
      return;
    }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ocr') {
    // Check if the message contains an attached image
    if (!message.attachments.first() || !message.attachments.first().name.endsWith('.png')) {
      return message.reply('Please attach a PNG image for OCR.');
    }

    try {
      const attachment = message.attachments.first();
      const imageBuffer = await fetchImage(attachment.url);
      const text = await performOCR(imageBuffer);

      message.channel.send(`\n${text}`, { disableMentions: 'all' });
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while performing OCR.');
    }
  }
});

async function fetchImage(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  return buffer;
}

async function performOCR(imageBuffer) {
  const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
  return text.trim();
}

client.login(process.env.DISCORD_TOKEN);
