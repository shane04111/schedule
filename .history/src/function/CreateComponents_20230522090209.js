/*
 * @author: shane
 * @Date: 2023-05-22 08:59:10
 * @LastEditTime: 2023-05-22 09:02:08
 * @FilePath: \timepost\src\function\CreateComponents.js
 */
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
function createComponent() {
    const button_now_row = new ButtonBuilder()
        .setCustomId('button_now')
        .setStyle(ButtonStyle.Primary)
        .setLabel(`設定日期為今天 ${getCurrentTime('Year')}/${getCurrentTime('Month')}/${getCurrentTime('Day')}`);

    const button_year_row = new ButtonBuilder()
        .setCustomId('button_year')
        .setStyle(ButtonStyle.Primary)
        .setLabel(`自訂義月和日，年設定為${getCurrentTime('Year')}`);

    const button_year_and_month_row = new ButtonBuilder()
        .setCustomId('button_year_and_month')
        .setStyle(ButtonStyle.Primary)
        .setLabel(`自訂義日，年和月設定為${getCurrentTime('Year')}/${getCurrentTime('Month')}`);

    const button_nothing_row = new ButtonBuilder()
        .setCustomId('button_nothing')
        .setStyle(ButtonStyle.Primary)
        .setLabel('自訂義日期');

    const back_Button_nowadays = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('Back_Button')
                .setStyle(ButtonStyle.Danger)
                .setLabel('回到上一頁')
        );

    // 選擇是否選取該年份
    const true_button_select_year_user = new ButtonBuilder()
        .setCustomId('true_button_select_year')
        .setStyle(ButtonStyle.Success)
        .setLabel('確認選取');
    const false_button_select_year_user = new ButtonBuilder()
        .setCustomId('false_button_select_year')
        .setStyle(ButtonStyle.Danger)
        .setLabel('取消並回到上一頁');

    // 選擇是否選取該月份
    const true_button_select_month_user = new ButtonBuilder()
        .setCustomId('true_button_select_month')
        .setStyle(ButtonStyle.Success)
        .setLabel('確認選取');
    const false_button_select_month_user = new ButtonBuilder()
        .setCustomId('false_button_select_month')
        .setStyle(ButtonStyle.Danger)
        .setLabel('取消並回到上一頁');

    // 選擇是否選取該月份
    const true_button_select_day_user = new ButtonBuilder()
        .setCustomId('true_button_select_day')
        .setStyle(ButtonStyle.Success)
        .setLabel('確認選取');
    const false_button_select_day_user = new ButtonBuilder()
        .setCustomId('false_button_select_day')
        .setStyle(ButtonStyle.Danger)
        .setLabel('取消並回到上一頁');

    // 選擇是否選取該小時
    const true_button_select_hour_user = new ButtonBuilder()
        .setCustomId('true_button_select_hour')
        .setStyle(ButtonStyle.Success)
        .setLabel('確認選取');
    const false_button_select_hour_user = new ButtonBuilder()
        .setCustomId('false_button_select_hour')
        .setStyle(ButtonStyle.Danger)
        .setLabel('取消並回到上一頁');

    // 選擇是否選取該分鐘
    const true_button_select_minute_user = new ButtonBuilder()
        .setCustomId('true_button_select_minute')
        .setStyle(ButtonStyle.Success)
        .setLabel('確認選取');
    const false_button_select_minute_user = new ButtonBuilder()
        .setCustomId('false_button_select_minute')
        .setStyle(ButtonStyle.Danger)
        .setLabel('取消並回到上一頁');

    // 確認是要該時間點提醒
    const true_button_select_all_user = new ButtonBuilder()
        .setCustomId('true_button_select_all')
        .setStyle(ButtonStyle.Success)
        .setLabel('確認選取');
    const false_button_select_all_user = new ButtonBuilder()
        .setCustomId('false_button_select_all')
        .setStyle(ButtonStyle.Danger)
        .setLabel('取消並退出');

    const Day_time_up_button = new ButtonBuilder()
        .setCustomId('Day_time_up')
        .setStyle(ButtonStyle.Primary)
        .setLabel('上半月(15號及以前)')
    const Day_time_down_button = new ButtonBuilder()
        .setCustomId('Day_time_down')
        .setStyle(ButtonStyle.Primary)
        .setLabel('下半月(15號以後)')
    return {
        button_now_row
button_year_row
button_year_and_month_row
button_nothing_row
back_Button_nowadays
true_button_select_year_user
false_button_select_year_user
true_button_select_month_user
false_button_select_month_user
true_button_select_day_user
false_button_select_day_user
true_button_select_hour_user
false_button_select_hour_user
true_button_select_minute_user
false_button_select_minute_user
true_button_select_all_user
false_button_select_all_user
Day_time_up_button
Day_time_down_button
    }
}