import { ActionRowBuilder, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { Command } from '../../types/Command';

const taf: Command = {
	data: new SlashCommandBuilder()
		.setName('taf')
		.setDescription('Shows the latest TAF (Terminal Aerodrome Forecast) for any airport in the world.'),


	async execute(interaction: CommandInteraction) { 

        interaction.reply("This is an upcoming feature.");
    


	},
	cooldown: 4
};



export default taf;
