const { Events, Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (command) {
			try {
				if (interaction.isAutocomplete()) {
					await command.autocomplete(interaction);
				} else {
					await command.execute(interaction);
				}
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}

	},
};