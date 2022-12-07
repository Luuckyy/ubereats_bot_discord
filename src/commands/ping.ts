import { SlashCommandBuilder,ChatInputCommandInteraction,Collection, AutocompleteInteraction } from 'discord.js';
import { Command } from '../Command';

const ping:Command = {
	data: async function() {return new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
	},
	async execute(interaction:ChatInputCommandInteraction | AutocompleteInteraction,commands:Collection<String,Command>) {
		if(interaction.isChatInputCommand())
		await interaction.reply({content:'Pong!'});
	},
};

module.exports = ping;