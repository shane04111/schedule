const wait = require('node:timers/promises').setTimeout;
const { Client, GatewayIntentBits } = require(`discord.js`)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});
/*
 * @author: shane
 * @Date: 2023-05-24 05:07:17
 * @LastEditTime: 2023-05-24 05:12:38
 * @FilePath: \timepost\src\unity\Button_interaction.js
 */
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId === 'shutdown') {
            // 回復訊息說機器人在關閉中
            interaction.reply({ content: '正在關閉機器人...' });
            // 在終端機中顯示正在關閉
            console.log('Stopping bot...');
            // 等0.5秒後關閉機器人
            await wait(500);
            // 關閉機器人
            await client.destroy();
            process.exit();
        }
    }
}