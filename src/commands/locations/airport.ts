import { AutocompleteInteraction, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import Papa from 'papaparse';
import type { Command } from '../../types/Command';
import type { AirportData } from '../../types/AirportData';
import getAirportsList from '../../commandServices/airport/getAirportsList';
import getCountry, { getCountryNames } from '../../commandServices/country/getCountryName';
import type { Country } from '../../types/Country';
import type { StringChoice } from '../../types/StringChoice';



const airport: Command = {
    data: new SlashCommandBuilder()
        .setName('airport')
        .setDescription('Gets Airport information for the selected Airport')
         .addStringOption(option => option.setName(`search`)
        .setDescription(`Search for: Airport, Country or ICAO code.`)
        .setRequired(true)
        .setAutocomplete(true)
        ) as SlashCommandBuilder,

    async autoComplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices: StringChoice[] = [];

      const countryNames = await getCountryNames();

        
        if (focusedOption.name === 'search') {
            
            for (const airport of await getAirportsList()) {

                const countryName = countryNames.find(cc=>cc.code == airport.iso_country)?.name;

                choices.push({
                    name: `${airport.name} (${airport.ident}) (${airport.iso_country})`,
                    searchValue: `${airport.name} (${airport.ident}) (${airport.iso_country}) / ${countryName})`,
                    value: airport.ident
                });
            }
        }

        const filtered = choices.filter(choice =>
            choice.searchValue.toLowerCase().includes(focusedOption.value.toLowerCase())
        ).slice(0,24);

        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value }))
        );

    },


    async execute(interaction: CommandInteraction) {
        const icaoValue = interaction.options.get('search')?.value as string;
    
        try {
            const airportData: AirportData[] = await getAirportsList();
    
            if (airportData.length > 0) {
                const airportDataResponse = airportData.find(ad => ad.ident === icaoValue);
    
                if (airportDataResponse) {
                    const countryInfo:Country = await getCountry(airportDataResponse.iso_country);

                    const generalInfo: string[] = [];
                    if (airportDataResponse.id) generalInfo.push(`**ID**: ${airportDataResponse.id}`);
                    if (airportDataResponse.ident) generalInfo.push(`**Ident**: ${airportDataResponse.ident}`);
                    if (airportDataResponse.type) generalInfo.push(`**Type**: ${airportDataResponse.type}`);
                    if (airportDataResponse.iso_region) generalInfo.push(`**Region**: ${airportDataResponse.iso_region}`);
                    if (airportDataResponse.iso_country) generalInfo.push(`**Country**: ${countryInfo.name} (${airportDataResponse.iso_country})`);
    
                    const locationInfo: string[] = [];
                    if (airportDataResponse.latitude_deg) locationInfo.push(`**Latitude**: ${airportDataResponse.latitude_deg}`);
                    if (airportDataResponse.longitude_deg) locationInfo.push(`**Longitude**: ${airportDataResponse.longitude_deg}`);
                    if (airportDataResponse.elevation_ft) locationInfo.push(`**Elevation**: ${airportDataResponse.elevation_ft} ft`);
                    if (airportDataResponse.municipality) locationInfo.push(`**Location**: ${airportDataResponse.municipality}, ${countryInfo.name} `);
    
                    const codesInfo: string[] = [];
                    if (airportDataResponse.gps_code) codesInfo.push(`**GPS Code**: ${airportDataResponse.gps_code}`);
                    if (airportDataResponse.iata_code) codesInfo.push(`**IATA Code**: ${airportDataResponse.iata_code}`);
                    if (airportDataResponse.local_code) codesInfo.push(`**Local Code**: ${airportDataResponse.local_code}`);
    
                    const linksInfo: string[] = [];
                    if (airportDataResponse.wikipedia_link) linksInfo.push(`**Wikipedia**: ${airportDataResponse.wikipedia_link}`);
                    if (airportDataResponse.home_link) linksInfo.push(`**Home**: ${airportDataResponse.home_link}`);
    
                    const airportEmbed = new EmbedBuilder()
                        .setTitle(`Airport: ${airportDataResponse.name}`)
                        .setDescription(`Detailed information about ${airportDataResponse.name}, ${countryInfo.name}`)
                        .addFields(
                            {
                                name: `General Information`,
                                value: generalInfo.join('\n') || "No general information available.",
                                inline: false,
                            },
                            {
                                name: `Location`,
                                value: locationInfo.join('\n') || "No location information available.",
                                inline: false,
                            },
                            {
                                name: `Codes`,
                                value: codesInfo.join('\n') || "No codes available.",
                                inline: false,
                            },
                            {
                                name: `Links`,
                                value: linksInfo.join('\n') || "No links available.",
                                inline: false,
                            }
                        )
                        .setColor(0x1e90ff)
                        .setFooter({ text: `Airport: ${airportDataResponse.name}` })
                        .setTimestamp();
    
                    await interaction.reply({ embeds: [airportEmbed] });
                } else {
                    await interaction.reply("Looks like that specific Airport doesn't exist.. Or you just can't spell.");
                }
            } else {
                await interaction.reply("Airport data unfortunately unavailable.");
            }
        } catch (error) {
            console.error(error);
            await interaction.reply("An error occurred.");
        }
    }
    ,
    cooldown: 4
};

export default airport;
