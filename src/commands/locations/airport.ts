import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import Papa from 'papaparse';
import type { Command } from '../../types/Command';
import type { AirportData } from '../../types/AirportData';
import getAirportsList from '../../commandServices/airport/getAirportsList';

const storymodal: Command = {
    data: new SlashCommandBuilder()
        .setName('airport')
        .setDescription('Gets Airport information for the selected Airport'),

    async execute(interaction: CommandInteraction) {
        
     const airportData: AirportData[] = await getAirportsList();

      if (airportData.length > 0) {
         interaction.reply(airportData.filter(ad => ad.ident == "SBSL")[0].name);
     } else {
         interaction.reply("No airports found in the data.");
      }
            
    },
    cooldown: 4
};

export default storymodal;
