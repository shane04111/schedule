const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    name: Event.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`找不到符合 ${interaction.commandName} 的指令。`);
            return;
        }

        try {
            if (interaction.isAutocomplete()) {
                await command.autocomplete(interaction);
            } else {
                await command.execute(interaction);
            }
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: '這個指令執行時發生了錯誤！', ephemeral: true });
                await client.users.send(notifyId, `/${interaction.commandName}執行時發生錯誤`)
            } else {
                await interaction.reply({ content: '這個指令執行時發生了錯誤！', ephemeral: true });
                await client.users.send(notifyId, `/${interaction.commandName} 執行時發生錯誤`)
            }
        }
    }
}