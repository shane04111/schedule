/*
 * @author: shane
 * @Date: 2023-04-14 09:16:54
 * @LastEditTime: 2023-05-21 18:09:50
 * @FilePath: \timepost\src\commands\schedule\schedule.js
 */

const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType, } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const convertToChineseTime = require(`../../function/convertToChineseTime.js`);
const getCurrentTime = require(`../../function/getCurrentTime.js`);
const MonthToDay = require(`../../function/MonthDay.js`);
const SelectMenuMonth = require(`../../function/SelectMenuMonth.js`);
const SelectMenuDayUp = require(`../../function/SelectMenuDayUp.js`);
const SelectMenuDayDown = require(`../../function/SelectMenuDayDown.js`);
const SelectMenuHour = require(`../../function/SelectMenuHour.js`);
const SelectMenuMinute = require(`../../function/selectMenuMinute.js`);
const CheckDebugMode = require(`../../function/CheckDebugMode.js`);
const path = require('path');
const fs = require('fs');
const { DebugMode } = require(`../../config.json`)

let user_select_year, user_select_month, user_select_day;
let user_select_hour, user_select_minute;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('設定排程時間')
        .addStringOption(option =>
            option
                .setName('日程')
                .setDescription('設定提醒事項。')
                .setRequired(true))
        .addBooleanOption(option =>
            option
                .setName('tag')
                .setDescription('選擇在頻道中是否tag你。')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('頻道')
                .setDescription('如果填寫了頻道，就會在該頻道發布提醒訊息，否則就在輸入指令的頻道中發布。')
                // 確保只能輸出文字頻道
                .addChannelTypes(ChannelType.GuildText)),
    async execute(interaction) {
        CheckDebugMode(`${getCurrentTime('Year')}/${getCurrentTime('Month')}/${getCurrentTime('Day')}`);
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

        // 開頭四種日期選取合併為同一行
        const Button_row = new ActionRowBuilder()
            .addComponents(
                button_now_row,
                button_year_and_month_row,
                button_year_row,
                button_nothing_row
            );

        // 年份選取合併
        const true_false_in_one_row_year = new ActionRowBuilder()
            .addComponents(
                true_button_select_year_user,
                false_button_select_year_user
            );

        // 月份選取合併
        const true_false_in_one_row_month = new ActionRowBuilder()
            .addComponents(
                true_button_select_month_user,
                false_button_select_month_user
            );

        // 日期選取合併
        const true_false_in_one_row_day = new ActionRowBuilder()
            .addComponents(
                true_button_select_day_user,
                false_button_select_day_user
            );

        // 小時選取合併
        const true_false_in_one_row_hour = new ActionRowBuilder()
            .addComponents(
                true_button_select_hour_user,
                false_button_select_hour_user
            );

        // 分鐘選取合併
        const true_false_in_one_row_minute = new ActionRowBuilder()
            .addComponents(
                true_button_select_minute_user,
                false_button_select_minute_user
            );

        // 時間點選取合併
        const true_false_in_one_row_all = new ActionRowBuilder()
            .addComponents(
                true_button_select_all_user,
                false_button_select_all_user
            );

        const Day_time_button = new ActionRowBuilder()
            .addComponents(
                Day_time_up_button,
                Day_time_down_button
            );

        const response = await interaction.reply({
            content: '請選擇提醒日期',
            components: [Button_row],
            ephemeral: true
        });

        let options_year = [];
        options_year = [];
        for (let for_time_year = getCurrentTime('Year'); for_time_year < getCurrentTime('Year') + 11; for_time_year++) {
            let option_year = new StringSelectMenuOptionBuilder()
                .setLabel(`${for_time_year}`)
                .setDescription(`選擇${for_time_year}`)
                .setValue(`${for_time_year}`)
            options_year.push(option_year);
        }

        let Select_Menu_year = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('year_selection')
                    .setPlaceholder('請選擇幾年提醒')
                    .addOptions(options_year)
            )

        // 自動添加小時
        const collector = await response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });
        const collector_select = await response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60_000 });
        let choices_per_year, choices_per_month, choices_per_day, choices_per_hour, choices_per_minute;
        let Select_Menu_Month, Select_Menu_Day_up, Select_Menu_Day_down, Select_Menu_Hour, Select_Menu_Minute;
        collector_select.on('collect', async i => {
            const selectID = i.customId;
            if (selectID === 'year_selection') {
                await i.values.forEach(async values => {
                    choices_per_year = values;
                });
                await i.update({ content: `是否選擇${choices_per_year}年`, components: [true_false_in_one_row_year], ephemeral: true });
            } else if (selectID === 'month_selection') {
                await i.values.forEach(async values => {
                    choices_per_month = values;
                });
                await i.update({ content: `是否選擇${choices_per_month}月`, components: [true_false_in_one_row_month], ephemeral: true });
            } else if (selectID === 'day_selection') {
                await i.values.forEach(async values => {
                    choices_per_day = values;
                });
                await i.update({ content: `是否選擇${choices_per_day}日`, components: [true_false_in_one_row_day], ephemeral: true })
            } else if (selectID === 'hour_selection') {
                await i.values.forEach(async values => {
                    choices_per_hour = values;
                });
                await i.update({
                    content: `確認要選擇${convertToChineseTime(parseInt(choices_per_hour))}提醒？`,
                    components: [true_false_in_one_row_hour],
                    ephemeral: true
                })
            } else if (selectID === 'minute_selection') {
                let choices_per_minute_sey;
                await i.values.forEach(async values => {
                    choices_per_minute = values;
                });
                if (parseInt(choices_per_minute) === 0) {
                    choices_per_minute_sey = '整點';
                } else {
                    const Select_padded_Minute_sey_only = choices_per_minute.toString().padStart(2, "0");
                    choices_per_minute_sey = `${Select_padded_Minute_sey_only}分`
                }
                await i.update({ content: `確認要選擇${choices_per_minute_sey}提醒？`, components: [true_false_in_one_row_minute], ephemeral: true })
            }
        })

        const schedule_say = interaction.options.getString('日程');
        const schedule_tag = interaction.options.getBoolean('tag');
        const schedule_channel = interaction.options.getChannel('頻道') ?? 'NA';
        let hasSelectedDayButton = false;
        collector.on('collect', async i => {
            const buttonId = i.customId;
            let for_time_minute, for_time_month, for_time_day, for_time_hour;
            switch (buttonId) {
                case 'button_nothing':
                    await i.update({ content: '請選擇提醒時間', components: [Select_Menu_year, back_Button_nowadays], ephemeral: true });
                    break;
                case 'button_year':
                    user_select_year = getCurrentTime('Year');
                    if (getCurrentTime('Year') == parseInt(user_select_year)) for_time_month = getCurrentTime('Month');
                    else for_time_month = 1;
                    // 自動添加月份進入選單
                    Select_Menu_Month = SelectMenuMonth(for_time_month);
                    await i.update({ content: '請選擇提醒時間', components: [Select_Menu_Month, back_Button_nowadays], ephemeral: true });
                    break;
                case 'button_year_and_month':
                    user_select_year = getCurrentTime('Year');
                    user_select_month = getCurrentTime('Month');
                    let for_time_day_get_data = MonthToDay(`${user_select_month}`, `${user_select_year}`);
                    if (getCurrentTime('Year') == user_select_year) {
                        if (getCurrentTime('Month') === user_select_month) {
                            for_time_day = getCurrentTime('Day');
                        }
                        else {
                            for_time_day = 1;
                        }
                    } else {
                        for_time_day = 1;
                    }
                    Select_Menu_Day_up = SelectMenuDayUp(for_time_day);
                    Select_Menu_Day_down = SelectMenuDayDown(for_time_day, for_time_day_get_data);
                    if (for_time_day <= 15) {
                        await i.update({ content: '請選擇要幾號提醒', components: [Day_time_button], ephemeral: true });
                    } else {
                        await i.update({ content: '請選擇要幾號提醒', components: [Select_Menu_Day_down], ephemeral: true });
                    }
                    break;
                case 'button_now':
                    user_select_year = getCurrentTime('Year');
                    user_select_month = getCurrentTime('Month');
                    user_select_day = getCurrentTime('Day');
                    if (parseInt(user_select_year) === getCurrentTime('Year') &&
                        parseInt(user_select_month) === getCurrentTime('Month') && parseInt(user_select_day) === getCurrentTime('Day')) {
                        if (getCurrentTime("Minute") >= 55) for_time_hour = getCurrentTime('Hour') + 1;
                        else for_time_hour = getCurrentTime('Hour');
                    }

                    Select_Menu_Hour = SelectMenuHour(for_time_hour);
                    await i.update({ content: '請選擇幾點提醒', components: [Select_Menu_Hour, back_Button_nowadays], ephemeral: true });
                    break;
                case 'Back_Button':
                    await i.update({ content: '請選擇提醒日期', components: [Button_row], ephemeral: true })
                    break;

                // 以下為確認小時按鈕-選分或回去重選時
                case 'true_button_select_hour':
                    user_select_hour = choices_per_hour;
                    if (parseInt(user_select_year) === getCurrentTime('Year') && parseInt(user_select_month) === getCurrentTime('Month') &&
                        parseInt(user_select_day) === getCurrentTime('Day') && parseInt(user_select_hour) === getCurrentTime("Hour") && getCurrentTime('Minute') < 55) {
                        for_time_minute = Math.floor((getCurrentTime('Minute') / 5 + 1)) * 5;
                    } else {
                        for_time_minute = 0;
                    }
                    Select_Menu_Minute = SelectMenuMinute(for_time_minute);
                    await i.update({ content: '請選擇要幾分提醒', components: [Select_Menu_Minute], ephemeral: true })
                    break;
                case 'false_button_select_hour':
                    await i.update({ content: '請選擇幾點提醒', components: [Select_Menu_Hour, back_Button_nowadays], ephemeral: true });
                    break;

                // 以下為確認分鐘按鈕按-問完整時間或重新填寫分鐘數
                case 'true_button_select_minute':
                    user_select_minute = choices_per_minute;
                    const paddedYear = user_select_year.toString().padStart(4, "0"); // 這樣 paddedYear 就會是 "2023"
                    const paddedMonth = user_select_month.toString().padStart(2, "0"); // 這樣 paddedMonth 就會是 "04"
                    const paddedDay = user_select_day.toString().padStart(2, "0"); // 這樣 paddedDay 就會是 "11"
                    const paddedHour = user_select_hour.toString().padStart(2, "0"); // 這樣 paddedHour 就會是 "09"
                    const paddedMinute = user_select_minute.toString().padStart(2, "0"); // 這樣 paddedMinute 就會是 "05"

                    await i.update({
                        content: `確定要將時間設為：${paddedYear}/${paddedMonth}/${paddedDay} ${paddedHour}:${paddedMinute}`,
                        components: [true_false_in_one_row_all],
                        ephemeral: true
                    });
                    break;
                case 'false_button_select_minute':
                    await i.update({ content: '請選擇要幾分提醒', components: [Select_Menu_Minute], ephemeral: true })
                    break;

                // 以下為完整時間確認按鈕-送出資料或直接退出
                case 'true_button_select_all':
                    hasSelectedDayButton = true;
                    await i.update({ content: `您已成功送出提醒訊息`, components: [], ephemeral: true });
                    // 檢查目標 JSON 檔案是否存在
                    const filePath = path.resolve(__dirname, 'schedule_date.json');
                    let data = {};
                    if (fs.existsSync(filePath)) {
                        // 讀取目標 JSON 檔案
                        const fileContent = fs.readFileSync(filePath, 'utf8');
                        data = JSON.parse(fileContent);
                    }

                    // 檢查是否有 "choices" 屬性，若無則創建一個空的陣列
                    if (!data.choices) {
                        data.choices = [];
                    }

                    // 創建新的使用者資料物件
                    const userData = {
                        choices_name: `${i.user.tag}`,
                        choices_name_id: `${i.user.id}`,

                        choices_channel: `${i.channel.id}`,

                        choices_schedule: `${schedule_say}`,
                        choices_tag: `${schedule_tag}`,
                        choices_channel_options_ID: `${schedule_channel.id}`,
                        choices_channel_options_Name: `${schedule_channel}`,

                        choices_year: `${user_select_year}`,
                        choices_month: `${user_select_month}`,
                        choices_day: `${user_select_day}`,

                        choices_hour: `${user_select_hour}`,
                        choices_minute: `${user_select_minute}`
                    };

                    CheckDebugMode(i.user.tag);
                    CheckDebugMode(schedule_channel);

                    // 將新的使用者資料物件添加到 "users" 陣列中
                    data.choices.push(userData);

                    // 將更新後的 JSON 物件寫入檔案
                    fs.writeFileSync(filePath, JSON.stringify(data));

                    await wait(5_000);
                    collector.stop();
                    break;
                case 'false_button_select_all':
                    collector.stop();
                    break;
                default:
                    if (buttonId === 'true_button_select_year') {
                        // 以下為確認年份按鈕-確認年或回去重填
                        user_select_year = choices_per_year;
                        if (getCurrentTime('Year') == parseInt(user_select_year)) for_time_month = getCurrentTime('Month');
                        else for_time_month = 1;
                        // 自動添加月份進入選單
                        Select_Menu_Month = SelectMenuMonth(for_time_month);
                        await i.update({ content: '請選擇要幾月提醒', components: [Select_Menu_Month], ephemeral: true });
                        CheckDebugMode(user_select_year);
                    } else if (buttonId === 'false_button_select_year') {

                        await i.update({ content: '請選擇幾年提醒', components: [Select_Menu_year], ephemeral: true });
                    } else if (buttonId === 'true_button_select_month') {
                        user_select_month = choices_per_month;
                        let for_time_day_get_data = MonthToDay(user_select_month, user_select_year);
                        if (getCurrentTime('Year') == parseInt(user_select_year)) {
                            if (getCurrentTime('Month') === parseInt(user_select_month)) {
                                for_time_day = getCurrentTime('Day');
                            }
                            else {
                                for_time_day = 1;
                            }
                        } else {
                            for_time_day = 1;
                        }
                        Select_Menu_Day_up = SelectMenuDayUp(for_time_day);
                        Select_Menu_Day_down = SelectMenuDayDown(for_time_day, for_time_day_get_data);
                        if (for_time_day <= 15) {
                            await i.update({ content: '請選擇要幾號提醒', components: [Day_time_button], ephemeral: true });
                        } else {
                            await i.update({ content: '請選擇要幾號提醒', components: [Select_Menu_Day_down], ephemeral: true });
                        }
                    } else if (buttonId === 'false_button_select_month') {
                        await i.update({ content: '請選擇幾月提醒', components: [Select_Menu_Month], ephemeral: true });
                    } else if (buttonId === 'Day_time_up') {
                        await i.update({ content: '請選擇要幾號提醒', components: [Select_Menu_Day_up, Day_time_button], ephemeral: true });
                    } else if (buttonId === 'Day_time_down') {
                        await i.update({ content: '請選擇要幾號提醒', components: [Select_Menu_Day_down, Day_time_button], ephemeral: true });
                    } else if (buttonId === 'true_button_select_day') {
                        user_select_day = choices_per_day;
                        if (parseInt(user_select_year) === getCurrentTime('Year') &&
                            parseInt(user_select_month) === getCurrentTime('Month') && parseInt(user_select_day) === getCurrentTime('Day')) {
                            if (getCurrentTime("Minute") >= 55) for_time_hour = getCurrentTime('Hour') + 1;
                            else for_time_hour = getCurrentTime('Hour');
                        } else {
                            for_time_hour = 0
                        }

                        Select_Menu_Hour = SelectMenuHour(for_time_hour);
                        await i.update({ content: '請選擇要幾點提醒', components: [Select_Menu_Hour], ephemeral: true });
                    } else if (buttonId === 'false_button_select_day') {
                        await i.update({ content: '請重新填寫', components: [], ephemeral: true });
                        await wait(5_000);
                        collector.stop();
                    }
                    break;
            }
        });

        collector.on('end', collected => {
            CheckDebugMode(`已收集到 ${collected.size} 個互動。`);
            CheckDebugMode(hasSelectedDayButton);
            if (collector.ended) {
                if (DebugMode) {
                    interaction.editReply({ content: `該指令已結束，如需設定其他提醒請重新輸入\`/schedule \`\n已收集到 ${collected.size} 個互動。`, components: [], ephemeral: true }).catch(console.error);
                } else {
                    if (hasSelectedDayButton) {
                        interaction.editReply({ content: `提醒已經安排好了，如果需要設定其他提醒，請重新輸入\`/schedule \`。`, components: [], ephemeral: true }).catch(console.error);
                    } else {
                        interaction.editReply({ content: `提醒設定失敗，請重新輸入\`/schedule \`進行提醒設定。`, components: [], ephemeral: true }).catch(console.error);
                    }
                }
            }
        });
    }
};