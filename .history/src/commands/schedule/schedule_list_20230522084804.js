/*
 * @author: shane
 * @Date: 2023-05-22 08:43:36
 * @LastEditTime: 2023-05-22 08:48:04
 * @FilePath: \timepost\src\commands\schedule\schedule_list.js
 */
const { SlashCommandBuilder } = require('discord.js');

let choices_year, choices_month, choices_day, choices_hour, choices_minute, choices_user_ID, choices_tag_get, choices_schedule_get, choices_channel_get, choices_channel_get_id, choices_channel, choices_user, getData, getDelete;
module.exports = {
    // 定位文件
    const fileContent = fs.readFileSync('./schedule_date.json', 'utf8');
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
    });
}

