/*
 * @author: shane
 * @Date: 2023-05-22 08:43:36
 * @LastEditTime: 2023-05-26 05:59:38
 * @FilePath: \timepost\src\commands\schedule\schedule_list.js
 */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const CheckDebugMode = require(`../../function/CheckDebugMode.js`);
const convertToChineseTime = require(`../../function/convertToChineseTime.js`);
const { log, time, timeEnd } = require('node:console');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule_list')
        .setDescription('查詢保存的提醒項目，選項都是可選的，若未作出選擇，預設顯示全部。')
        .addBooleanOption(option =>
            option
                .setName('查詢時段提醒')
                .setDescription('請選擇是否按照時段查詢提醒，預設值為否。')
        )
        .addUserOption(option =>
            option
                .setName('查詢使用者提醒')
                .setDescription('請選擇要查找哪位使用者的提醒，預設為自己。')
        )
        .addChannelOption(option =>
            option
                .setName('查詢頻道提醒')
                .setDescription('檢查特定頻道是否設置了提醒，預設查詢所有頻道。')
        )
        .addStringOption(option =>
            option
                .setName('關鍵字查詢')
                .setDescription('使用關鍵字進行提醒搜尋。')
        )
        .addBooleanOption(option =>
            option
                .setName('查詢標籤')
                .setDescription('是否檢查標籤是否啟用，預設為不檢查。')
        ),
    async execute(interaction) {
        let choices_year, choices_month, choices_day, choices_hour, choices_minute, choices_user_ID, choices_tag_get, choices_schedule_get, choices_channel_get, choices_channel_get_id, choices_channel, choices_user, getData, getDelete;
        const Chose_Date_Index = [];
        const Chose_Date = [];
        const Option_Time = interaction.options.getBoolean('查詢時段提醒') ?? false;
        const Option_User = interaction.options.getUser('查詢使用者提醒') ?? null;
        const Option_Channel = interaction.options.getChannel('查詢頻道提醒') ?? null;
        const Option_String = interaction.options.getString('關鍵字查詢') ?? null;
        const Option_Tag = interaction.options.getBoolean('查詢標籤') ?? null;
        // 定位文件
        const fileContent = fs.readFileSync(__dirname + '/schedule_date.json', 'utf8');
        const data = JSON.parse(fileContent);

        getDelete = 0;
        getData = 0;
        // 遍歷文件中choices陣列
        data.choices.forEach(async (u, index) => {
            // 取得json中各參數數值
            choices_year = u.choices_year;
            choices_month = u.choices_month;
            choices_day = u.choices_day;

            choices_hour = u.choices_hour;
            choices_minute = u.choices_minute;

            choices_user_ID = u.choices_name_id;
            choices_user = u.choices_name;
            choices_channel = u.choices_channel;
            choices_channel_get_id = u.choices_channel_options_ID;
            choices_channel_get = u.choices_channel_options_Name;

            choices_tag_get = u.choices_tag;
            choices_schedule_get = u.choices_schedule;
            choices_file = u.choices_file;
            Get_guild_id = u.Guild_id;

            getData++;

            if (interaction.guildId === Get_guild_id &&
                (Option_Time === false || choices_hour === Option_Time) &&
                ((Option_User === null && choices_user_ID === interaction.user.id) ||
                    (Option_User !== null && choices_user_ID === Option_User.id)) &&
                ((Option_Channel === null || (choices_channel_get_id === 'undefined' && choices_channel === Option_Channel.id)) ||
                    (choices_channel_get_id !== 'undefined' && choices_channel_get_id === Option_Channel.id)) &&
                (Option_String === null || choices_schedule_get.includes(Option_String)) &&
                (Option_Tag === null || choices_tag_get === Option_Tag.toString())) {
                Chose_Date.push(data.choices[index]);
            }
        });
        CheckDebugMode(Chose_Date);
        const Embed_index = parseInt(Chose_Date.length / 10) + 1;
        const schedule_Embed = new EmbedBuilder()
            .setColor(0x7FFFD4)
            .setTitle('已安排提醒')
            .setTimestamp()
            .setDescription(`目前的提醒總數為 ${data.choices.length}，目前的查詢總數為 ${Chose_Date.length}。`)
            .setFooter({ text: '查詢時間' });

        try {
            if (Chose_Date.length !== 0) {
                if (Chose_Date.length > 10) {
                    schedule_Embed.setDescription(
                        `目前的提醒總數為 ${data.choices.length}，目前的查詢總數為 ${Chose_Date.length}。
                當前查找頁數為 ，總頁數為${Embed_index}`
                    );
                }
                for (let i = 0; i < Chose_Date.length; i++) {
                    const paddedYear = Chose_Date[i].choices_year.toString().padStart(4, "0");
                    const paddedMonth = Chose_Date[i].choices_month.toString().padStart(2, "0");
                    const paddedDay = Chose_Date[i].choices_day.toString().padStart(2, "0");
                    const paddedHour = convertToChineseTime(parseInt(Chose_Date[i].choices_hour));
                    const paddedMinute = Chose_Date[i].choices_minute.toString().padStart(2, "0");
                    const Chose_Date_Time = paddedYear + '年' + paddedMonth + '月' + paddedDay + '日 ' + paddedHour + paddedMinute + '分';
                    CheckDebugMode(Chose_Date_Time);
                    let get_Channel_Output;
                    if (Chose_Date[i].choices_channel_options_Name === 'NA') {
                        get_Channel_Output = Chose_Date[i].choices_channel;
                    } else {
                        get_Channel_Output = Chose_Date[i].choices_channel_options_ID;
                    }
                    if (Chose_Date.length <= 10) {
                        schedule_Embed.addFields({
                            name: `提醒${i + 1}`,
                            value: `提醒使用者：<@${Chose_Date[i].choices_name_id}>
                            提醒事項：${Chose_Date[i].choices_schedule}
                            附加檔案：${Chose_Date[i].choices_file}
                            是否有標記：${true_false_to_zn_tw(Chose_Date[i].choices_tag)}
                            提醒時間：${Chose_Date_Time}
                            提醒頻道：<#${get_Channel_Output}>`
                        });
                    } else {
                        if (i <= 9) {
                            schedule_Embed.addFields({
                                name: `提醒${i + 1}`,
                                value: `提醒使用者：<@${Chose_Date[i].choices_name_id}>
                                提醒事項：${Chose_Date[i].choices_schedule}
                                附加檔案：${Chose_Date[i].choices_file}
                                是否有標記：${true_false_to_zn_tw(Chose_Date[i].choices_tag)}
                                提醒時間：${Chose_Date_Time}
                                提醒頻道：<#${get_Channel_Output}>`
                            });
                        }
                    }
                }
            } else if (Chose_Date.length === 0 && data.choices.length !== 0) {
                schedule_Embed.addFields({
                    name: `無相符的提醒`,
                    value: `無法找到相關的提醒。`
                });
                schedule_Embed.setColor(0xADFF2F);
            } else if (data.choices.length === 0) {
                schedule_Embed.addFields({
                    name: `無提醒`,
                    value: `尚未設定任何提醒。`
                });
                schedule_Embed.setColor(0xFFA500);
            }
        } catch (err) {
            console.error('執行 尋找提醒時發生錯誤\n請檢察embed字數是否超過6000', err);
            interaction.reply({
                content: '指令執行發生錯誤',
                ephemeral: true
            })
        }

        CheckDebugMode(data.choices.length, Chose_Date.length);
        CheckDebugMode(Option_Channel, Option_User, Option_String, Option_Time);
        await interaction.reply({
            embeds: [schedule_Embed],
            ephemeral: true
        });
    }
}

function true_false_to_zn_tw(tof) {
    switch (tof) {
        case 'true':
            return '是'
        case 'false':
            return '否'
    }
}