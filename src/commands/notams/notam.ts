import { ActionRowBuilder, AutocompleteInteraction, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { Command } from '../../types/Command';
import Papa from 'papaparse';
//@ts-ignore
import notamDecoder from '../../services/notams.services/notamdecoder.service';
import type { DecodedNotam } from '../../types/DecodedNotam';
import type { Notam, NotamList } from '../../types/Notam';
import getAirportsList from '../../commandServices/airport/getAirportsList';
import { getCountryNames } from '../../commandServices/country/getCountryName';
import type { StringChoice } from '../../types/StringChoice';

const notam: Command = {
	data: new SlashCommandBuilder()
		.setName('notam')
		.setDescription('Get the active and upcoming NOTAMs (Notice to Air Missions) for any airport')
		.addStringOption(option => option.setName("airport").setDescription("Choose Airport to view METAR info").setAutocomplete(true).setRequired(true)) as SlashCommandBuilder,
		


	async execute(interaction: CommandInteraction) { 

		const icaoValue = interaction.options.get('airport')?.value as string;

		const response = await fetch("https://notams.aim.faa.gov/notamSearch/search", {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'searchType=0' +
      `&designatorsForLocation=${icaoValue}` +
      '&designatorForAccountable=' +
      '&latDegrees=' +
      '&latMinutes=0' +
      '&latSeconds=0' +
      '&longDegrees=' +
      '&longMinutes=0' +
      '&longSeconds=0' +
      '&radius=10' +
      '&sortColumns=5+false' +
      '&sortDirection=true' +
      '&designatorForNotamNumberSearch=' +
      '&notamNumber=' +
      '&radiusSearchOnDesignator=false' +
      '&radiusSearchDesignator=' +
      '&latitudeDirection=N' +
      '&longitudeDirection=W' +
      '&freeFormText=' +
      '&flightPathText=' +
      '&flightPathDivertAirfields=' +
      '&flightPathBuffer=4' +
      '&flightPathIncludeNavaids=true' +
      '&flightPathIncludeArtcc=false' +
      '&flightPathIncludeTfr=true' +
      '&flightPathIncludeRegulatory=false' +
      '&flightPathResultsType=All+NOTAMs' +
      '&archiveDate=' +
      '&archiveDesignator=' +
      '&offset=0' +
      '&notamsOnly=false' +
      '&filters=' +
      '&minRunwayLength=' +
      '&minRunwayWidth=' +
      '&runwaySurfaceTypes=' +
      '&predefinedAbraka=' +
      '&predefinedDabra=' +
      '&flightPathAddlBuffer=' +
      '&recaptchaToken='

		});

		const responseText = await response.text();

		const notams:NotamList = JSON.parse(responseText);
		

        interaction.reply(notams.notamList[0].icaoMessage);
    


	},
	cooldown: 4,
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
                });
            }
        }

        const filtered = choices.filter(choice =>
            choice.searchValue.toLowerCase().includes(focusedOption.value.toLowerCase())
        ).slice(0,24);

        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value }))
        );

    }
};



export default notam;
