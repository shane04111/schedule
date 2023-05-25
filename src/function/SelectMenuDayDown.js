/*
 * @author: shane
 * @Date: 2023-04-19 12:33:33
 * @LastEditTime: 2023-05-19 00:16:00
 * @FilePath: \timepost\src\function\SelectMenuDayDown.js
 */
const { StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const CheckDebugMode = require('./CheckDebugMode.js');
function SelectMenuDayDown(for_time_day, for_time_day_get_data) {
    let options_day = [];
    options_day = [];
    let Select_Menu_Day_down;
    if (parseInt(for_time_day) > 15) {
        for (for_time_day; for_time_day <= for_time_day_get_data; for_time_day++) {
            let option = new StringSelectMenuOptionBuilder()
                .setLabel(`${for_time_day}號`)
                .setDescription(`選擇${for_time_day}號`)
                .setValue(`${for_time_day}`);
            options_day.push(option);
            CheckDebugMode(for_time_day, 'DOWN');
        }

        // 自動添加月份進入選單
        Select_Menu_Day_down = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('day_selection')
                    .setPlaceholder('請選擇幾號提醒')
                    .addOptions(options_day)
            );
    } else if (parseInt(for_time_day) <= 15) {
        for (for_time_day = 16; for_time_day <= for_time_day_get_data; for_time_day++) {
            let option = new StringSelectMenuOptionBuilder()
                .setLabel(`${for_time_day}號`)
                .setDescription(`選擇${for_time_day}號`)
                .setValue(`${for_time_day}`);
            options_day.push(option);
            CheckDebugMode(for_time_day, 'DOWN');
        }

        // 自動添加月份進入選單
        Select_Menu_Day_down = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('day_selection')
                    .setPlaceholder('請選擇幾號提醒')
                    .addOptions(options_day)
            );
    } else {
        return 'Error';
    }
    return Select_Menu_Day_down;
}

module.exports = SelectMenuDayDown;