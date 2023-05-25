/*
 * @author: shane
 * @Date: 2023-05-24 03:08:56
 * @LastEditTime: 2023-05-26 05:33:30
 * @FilePath: \timepost\src\unity\guildMemberRemove.js
 * just a test
 */
const CheckDebugMode = require(`../function/CheckDebugMode`)

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        CheckDebugMode(member.user);
    }
}