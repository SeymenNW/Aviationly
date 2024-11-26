import { ActionRowBuilder, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { Command } from '../../types/Command';
import Papa from 'papaparse';
//@ts-ignore
import notamDecoder from '../../services/notams.services/notamdecoder.service';
import type { DecodedNotam } from '../../types/DecodedNotam';

const storymodal: Command = {
	data: new SlashCommandBuilder()
		.setName('notam')
		.setDescription('Get the active and upcoming NOTAMs (Notice to Air Missions) for any airport'),


	async execute(interaction: CommandInteraction) { 

        interaction.reply("This command has yet to be build (Realtime NOTAM data is not easy to access)");
    


	},
	cooldown: 4
};



export default storymodal;
