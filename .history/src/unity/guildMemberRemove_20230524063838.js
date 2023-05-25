/*
 * @author: shane
 * @Date: 2023-05-24 03:08:56
 * @LastEditTime: 2023-05-24 06:38:38
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
            .setAuthor({ name: `退出伺服器通知` })
            .setDescription(`${member.user.tag}退出了伺服器`)
            .setTimestamp()
            .setThumbnail(member.user.avatarURL())
        channel.send({
            // content: `<@${member.user.id}>已退出伺服器`,
            embeds: [embed]
        })
    }
}