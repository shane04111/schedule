/*
 * @author: shane
 * @Date: 2023-05-19 06:59:59
 * @LastEditTime: 2023-05-22 04:50:28
 * @FilePath: \timepost\src\commands\practical\clear.js
 */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('刪除訊息')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const messagesToDelete = []; // 存储要删除的消息的集合

        // 将要删除的消息添加到 messagesToDelete 集合中

        // 确认 messagesToDelete 中的消息是否超过14天
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        interaction.channel.bulkDelete(100);
        interaction.reply({ content: '已刪除', ephemeral: true })
    },
};