/*
 * @author: shane
 * @Date: 2023-05-24 03:08:56
 * @LastEditTime: 2023-05-24 06:26:44
 * @FilePath: \timepost\src\unity\guildMemberRemove.js
 */
const { EmbedBuilder } = require('discord.js')
const { LeftChannel } = require('../config.json')

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const channel = member.guild.channels.cache.get(LeftChannel);
        const embed = new EmbedBuilder()
            .setColor("#ff8b33")
            .setAuthor({ name: `${member.user.tag}退出` })
            .setTimestamp()
            .setThumbnail(member.user.avatarURL())
        channel.send({
            // content: 'hi'
            embeds: [embed]
        })
    }
}