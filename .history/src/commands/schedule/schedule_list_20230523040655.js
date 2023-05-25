/*
 * @author: shane
 * @Date: 2023-05-22 08:43:36
 * @LastEditTime: 2023-05-23 04:06:19
 * @FilePath: \timepost\src\commands\schedule\schedule_list.js
 */
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const CheckDebugMode = require(`../../function/CheckDebugMode.js`);

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
        const Option_User = interaction.options.getUser('查詢使用者提醒') ?? interaction.user;
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

            if (Option_User.id === choices_user_ID) {
                Chose_Date_Index.push(index);
            }
        });
        console.log(Chose_Date_Index);
        for (let i = 0; i < Chose_Date_Index.length; i++) {
            Chose_Date.push(data.choices[Chose_Date_Index[i]]);
        }
        console.log(Chose_Date, data.choices.length, Chose_Date.length);
        CheckDebugMode(Option_Channel, Option_User, Option_String, Option_Time);
        const role = {
            color: 0xFF9900,
            timestamp: new Date().toISOString(),
            title: '伺服器中的身分組介紹',
            description: '**==============================**',
            fields: [
                { name: '\u200B', value: '<@&1029917790947258429>' },
                { name: '我們自家製作的Discord機器人，可以幫助管理伺服器\n---------', value: '<@&1048987464666198096>' },
                { name: '伺服器的雜事處理人員，有事情可以Tag他們\n---------', value: '<@&1029383924373274664>' },
                { name: '以驗證的Discord使用者\n==============================', value: '<@&1051130659311202305>' },
                { name: '伺服器有重大更新時你將會收到伺服器公告通知\n---------', value: '<@&1068565915177857166>' },
                { name: '當伺服器有重大更新時我們就會通知擁有此身分組的人\n---------', value: '<@&1092350002313052170>' },
                { name: '當伺服器有舉辦大型活動時我們就會@這個身分組，每個活動幾乎都會有福利可以領取喔\n---------', value: '<@&1092350574109937725>' },
                { name: '如果你是喜歡建築的玩家，你可以選擇這項身分組為自己分類喔\n---------', value: '<@&1092349120527736852>' },
                { name: '如果你是紅石大神，歡迎你選這個身分組與其他人交流！', value: '=================================' },
            ],
            footer: { text: '休閒生存', icon_url: 'https://i.imgur.com/BofLBPV.png' },
        };
        interaction.reply({
            content: `${role}`,
            ephemeral: true
        });
    }
}