const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('刪除訊息')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        interaction.channel.bulkDelete(100);
        interaction.reply({ content: '已刪除', ephemeral: true })
    },
};