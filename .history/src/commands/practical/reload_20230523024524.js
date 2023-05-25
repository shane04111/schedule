/*
 * @author: shane
 * @Date: 2023-05-23 02:37:22
 * @LastEditTime: 2023-05-23 02:45:23
 * @FilePath: \timepost\src\commands\practical\reload.js
 */
const { SlashCommandBuilder } = require('discord.js');

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

        if (!command) {
            return interaction.reply({
                context: `沒有名稱為 \`${commandName}\`的指令！`,
                ephemeral: true
            });
        }
        delete require.cache[require.resolve(
            context: `./${command.data.name}.js`,)];

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