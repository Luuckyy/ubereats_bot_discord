import { SlashCommandBuilder,ChatInputCommandInteraction,Collection, AutocompleteInteraction, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface Command {
    data: () => Promise<Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder>,
    execute: (interaction:(ChatInputCommandInteraction | AutocompleteInteraction),commands:Collection<String,Command>) => Promise<void>
}