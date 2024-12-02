import { ActionRowBuilder, AutocompleteInteraction, CommandInteraction, Embed, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { Command } from '../../types/Command';
import getAirportsList from '../../commandServices/airport/getAirportsList';
import getCountry, { getCountryNames } from '../../commandServices/country/getCountryName';
import type { StringChoice } from '../../types/StringChoice';
import metarParser from 'aewx-metar-parser';
const metar: Command = {
	data: new SlashCommandBuilder()

    //Command
		.setName('metar')
		.setDescription('Shows the latest METAR (Meteorological Terminal Aviation Routine Weather Report) for any airport.')

    //airport option
        .addStringOption(option => option.setName("airport").setDescription("Choose Airport to view METAR info").setAutocomplete(true).setRequired(true))

    //presentation option (whether embed or RAW metar)
        .addStringOption(option => option.setName("presentation")
        .setDescription("Choose a presentation option")
        .addChoices(
            { name: "Full METAR Details", value: "fullMetar"},
            { name: "Raw METAR Code", value: "rawMetar"},
        ).setRequired(true)
    
        ) as SlashCommandBuilder,


	async execute(interaction: CommandInteraction) { 

     //   https://aviationweather.gov/data/api/#/
     const icaoValue = interaction.options.get('airport')?.value as string;
     const presentationOptionValue = interaction.options.get('presentation')?.value as string;

    const response = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icaoValue}&format=raw`);
     const metarResponseData = await response.text();


     if (metarResponseData) {
     if (presentationOptionValue === "rawMetar") {
        interaction.reply(metarResponseData);


     } else if (presentationOptionValue === "fullMetar") {
        const metarData =  metarParser(metarResponseData);

     
        const generalInfo = [];
        if (metarData.raw_text) generalInfo.push(`**Raw Text**: ${metarData.raw_text}`);
        if (metarData.flight_category) generalInfo.push(`**Flight Category**: ${metarData.flight_category}`);
        if (metarData.icao) generalInfo.push(`**ICAO**: ${metarData.icao}`);
        if (metarData.observed) generalInfo.push(`**Observed**: ${metarData.observed}`);
    
        const windInfo = [];
        if (metarData.wind) {
            windInfo.push(`**Degrees**: ${metarData.wind.degrees}`);
            windInfo.push(`**Speed (kts)**: ${metarData.wind.speed_kts}`);
            if (metarData.wind.gust_kts) windInfo.push(`**Gust (kts)**: ${metarData.wind.gust_kts}`);
            if (metarData.wind.degrees_from) windInfo.push(`**From**: ${metarData.wind.degrees_from}`);
            if (metarData.wind.degrees_to) windInfo.push(`**To**: ${metarData.wind.degrees_to}`);
        }
    
        const visibilityInfo = [];
        if (metarData.visibility) {
            visibilityInfo.push(`**Miles**: ${metarData.visibility.miles}`);
            visibilityInfo.push(`**Meters**: ${metarData.visibility.meters}`);
        }
    
        const temperatureInfo = [];
        if (metarData.temperature) {
            temperatureInfo.push(`**Celsius**: ${metarData.temperature.celsius}`);
            temperatureInfo.push(`**Fahrenheit**: ${metarData.temperature.fahrenheit}`);
        }
    
        const airportEmbed = new EmbedBuilder()
            .setTitle(`METAR Data for ${(await getAirportsList()).find(air => air.ident === metarData.icao)?.name}`)
            .setDescription(`Detailed METAR information for ${metarData.icao || "Unknown ICAO"}`)
            .addFields(
                {
                    name: `General Information`,
                    value: generalInfo.join('\n') || "No general information available.",
                    inline: false,
                },
                {
                    name: `Wind Information`,
                    value: windInfo.join('\n') || "No wind information available.",
                    inline: false,
                },
                {
                    name: `Visibility`,
                    value: visibilityInfo.join('\n') || "No visibility information available.",
                    inline: false,
                },
                {
                    name: `Temperature`,
                    value: temperatureInfo.join('\n') || "No temperature information available.",
                    inline: false,
                }
            )
            .setColor(0x1e90ff)
            .setFooter({ text: `METAR data provided by: Aviation Weather Center` })
            .setTimestamp();
    
        await interaction.reply({ embeds: [airportEmbed] });


     }
    } else {
        interaction.reply("No valid METARs found for this location.")
    }

    


	},
    async autoComplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices: StringChoice[] = [];

      const countryNames = await getCountryNames();

        
        if (focusedOption.name === 'airport') {
            
            for (const airport of await getAirportsList()) {

                const countryName = countryNames.find(cc=>cc.code == airport.iso_country)?.name;

                choices.push({
                    name: `${airport.ident}: ${airport.name}  (${airport.iso_country})`,
                    searchValue: `${airport.ident} ${airport.name} ${airport.iso_country}  ${countryName}`,
                    value: airport.ident
                })
            }
        }

        const filtered = choices.filter(choice =>
            choice.searchValue.toLowerCase().includes(focusedOption.value.toLowerCase())
        ).slice(0,24);

        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value }))
        );

    },
	cooldown: 4
};



export default metar;
