import { SlashCommandBuilder,ChatInputCommandInteraction,Collection, AutocompleteInteraction } from 'discord.js';
import { Command } from '../Command';
import { spawnSync } from "node:child_process";
import fs from 'node:fs';
import path from 'node:path';

const reload:Command = {
	data: async function (){ return new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads commands : Admin only')
    },
	async execute(interaction:ChatInputCommandInteraction | AutocompleteInteraction,commands:Collection<String,Command>) {
        if(interaction.isChatInputCommand()){
            if(interaction.user.id == "168495998652514304"){
                const interResponse = await interaction.reply({content:"Reloading 🔃",fetchReply: true});
                const child = spawnSync(`npm run commands`,{ stdio:"inherit", shell:true});
                commands.clear();

                const commandsPath = path.join(__dirname+"/../", 'commands');
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                for await(const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    delete require.cache[require.resolve(filePath)]
                    const command:Command = await require(filePath);
                    const d = await command.data();
                    // Set a new item in the Collection
                    // With the key as the command name and the value as the exported module
                    commands.set(d.name, command);
                }

                const commandsPathAdmin = path.join(__dirname+"/../", 'admincommands');
                const commandFilesAdmin = fs.readdirSync(commandsPathAdmin).filter(file => file.endsWith('.js'));
                
                for await(const file of commandFilesAdmin) {
                    const filePathAdmin = path.join(commandsPathAdmin, file);
                    delete require.cache[require.resolve(filePathAdmin)]
                    const commandAdmin:Command = await require(filePathAdmin);
                    const d = await commandAdmin.data();
                    // Set a new item in the Collection
                    // With the key as the command name and the value as the exported module
                    commands.set(d.name, commandAdmin);
                }
                await interResponse.edit({content:"Reloaded ✅"});
            } else {
                await interaction.reply({content:interaction.user.id});
            }
        }
	},
};

module.exports = reload;