/*
 * @author: shane
 * @Date: 2023-05-19 06:59:59
 * @LastEditTime: 2023-05-25 08:33:16
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
        console.log(interaction.createdTimestamp);

        interaction.reply({
            content: `客戶端延遲：${clientLatency}ms\n伺服器延遲：${serverLatency}ms`,
            ephemeral: true
        });

    },
};