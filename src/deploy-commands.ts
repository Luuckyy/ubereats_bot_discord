import  { REST, Routes,RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { MongoClient } from "mongodb";
import path from 'node:path';
import fs from 'node:fs';
import { Command } from './Command';
import { uri } from "./env.json";

const clientMongo = new MongoClient(uri);
async function run() {
  try {
    const database = clientMongo.db('ubereats_discord_bot');
    const env_var = database.collection('env');
    const discord_token = await env_var.findOne({field: 'DISCORD_TOKEN' });
    const clientId = await env_var.findOne({field: 'CLIENT_ID' });
    const guildId = await env_var.findOne({field: 'GUILD_ID' });

    const commands:RESTPostAPIApplicationCommandsJSONBody[] = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for await(const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command:Command = await require(filePath);
        const d = await command.data();
        console.log(d.name);
        commands.push(d.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(discord_token?.value);

    //Delete every command
    await rest.put(Routes.applicationGuildCommands(clientId?.value, guildId?.value), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);

    // for global commands
    await rest.put(Routes.applicationCommands(clientId?.value), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);


    await rest.put(Routes.applicationCommands(clientId?.value), { body: commands })
        .then((data:any) => console.log(`Successfully registered ${data.length} application commands.`))
        .catch(console.error);

    /*
    Register commands only for special servers
    */
    const commandsAdmin:RESTPostAPIApplicationCommandsJSONBody[] = [];
    const commandsPathAdmin = path.join(__dirname, 'admincommands');
    const commandFilesAdmin = fs.readdirSync(commandsPathAdmin).filter(file => file.endsWith('.js'));
    for (const file of commandFilesAdmin) {
        const filePath = path.join(commandsPathAdmin, file);
        const commandAdmin:Command = await require(filePath);
        const d = await commandAdmin.data();
        commandsAdmin.push(d.toJSON());
    }
    await rest.put(Routes.applicationGuildCommands(clientId?.value,guildId?.value), { body: commandsAdmin })
        .then((data:any) => console.log(`Successfully registered ${data.length} application commands.`))
        .catch(console.error);
    
  } catch {
    // Ensures that the client will close when you finish/error
    await clientMongo.close();
    console.error
  }
  await clientMongo.close();
}
run().catch(console.dir);