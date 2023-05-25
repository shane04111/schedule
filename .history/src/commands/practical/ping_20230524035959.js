/*
 * @author: shane
 * @Date: 2023-05-19 06:59:59
 * @LastEditTime: 2023-05-24 03:59:59
 * @FilePath: \timepost\src\commands\practical\ping.js
 */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('刪除訊息'),
    async execute(interaction) {
        interaction.reply('pong!');
    },
};