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

// CSV data as a string (use the actual CSV data you want to parse)
const csvData = `
"id","ident","type","name","latitude_deg","longitude_deg","elevation_ft","continent","iso_country","iso_region","municipality","scheduled_service","gps_code","iata_code","local_code","home_link","wikipedia_link","keywords"
"6523","00A","heliport","Total RF Heliport",40.070985,-74.933689,11,"NA","US","US-PA","Bensalem","no","K00A",,"00A","https://www.penndot.pa.gov/TravelInPA/airports-pa/Pages/Total-RF-Heliport.aspx",,""
"323361","00AA","small_airport","Aero B Ranch Airport",38.704022,-101.473911,3435,"NA","US","US-KS","Leoti","no","00AA",,"00AA",,,
`;

// Parse the CSV data to JSON
Papa.parse(csvData, {
    header: true, // Use the first row as header keys
    skipEmptyLines: true, // Skip any empty lines
    complete: (result) => {
        // result.data will contain the parsed JSON objects
        interaction.reply(JSON.stringify(result.data, null, 2));
    },
});

	},
	cooldown: 4
};



export default storymodal;
