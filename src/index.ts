import { MongoClient } from "mongodb";
import { Client,GatewayIntentBits,Collection } from "discord.js";
import { Command } from "./Command";
import fs from 'node:fs';
import path from 'node:path';

const uri =
  "mongodb+srv://admub:<password>@cluster0.3o6cn.mongodb.net/?retryWrites=true&w=majority";
const clientMongo = new MongoClient(uri);
const commands:Collection<String,Command> = new Collection();
async function run() {
  try {
    const database = clientMongo.db('discord_bot');
    const env_var = database.collection('env');
    // Query for a movie that has the title 'Back to the Future'
    const query = { field: 'DISCORD_TOKEN' };
    const discord_token = await env_var.findOne(query);
    console.log(discord_token?.value);
    const clientDiscord = new Client({
        intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildEmojisAndStickers]
    });
    await clientDiscord.login(discord_token?.value);

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await require(filePath);
        const d = await command.data();
        // Set a new item in the Collection
        // With the key as the command name and the value as the exported module
        commands.set(d.name, command);
    }

    const commandsPathAdmin = path.join(__dirname, 'admincommands');
    const commandFilesAdmin = fs.readdirSync(commandsPathAdmin).filter(file => file.endsWith('.js'));
    
    for (const file of commandFilesAdmin) {
        const filePathAdmin = path.join(commandsPathAdmin, file);
        const commandAdmin = await require(filePathAdmin);
        const d = await commandAdmin.data();
        // Set a new item in the Collection
        // With the key as the command name and the value as the exported module
        commands.set(d.name, commandAdmin);
    }

    clientDiscord.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const command = commands.get(interaction.commandName);
    
        if (!command) return;
    
        try {
            await command.execute(interaction,commands);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });
  } catch {
    // Ensures that the client will close when you finish/error
    await clientMongo.close();
  }
}
run().catch(console.dir);