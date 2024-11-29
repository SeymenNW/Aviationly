import { text } from 'drizzle-orm/pg-core';
import { ActionRowBuilder, AutocompleteInteraction, CommandInteraction, Embed, EmbedAssertions, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle, type EmbedData } from 'discord.js';
import type { Command } from '../../types/Command';
import getAirportsList from '../../commandServices/airport/getAirportsList';
import { getCountryNames } from '../../commandServices/country/getCountryName';
import type { StringChoice } from '../../types/StringChoice';

const bot: Command = {
	data: new SlashCommandBuilder()

    //Command
		.setName('bot')
		.setDescription('Information about Aviationly'),



        async execute(interaction: CommandInteraction) {
       
            const info:string[] = [];
            info.push("**Aviationly**");
            info.push("[**GitHub Repo (Open Source)**](https://github.com/SeymenNW/Aviationly)");
            info.push("");
            info.push("**What does it do?**");
            info.push("Shows detailed information about Airports,\nNOTAMs, METARs, TAFs and more.");
            info.push("[(Current Version: 1.0)](https://cdn.discordapp.com/attachments/1311778894482899085/1311817566934798427/0026a7c204190f5b5a0b6deb33415e0156c21e4f.mov?ex=674a3cd0&is=6748eb50&hm=4a3d5c7db70d7b570645d191bd6aff68c906a0c66869b1c73aa005cf5d1934fa&)");
        
            const string = info.join("\n")
            interaction.reply(string);
        }


        ,
	cooldown: 4
};



export default bot;
