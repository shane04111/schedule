/*
 * @author: shane
 * @Date: 2023-04-19 12:09:30
 * @LastEditTime: 2023-04-19 17:07:17
 * @FilePath: \timepost\src\function\selectMenuMinute.js
 */
const { StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
function SelectMenuMinute(for_time_minute) {
    let options_minute = [];
    options_minute = [];

    for (for_time_minute; for_time_minute < 60; for_time_minute += 5) {
        if (for_time_minute === 0) {
            let option_minute = new StringSelectMenuOptionBuilder()
                .setLabel(`整點`)
                .setDescription(`選擇整點時提醒`)
                .setValue(`${for_time_minute}`);
            options_minute.push(option_minute);
        } else if (for_time_minute === 5) {
            let option_minute = new StringSelectMenuOptionBuilder()
                .setLabel(`05分`)
                .setDescription(`選擇05分提醒`)
                .setValue(`${for_time_minute}`);
            options_minute.push(option_minute);
        } else {
            let option_minute = new StringSelectMenuOptionBuilder()
                .setLabel(`${for_time_minute}分`)
                .setDescription(`選擇${for_time_minute}分提醒`)
                .setValue(`${for_time_minute}`);
            options_minute.push(option_minute);
        }

    }
    let select_menu_minute = new ActionRowBuilder()
        .addComponents(new StringSelectMenuBuilder()
            .setCustomId('minute_selection')
            .setPlaceholder('請選擇幾分提醒')
            .addOptions(options_minute))
    return select_menu_minute;
}

module.exports = SelectMenuMinute;