/*
 * @author: shane
 * @Date: 2023-05-23 02:37:22
 * @LastEditTime: 2023-05-23 21:16:56
 * @FilePath: \timepost\src\commands\practical\reload.js
 */
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const wait = require('node:timers/promises').setTimeout;
const CheckDebugMode = require('../../function/CheckDebugMode');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('重新載入指令。')
        .addStringOption(option =>
            option.setName('指令')
                .setDescription('選擇要重新載入的指令。')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction) {
        const commandsPath = path.join(__dirname, '..', '..', 'commands');
        const focusedValue = interaction.options.getFocused();
        const choices = [];
        fs.readdir(commandsPath, (err, folders) => {
            if (err) {
                console.error('無法讀取資料夾:', err);
                return;
            }
            folders.forEach(folder => {
                const folderPath = path.join(commandsPath, folder);
                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        console.error(`無法讀取資料夾 ${folder}:`, err);
                        return;
                    }
                    const jsFiles = files.filter(file => file.endsWith('.js'));
                    jsFiles.forEach(file => {
                        const fileName = path.parse(file).name;
                        if (fileName !== 'reload') {
                            choices.push(fileName);
                        }
                        CheckDebugMode(choices);
                    });
                });
            });
        });
        await wait(100);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
        filtered.map(choice => CheckDebugMode(choice));
    },
    async execute(interaction) {
        const commandName = interaction.options.getString('指令', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        delete require.cache[require.resolve(findCommandFile(`${command.data.name}.js`, path.join(__dirname, '..', '..', 'commands')))];

        try {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require(findCommandFile(`${command.data.name}.js`, path.join(__dirname, '..', '..', 'commands')));
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({
                content: `指令 \`${newCommand.data.name}\`已經重載成功！`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `重新載入指令時發生錯誤 \`${command.data.name}\`:\n\`${error.message}\``,
                ephemeral: true
            });
        }
    },
};

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
            CheckDebugMode('找到檔案:', filePath);
            return filePath;
        }
    }

    return null;
}