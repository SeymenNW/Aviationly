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
import { getNotamsByIcao } from '../../commandServices/notam/getNotams';

const notam: Command = {
	data: new SlashCommandBuilder()
		.setName('notam')
		.setDescription('Get the active and upcoming NOTAMs (Notice to Air Missions) for any airport')
		.addStringOption(option => option.setName("airport").setDescription("Choose Airport to view METAR info").setAutocomplete(true).setRequired(true)) as SlashCommandBuilder,
		


	async execute(interaction: CommandInteraction) { 

		const icaoValue:string = interaction.options.get('airport')?.value as string;

	
        const notams:NotamList = await getNotamsByIcao(icaoValue)

        const chosenNotam:Notam = notams.notamList[0];

        const status: string[] = [];
        const statusTitle:string = `Status (${chosenNotam.status === "Active" ? "Active ✅" : "NOT Active ❌"})`
        if (chosenNotam.issueDate) status.push(`**Issue Date:** ${chosenNotam.issueDate}`)
        if (chosenNotam.startDate) status.push(`**Start Date:** ${chosenNotam.startDate}`)
        if (chosenNotam.endDate) status.push(chosenNotam.endDate === "PERM" ? `**End Date**: PERMANENT ♾️` : `**End Date**: ${chosenNotam.endDate}`)
         

        const generalInfo: string[] = [];
        if (chosenNotam.notamNumber && chosenNotam.featureName) generalInfo.push(`**Notam**: ${chosenNotam.notamNumber} (${chosenNotam.featureName})`);
        if (chosenNotam.source) generalInfo.push(`**Source**: ${chosenNotam.source} (Type: ${chosenNotam.sourceType})`)

        const  conditionTitle:string = "Condition";
        let condition:string = "Condition Message";
        if(chosenNotam.traditionalMessageFrom4thWord) condition = `\n\`\`\`\n${chosenNotam.traditionalMessageFrom4thWord}\n\`\`\``;

        const  icaoMessageTitle:string = "ICAO Message (Notam Text)";
        let icaoMessage:string = "ICAO Message";
        if(chosenNotam.icaoMessage) icaoMessage = `\n\`\`\`\n${chosenNotam.icaoMessage}\n\`\`\``;

   
        


        const notamEmbed = new EmbedBuilder()
        .setTitle(`NOTAM #: ${chosenNotam.notamNumber} (${chosenNotam.facilityDesignator})`)
        .setDescription(`Detailed information about NOTAM '${chosenNotam.notamNumber}' 
            located in ${chosenNotam.airportName}`)
            .setFields().addFields(
                {
                    name: statusTitle,
                    value: status.join("\n")
                },
                {
                name: "General Information",
                value: generalInfo.join("\n")
                },
                {
                    name: conditionTitle,
                    value: condition
                },
                {
                    name: icaoMessageTitle,
                    value: icaoMessage
               } 
        ).setFooter({
            text: "Tip: Copy the ICAO Message and use '/notamdecoder' for more info! "
        })

            
       
		

        interaction.reply({embeds: [notamEmbed]});
    


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
