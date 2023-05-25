/*
 * @author: shane
 * @Date: 2023-05-23 02:37:22
 * @LastEditTime: 2023-05-23 02:42:10
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
                context: `There is no command with name \`${commandName}\`!`,
                ephemeral: true
            });
        }
        delete require.cache[require.resolve({
            context: `./${command.data.name}.js`,
            ephemeral: true
        })];

        try {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require({
                context: `./${command.data.name}.js`,
                ephemeral: true
            });
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({
                context: `Command \`${newCommand.data.name}\` was reloaded!`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                context: `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
                ephemeral: true
            });
        }
    },
};