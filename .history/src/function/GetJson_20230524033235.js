/*
 * @author: shane
 * @Date: 2023-05-24 03:26:49
 * @LastEditTime: 2023-05-24 03:32:25
 * @FilePath: \timepost\src\function\GetJson.js
 */
const fs = require('fs');

let choices_year, choices_month, choices_day, choices_hour, choices_minute, choices_user_ID, choices_tag_get, choices_schedule_get, choices_channel_get, choices_channel_get_id, choices_channel, choices_user, getData, getDelete;
function GetJson() {
    // 定位文件
    const fileContent = fs.readFileSync(__dirname + '/../commands/schedule/schedule_date.json', 'utf8');
    console.log(fileContent);
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

        const now_time_data = `${getCurrentTime('Year')}-${getCurrentTime('Month')}-${getCurrentTime('Day')}-${getCurrentTime('Hour')}-${getCurrentTime('Minute')}`;
        const now_time_data_getTime = new Date(parseInt(getCurrentTime('Year')), parseInt(getCurrentTime('Month') - 1), parseInt(getCurrentTime('Day')), parseInt(getCurrentTime('Hour')), parseInt(getCurrentTime('Minute')));
        const choices_time_data = `${choices_year}-${choices_month}-${choices_day}-${choices_hour}-${choices_minute}`;
        const choices_time_data_getTime = new Date(parseInt(choices_year), parseInt(choices_month - 1), parseInt(choices_day), parseInt(choices_hour), parseInt(choices_minute));

        // 檢查時間是選擇時間是否與現在時間相符
        if (now_time_data === choices_time_data) {
            if (choices_tag_get === 'true') {
                // 原指令輸入頻道發話
                if (choices_channel_get === 'NA') {
                    client.channels.cache.get(`${choices_channel}`).send(`<@${choices_user_ID}>${choices_schedule_get}`);
                } else {
                    client.channels.cache.get(`${choices_channel_get_id}`).send(`<@${choices_user_ID}>${choices_schedule_get}`);
                }
            } else {
                if (choices_channel_get === 'NA') {
                    client.channels.cache.get(`${choices_channel}`).send(`${choices_schedule_get}`);
                } else {
                    client.channels.cache.get(`${choices_channel_get_id}`).send(`${choices_schedule_get}`);
                }
            }
            // 私訊使用者
            client.users.send(`${choices_user_ID}`, `${choices_schedule_get}`);
        }
        if (now_time_data_getTime > choices_time_data_getTime) {
            getDelete++;
            data.choices.splice(index, 1);
            // 將文件寫回去
            fs.writeFileSync(__dirname + '/../commands/schedule/schedule_date.json', JSON.stringify(data), 'utf8');
            await wait(100);
        }
    });
}

module.exports = { GetJson };