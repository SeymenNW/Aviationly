import type { AutocompleteInteraction, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ChatInputCommandInteraction } from 'discord.js';

export type Command = {
    data: SlashCommandBuilder;
    autoComplete?(interaction: AutocompleteInteraction): Promise<void>;
    execute(interaction: CommandInteraction): Promise<void>;
    cooldown?: number
  };