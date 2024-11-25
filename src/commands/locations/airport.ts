import { AutocompleteInteraction, CommandInteraction, SlashCommandBuilder } from 'discord.js';
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
    
        const icaoValue:any|string = interaction.options.get('icao')?.value;

     const airportData: AirportData[] = await getAirportsList();

      if (airportData.length > 0) {
         interaction.reply(airportData.filter(ad => ad.ident == icaoValue)[0].name);
     } else {
         interaction.reply("No airports found in the data.");
      }
            
    },
    cooldown: 4
};

export default storymodal;
