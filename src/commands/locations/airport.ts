import { AutocompleteInteraction, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import Papa from 'papaparse';
import type { Command } from '../../types/Command';
import type { AirportData } from '../../types/AirportData';
import getAirportsList from '../../commandServices/airport/getAirportsList';

type stringChoice = {
    name: string,
    value: string
}

const storymodal: Command = {
    data: new SlashCommandBuilder()
        .setName('airport')
        .setDescription('Gets Airport information for the selected Airport')
         .addStringOption(option => option.setName(`icao`)
        .setDescription(`icao code for the airport`)
        .setRequired(true)
        .setAutocomplete(true)
        ) as SlashCommandBuilder,

    async autoComplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices: stringChoice[] = [];

        
        if (focusedOption.name === 'icao') {
            
            for (const airport of await getAirportsList()) {
                choices.push({
                    name: `${airport.name} (${airport.ident})`,
                    value: airport.ident
                })
            }
        }

        const filtered = choices.filter(choice =>
            choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
        ).slice(0,24);

        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value }))
        );

    },


    async execute(interaction: CommandInteraction) {
        const icaoValue = interaction.options.get('icao')?.value as string;
    
        try {
            const airportData: AirportData[] = await getAirportsList();
    
            if (airportData.length > 0) {
                const airportDataResponse = airportData.find(ad => ad.ident === icaoValue);
    
                if (airportDataResponse) {

                    const airportEmbed = new EmbedBuilder()
                    .setTitle(`Airport: ${airportDataResponse.name}`)
                    .setDescription(`Detailed information about ${airportDataResponse.name}, ${airportDataResponse.iso_country}`)
                    .addFields(
                        {
                            name: `General Information`,
                            value: `**ID**: ${airportDataResponse.id}\n**Ident**: ${airportDataResponse.ident}\n**Type**: ${airportDataResponse.type}\n**Region**: ${airportDataResponse.iso_region}\n**Country**: ${airportDataResponse.iso_country}`,
                            inline: false,
                        },
                        {
                            name: `Location`,
                            value: `**Latitude**: ${airportDataResponse.latitude_deg}\n**Longitude**: ${airportDataResponse.longitude_deg}\n**Elevation**: ${airportDataResponse.elevation_ft} ft\n**Municipality**: ${airportDataResponse.municipality}`,
                            inline: false,
                        },
                        {
                            name: `Codes`,
                            value: `**GPS Code**: ${airportDataResponse.gps_code || "N/A"}\n**IATA Code**: ${airportDataResponse.iata_code || "N/A"}\n**Local Code**: ${airportDataResponse.local_code || "N/A"}`,
                            inline: false,
                        },
                        {
                            name: `Links`,
                            value: `**Wikipedia**: ${airportDataResponse.wikipedia_link || "N/A"}\n**Home**: ${airportDataResponse.home_link || "N/A"}`,
                            inline: false,
                        }
                    )
                    .setColor(0x1e90ff)
                    .setFooter({ text: `Airport: ${airportDataResponse.name}` })
                    .setTimestamp();
                

                    await interaction.reply({embeds: [airportEmbed]});
                } else {
                    await interaction.reply("Looks like that specific Airport doesn't exist.. Or you just can't spell.");
                }
            } else {
                await interaction.reply("Airport data unfortunately unavailable.");
            }
        } catch (error) {
            console.error(error);
            await interaction.reply("An error occured.");
        }
    },
    cooldown: 4
};

export default storymodal;
