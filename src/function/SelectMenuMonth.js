/*
 * @author: shane
 * @Date: 2023-04-19 12:09:30
 * @LastEditTime: 2023-04-19 21:59:10
 * @FilePath: \timepost\src\function\SelectMenuMonth.js
 */
const { StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

function SelectMenuMonth(for_time_month) {
    let options_month = [];
    options_month = [];
    for (for_time_month; for_time_month < 13; for_time_month++) {
        let option = new StringSelectMenuOptionBuilder()
            .setLabel(`${for_time_month}月`)
            .setDescription(`選擇${for_time_month}月`)
            .setValue(`${for_time_month}`);
        options_month.push(option);
    }

    // 自動添加月份進入選單
    let Select_Menu_Month = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('month_selection')
                .setPlaceholder('請選擇幾月提醒')
                .addOptions(options_month)
        );
    return Select_Menu_Month;
}

module.exports = SelectMenuMonth;