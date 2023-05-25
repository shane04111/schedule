/*
 * @author: shane
 * @Date: 2023-05-23 03:41:19
 * @LastEditTime: 2023-05-23 03:49:38
 * @FilePath: \timepost\src\commands\chectGPT\chectgpt.js
 */
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders')
const { chatgptapi } = require('../../config.json');
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
    apiKey: chatgptapi
})

const openai = new OpenAIApi(configuration)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('chatgpt command')
        .addStringOption(options => options
            .setName('question')
            .setDescription('想問的問題')
            .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const question = interaction.options.getString('question');

        try {
            const res = await openai.createCompletion({
                model: 'text-davinci-003',
                max_tokens: 2048,
                temperature: 0.5,
                prompt: question + "\n\n#zh_tw"
            })

            const embed = new EmbedBuilder()
                .setDescription(`${res.data.choices[0].text}`)
                .setTimestamp()

            await interaction.editReply({ embeds: [embed] })

        } catch (error) {
            console.log(error)
            return await interaction.editReply({ content: `出現錯誤${error}`, ephemeral: true })
        }
    },
};