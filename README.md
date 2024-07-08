# Discord OCR Bot

The Discord OCR Bot is a versatile tool built with Discord.js, node-fetch, Tesseract.js, and fs for optical character recognition (OCR) on PNG images within designated Discord channels. It allows administrators to manage OCR-enabled channels dynamically through specific commands.

## Features

- **OCR Command**: Perform OCR on PNG images uploaded to designated channels.
- **Dynamic Channel Management**:
  - **Add Channel**: Administrators can add channels to the OCR-enabled list.
  - **Remove Channel**: Remove channels from the OCR-enabled list.
  - **List Channels**: List all channels currently OCR-enabled.

## Setup

To set up the Discord OCR Bot locally or on your server:

1. **Clone the repository:**

```
   git clone https://github.com/your/repository.git
```
```
   cd discord-ocr-bot
```

2. **Install dependencies:**

```
   npm install
```

3. **Configure environment variables:**
  - Add your Discord bot token in .env file

4. **Start the bot:**
```
node .
```

## Usage
-  **Commands:**
  - -ocr: Perform OCR on a PNG image uploaded to an OCR-enabled channel.
  - -addchannel <channelId>: Add a channel to the OCR-enabled list.
  - -removechannel <channelId>: Remove a channel from the OCR-enabled list.
  - -listchannels: List all OCR-enabled channels.
