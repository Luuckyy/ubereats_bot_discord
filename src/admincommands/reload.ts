import { SlashCommandBuilder,ChatInputCommandInteraction,Collection } from 'discord.js';
import { Command } from '../Command';
import { spawn } from "node:child_process";
import fs from 'node:fs';
import path from 'node:path';

const reload:Command = {
	data: async function (){ return new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads commands : Admin only')
    },
	async execute(interaction:ChatInputCommandInteraction,commands:Collection<String,Command>) {
        if(interaction.user.id == "168495998652514304"){
            spawn(`npm run commands`,{ stdio:"inherit", shell:true});
            const commandsPath = path.join(__dirname+"/../", 'commands');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                // Set a new item in the Collection
                // With the key as the command name and the value as the exported module
                commands.set(command.data.name, command);
            }

            const commandsPathAdmin = path.join(__dirname+"/../", 'admincommands');
            const commandFilesAdmin = fs.readdirSync(commandsPathAdmin).filter(file => file.endsWith('.js'));
            
            for (const file of commandFilesAdmin) {
                const filePathAdmin = path.join(commandsPathAdmin, file);
                const commandAdmin = require(filePathAdmin);
                // Set a new item in the Collection
                // With the key as the command name and the value as the exported module
                commands.set(commandAdmin.data.name, commandAdmin);
            }
            await interaction.reply({content:"Reloaded ✅"});
        } else {
            await interaction.reply({content:interaction.user.id});
        }
	},
};

module.exports = reload;