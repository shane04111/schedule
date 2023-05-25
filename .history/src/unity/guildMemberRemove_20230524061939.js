/*
 * @author: shane
 * @Date: 2023-05-24 03:08:56
 * @LastEditTime: 2023-05-24 06:19:39
 * @FilePath: \timepost\src\unity\guildMemberRemove.js
 */
const { EmbedBuilder } = require('discord.js')
const { leftChannel } = require('../config.json')

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const channel = member.guild.channels.cache.get(leftChannel);
        const embed = new EmbedBuilder()
            .setColor("#ff8b33")
            .setAuthor({ name: `<@${member.user.id}>退出` })
            .setTimestamp()
            .setThumbnail(member.user.avatarURL())
        channel.send({ embeds: [embed] })
    }
}