import { SlashCommandBuilder,ChatInputCommandInteraction,Collection, AutocompleteInteraction } from 'discord.js';
import { MongoClient } from 'mongodb';
import { Command } from '../Command';
import { uri } from '../env.json';

const ping:Command = {
	data: async function() {return new SlashCommandBuilder()
		.setName('setchannel')
		.setDescription('Set channel where tweets will be posted')
        .addMentionableOption(option => option.setName("role").setDescription("Role that will be mentionned at every message (make sure role is mentionnable)"))
	},
	async execute(interaction:ChatInputCommandInteraction | AutocompleteInteraction,commands:Collection<String,Command>) {
		if(interaction.isChatInputCommand()){
            const channelId = interaction.channelId;
            const roleId = interaction.options.get("role",false)?.role?.id
            const guildId = interaction.guildId;
            const clientMongo = new MongoClient(uri);
            const database = clientMongo.db("ubereats_discord_bot");
            const guildInfo = database.collection("guildinfo");
            const filter = {guildId:guildId}
            const query = roleId ? { $set:{ channelId:channelId, roleId:roleId } } : { $set:{ channelId:channelId } };
            const response = await guildInfo.updateOne(filter,query);
            let text = response.acknowledged ? "✅" : "❌";
            await interaction.reply({content:`${text}`});
            await clientMongo.close();
        }
	},
};

module.exports = ping;