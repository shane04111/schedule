/*
 * @author: shane
 * @Date: 2023-04-13 14:17:15
 * @LastEditTime: 2023-05-25 07:40:11
 * @FilePath: \timepost\src\deploy-commands.js
 */

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const guild_commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            if (command.GuildCommands === true) {
                commands.push(command.data.toJSON());
            }
        } else {
            console.log(`\x1B[31m[警告] 位於 \x1B[33m${filePath} \x1B[31m的指令缺少必要的 "data" 或 "execute" 屬性。\x1B[0m`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// 部屬指令
(async () => {
    try {
        console.log(`正在刷新 ${commands.length} 個應用程式 (/) 指令`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log(`成功重新載入 ${data.length} 個應用程式 (/) 命令。`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();