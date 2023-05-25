/*
 * @author: shane
 * @Date: 2023-05-22 08:43:36
 * @LastEditTime: 2023-05-23 02:13:02
 * @FilePath: \timepost\src\commands\schedule\schedule_list.js
 */
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { execute } = require('./schedule');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule_list')
        .setDescription('查詢當以保存的提醒')
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
        .addStringOption(option => option
            .setName('關鍵字查詢')
            .setDescription('使用關鍵字進行提醒搜尋。')
        ),
    async execute(interaction) {
        let choices_year, choices_month, choices_day, choices_hour, choices_minute, choices_user_ID, choices_tag_get, choices_schedule_get, choices_channel_get, choices_channel_get_id, choices_channel, choices_user, getData, getDelete;
        let Chose_Date_Index = [];
        let Chose_Date = [];
        const Option_Time = interaction.options.getBoolean('查詢時段提醒') ?? false;
        const Option_User = interaction.options.getUser('查詢使用者提醒') ?? interaction.user.id;
        const Option_Channel = interaction.options.getChannel('查詢頻道提醒') ?? null;
        const Option_String = interaction.options.getString('關鍵字查詢') ?? null;
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

            getData++;

            Chose_Date_Index.push(index);
        });
        console.log(Chose_Date_Index);
        for (let i = 0; i < Chose_Date_Index.length; i++) {
            Chose_Date.push(data.choices[Chose_Date_Index[i]]);
        }
        console.log(Chose_Date);
    }
}

function GetJsonDate() {

}

