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
        const icaoValue = interaction.options.get('icao')?.value as string;
    
        try {
            const airportData: AirportData[] = await getAirportsList();
    
            if (airportData.length > 0) {
                const airportDataResponse = airportData.find(ad => ad.ident === icaoValue);
    
                if (airportDataResponse) {
                    await interaction.reply(airportDataResponse.name);
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
