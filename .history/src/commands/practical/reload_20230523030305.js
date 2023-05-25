/*
 * @author: shane
 * @Date: 2023-05-23 02:37:22
 * @LastEditTime: 2023-05-23 03:03:05
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
        const directoryPath = path.join(__dirname, '..', '..', 'commands');

        fs.readdirSync(directoryPath).forEach(folderName => {
            const folderPath = path.join(directoryPath, folderName);

            if (!command) {
                return interaction.reply(`沒有名稱為 \`${commandName}\`的指令！`);
            }

            // 遍歷每個資料夾中的檔案
            fs.readdirSync(folderPath).forEach(fileName => {
                if (fileName.endsWith('.js')) {
                    const filePath = path.join(folderPath, fileName);
                    // 根據檔案路徑做相應操作
                    console.log(filePath);

                    // 如果需要讀取檔案內容，可以使用 fs.readFileSync(filePath, 'utf8') 來讀取
                    // const fileContent = fs.readFileSync(filePath, 'utf8');
                    // ...進一步處理檔案內容
                }
            });
        });
        delete require.cache[require.resolve(`./${command.data.name}.js`,)];

        try {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require(`./${command.data.name}.js`);
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

function findCommandFile(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 若是資料夾，遞迴搜尋
            findCommandFile(filePath);
        } else if (file === `${command.data.name}.js`) {
            // 找到符合條件的檔案
            // 在此處理你要進行的操作
            console.log('找到檔案:', filePath);
        }
    }
}