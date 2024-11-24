import fs from 'node:fs';
import path from 'node:path';
import type { Command } from '../types/Command';
import { Events, type Client } from 'discord.js';

const readyEvent = async (client:Client) => {

    client.once(Events.ClientReady, (readyClient:Client<true>) => {
        console.log(`[ONLINE] Ready! Logged in as BOT: ${readyClient.user.tag}`);
      });

  }

  export default readyEvent;