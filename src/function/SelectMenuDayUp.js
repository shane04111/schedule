/*
 * @author: shane
 * @Date: 2023-04-19 12:57:32
 * @LastEditTime: 2023-05-19 00:15:55
 * @FilePath: \timepost\src\function\SelectMenuDayUp.js
 */
const { StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const CheckDebugMode = require('./CheckDebugMode.js');
function SelectMenuDayUp(for_time_day) {
    let options_day = [];
    options_day = [];
    let Select_Menu_Day_Up;
    if (parseInt(for_time_day) !== 1 && parseInt(for_time_day) <= 15) {
        for (for_time_day; for_time_day <= 15; for_time_day++) {
            let option = new StringSelectMenuOptionBuilder()
                .setLabel(`${for_time_day}號`)
                .setDescription(`選擇${for_time_day}號`)
                .setValue(`${for_time_day}`);
            options_day.push(option);
            CheckDebugMode(for_time_day, 'UP')
        }

        // 自動添加月份進入選單
        Select_Menu_Day_Up = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('day_selection')
                    .setPlaceholder('請選擇幾點提醒')
                    .addOptions(options_day)
            );
    } else if (parseInt(for_time_day) === 1) {
        for (for_time_day = 1; for_time_day <= 15; for_time_day++) {
            let option = new StringSelectMenuOptionBuilder()
                .setLabel(`${for_time_day}號`)
                .setDescription(`選擇${for_time_day}號`)
                .setValue(`${for_time_day}`);
            options_day.push(option);
            CheckDebugMode(for_time_day, 'UP')
        }

        // 自動添加月份進入選單
        Select_Menu_Day_Up = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('day_selection')
                    .setPlaceholder('請選擇幾點提醒')
                    .addOptions(options_day)
            );
    } else if (parseInt(for_time_day) > 15) {
        return 'NA';
    } else {
        return 'Error';
    }
    return Select_Menu_Day_Up;
}

module.exports = SelectMenuDayUp;