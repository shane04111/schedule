/*
 * @author: shane
 * @Date: 2023-05-19 06:59:59
 * @LastEditTime: 2023-05-25 08:29:28
 * @FilePath: \timepost\src\commands\practical\ping.js
 */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong'),
    async execute(interaction) {
        const clientLatency = interaction.client.ws.ping;
        const serverLatency = Date.now() - interaction.createdTimestamp;

        interaction.reply('pong!');
    },
};