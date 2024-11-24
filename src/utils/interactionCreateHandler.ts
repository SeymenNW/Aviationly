import type { Command } from '../types/Command';
import { CommandInteraction, Events, type Client } from 'discord.js';

const interactionCreateHandler = async (client: Client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;  
        const command: Command = client.commands.get(interaction.commandName);
        console.log("Logged Cooldown (Test):", command.cooldown);

        if (!command) {
            console.warn(`[WARNING] No command found for interaction: ${interaction.commandName}`);
            return;
        }

        try {
            if (interaction.isAutocomplete()) {
              command.autoComplete?.(interaction)
            } else {
               
                await command.execute(interaction); 
            }
        } catch (error) {
            console.error(`[ERROR] Error executing command '${interaction.commandName}':`, error);
            const cmdInteraction = interaction as CommandInteraction;
            await cmdInteraction.reply({ content: '[ERROR] There was an error while executing this command.', ephemeral: true });
        }

    });
}

export default interactionCreateHandler;
