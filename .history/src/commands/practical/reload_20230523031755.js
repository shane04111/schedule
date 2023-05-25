/*
 * @author: shane
 * @Date: 2023-05-23 02:37:22
 * @LastEditTime: 2023-05-23 03:17:55
 * @FilePath: \timepost\src\commands\practical\reload.js
 */
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        delete require.cache[require.resolve(findCommandFile(`${command.data.name}.js`, path.join(__dirname, '..', '..', 'commands')))];

        try {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require(findCommandFile(`${command.data.name}.js`, path.join(__dirname, '..', '..', 'commands')));
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({
                context: `指令 \`${newCommand.data.name}\`已經重載成功！`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                context: `重新載入指令時發生錯誤 \`${command.data.name}\`:\n\`${error.message}\``,
                ephemeral: true
            });
        }
    },
};

// function findCommandFile(commands_name) {
//     const directory = path.join(__dirname, '..', '..', 'commands');
//     const files = fs.readdirSync(directory);

//     for (const file of files) {
//         const filePath = path.join(directory, file);
//         const stat = fs.statSync(filePath);

//         if (stat.isDirectory()) {
//             const foundFile = findCommandFile(commands_name, filePath);
//             if (foundFile) {
//                 return foundFile;
//             }
//             findCommandFile(filePath);
//         } else if (file === commands_name) {
//             console.log('找到檔案:', filePath);
//             return filePath;
//         }
//         return null;
//     }
// }
function findCommandFile(commands_name, directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const foundFile = findCommandFile(commands_name, filePath);
            if (foundFile) {
                return foundFile;
            }
        } else if (file === commands_name) {
            console.log('找到檔案:', filePath);
            return filePath;
        }
    }

    return null;
}