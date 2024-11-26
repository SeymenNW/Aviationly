import { ActionRowBuilder, AutocompleteInteraction, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { Command } from '../../types/Command';
import getAirportsList from '../../commandServices/airport/getAirportsList';
import { getCountryNames } from '../../commandServices/country/getCountryName';
import type { StringChoice } from '../../types/StringChoice';

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
     if (presentationOptionValue === "fullMetar") {
        interaction.reply("Not implemented");

     } else {
        interaction.reply(metarResponseData);

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
                    name: `${airport.name} (${airport.ident}) (${airport.iso_country})`,
                    searchValue: `${airport.name} (${airport.ident}) (${airport.iso_country}) / ${countryName})`,
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
