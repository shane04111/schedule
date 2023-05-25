/*
 * @author: shane
 * @Date: 2023-05-19 06:59:59
 * @LastEditTime: 2023-05-22 05:01:42
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
        const messagesToDeleteWithin14Days = messagesToDelete.filter(msg => msg.createdAt > fourteenDaysAgo);
        console.log(messagesToDeleteWithin14Days);

        // 批量删除14天内的消息
        // if (messagesToDeleteWithin14Days.length > 0) {
        //     const channel = interaction.channel; // 替换为您的消息所在的频道
        //     channel.bulkDelete(messagesToDeleteWithin14Days)
        //         .then(deletedMessages => {
        //             const deletedMessageIds = deletedMessages.map(msg => msg.id);
        //             console.log('成功删除的消息的 ID:', deletedMessageIds);
        //         })
        //         .catch(error => {
        //             // 处理删除消息的错误
        //         });
        // }
    },
};