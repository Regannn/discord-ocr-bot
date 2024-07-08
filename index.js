const Discord = require('discord.js');
const fetch = require('node-fetch');
const Tesseract = require('tesseract.js');
const fs = require('fs');
require('dotenv').config();

const prefix = '-';
const channelFile = 'channels.json';

const intents = new Discord.Intents([
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.DIRECT_MESSAGES,
]);

const client = new Discord.Client({ intents });

let targetChannelIds = loadChannelIds();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ocr') {
    if (!targetChannelIds.includes(message.channel.id)) {
      return message.reply('This command is not allowed in this channel.');
    }

    if (!message.attachments.first() || !message.attachments.first().name.endsWith('.png')) {
      return message.reply('Please attach a PNG image for OCR.');
    }

    const formats = args; // Array of formats

    try {
      const attachment = message.attachments.first();
      const imageBuffer = await fetchImage(attachment.url);
      let text = await performOCR(imageBuffer);

      text = formatText(text, formats);
      message.channel.send(`\n${text}`, { disableMentions: 'all' });
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while performing OCR.');
    }
  } else if (command === 'addchannel' && message.member.permissions.has('ADMINISTRATOR')) {
    const channelId = args[0];
    if (!targetChannelIds.includes(channelId)) {
      targetChannelIds.push(channelId);
      saveChannelIds(targetChannelIds);
      message.reply(`Channel ${channelId} added to the OCR list.`);
    } else {
      message.reply('This channel is already in the OCR list.');
    }
  } else if (command === 'removechannel' && message.member.permissions.has('ADMINISTRATOR')) {
    const channelId = args[0];
    targetChannelIds = targetChannelIds.filter(id => id !== channelId);
    saveChannelIds(targetChannelIds);
    message.reply(`Channel ${channelId} removed from the OCR list.`);
  } else if (command === 'listchannels' && message.member.permissions.has('ADMINISTRATOR')) {
    if (targetChannelIds.length === 0) {
      message.reply('No channels are currently in the OCR list.');
    } else {
      message.reply(`Current OCR channels: ${targetChannelIds.join(', ')}`);
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

function formatText(text, formats) {
  if (formats.includes('bold')) {
    text = `**${text}**`;
  }
  if (formats.includes('italic')) {
    text = `*${text}*`;
  }
  if (formats.includes('code')) {
    text = `\`\`\`${text}\`\`\``;
  }
  return text;
}

function loadChannelIds() {
  try {
    if (!fs.existsSync(channelFile)) {
      fs.writeFileSync(channelFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(channelFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading channel IDs:', error);
    return [];
  }
}

function saveChannelIds(channelIds) {
  try {
    fs.writeFileSync(channelFile, JSON.stringify(channelIds, null, 2));
  } catch (error) {
    console.error('Error saving channel IDs:', error);
  }
}

client.login(process.env.DISCORD_TOKEN);
