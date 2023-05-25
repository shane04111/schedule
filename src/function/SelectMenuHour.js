/*
 * @author: shane
 * @Date: 2023-04-19 12:09:30
 * @LastEditTime: 2023-04-19 18:39:33
 * @FilePath: \timepost\src\function\SelectMenuHour.js
 */
const { StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const convertToChineseTime = require(`./convertToChineseTime`)

function SelectMenuHour(for_time_hour) {
    let options_hour = [];
    options_hour = [];

    for (for_time_hour; for_time_hour < 24; for_time_hour++) {
        let need_for = `${convertToChineseTime(for_time_hour)} `;
        let option = new StringSelectMenuOptionBuilder()
            .setLabel(`${need_for}`)
            .setDescription(`選擇${need_for}`)
            .setValue(`${for_time_hour}`);
        options_hour.push(option);
    }

    // 自動添加小時進入選單
    let select_Menu_hour_now = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('hour_selection')
                .setPlaceholder('請選擇幾點提醒')
                .addOptions(options_hour)
        );
    return select_Menu_hour_now;
}

module.exports = SelectMenuHour;