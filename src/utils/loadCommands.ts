import fs from 'node:fs';
import path from 'node:path';
import type { Command } from '../types/Command';
import type { Client } from 'discord.js';

const loadCommands = async (client:Client, dirName:string) => {
    const foldersPath = path.join(dirName, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
  
    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
  
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
  
        try {
          const command: Command = (await import(filePath)).default;
  
          //@ts-ignore
          if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            console.log(`[SUCCES] Loaded command: ${command.data.name}`);
          } else {
            console.warn(`[WARNING] Command at '${filePath}' is missing "data" or "execute" property.`);
          }
        } catch (error) {
          console.error(`[ERROR] Failed to load command at '${filePath}':`, error);
        }
      }
    }
  };

  export default loadCommands;