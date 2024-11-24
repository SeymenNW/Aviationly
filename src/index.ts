import { Client,  GatewayIntentBits, Collection } from 'discord.js';
import type { Command } from './types/Command';
import loadCommands from './utils/loadCommands';
import readyEvent from './utils/readyEvent';
import interactionCreateHandler from './utils/interactionCreateHandler';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL!,
    ssl: true
  }
});


//Environment Variables (See example file 'example.env.text')
const botToken: string = process.env.BOT_TOKEN ?? '';
const clientId: string = process.env.CLIENT_ID ?? '';
const guildId: string = process.env.GUILD_ID ?? '';

if (!botToken || !clientId) {
  console.error('[ERROR] Missing required environment variables.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await readyEvent(client);
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, string>();
await interactionCreateHandler(client);

loadCommands(client, __dirname).then(() => {
  client.login(botToken).catch((error) => {
    console.error('[ERROR] Failed to log in to Discord:', error);
  });
});
