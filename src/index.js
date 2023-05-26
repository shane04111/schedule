/*
 * @author: shane
 * @Date: 2023-04-11 06:25:58
 * @LastEditTime: 2023-05-26 21:21:32
 * @FilePath: \timepost\src\index.js
 */

const { Client, GatewayIntentBits, Collection, Guild, } = require('discord.js');
const { token, notifyId, DebugMode } = require('./config.json');
const CheckDebugMode = require(`./function/CheckDebugMode.js`);
const fs = require('node:fs');
const path = require('node:path');
const wait = require('node:timers/promises').setTimeout;
const getCurrentTime = require(`./function/getCurrentTime.js`);
const { log } = require('node:console');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
//====================================
// 創建指令合集
client.commands = new Collection();
//====================================
// 動態檢查commands資料夾檔案，並添加至commands指令合集中
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
}
//====================================
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
//====================================
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'shutdown') {
        // 回復訊息說機器人在關閉中
        interaction.reply({ content: '正在關閉機器人...' });
        // 在終端機中顯示正在關閉
        console.log('\x1B[34mStopping bot...\x1B[0m');
        // 等0.5秒後關閉機器人
        await wait(500);
        // 關閉機器人
        await client.destroy();
        process.exit();
    }
});
//====================================
const unityPath = path.join(__dirname, 'unity');
const unityFiles = fs.readdirSync(unityPath).filter(file => file.endsWith('.js'));

for (const file of unityFiles) {
    const filePath = path.join(unityPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
//====================================
let choices_year, choices_month, choices_day, choices_hour, choices_minute, choices_user_ID, choices_tag_get, choices_schedule_get, choices_channel_get, choices_channel_get_id, choices_channel, choices_user, getData, getDelete, choices_file;
function GetJson() {
    // 定位文件
    const fileContent = fs.readFileSync(__dirname + '/commands/schedule/schedule_date.json', 'utf8');
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

        getData++;

        const now_time_data = `${getCurrentTime('Year')}-${getCurrentTime('Month')}-${getCurrentTime('Day')}-${getCurrentTime('Hour')}-${getCurrentTime('Minute')}`;
        const now_time_data_getTime = new Date(parseInt(getCurrentTime('Year')), parseInt(getCurrentTime('Month') - 1), parseInt(getCurrentTime('Day')), parseInt(getCurrentTime('Hour')), parseInt(getCurrentTime('Minute')));
        const choices_time_data = `${choices_year}-${choices_month}-${choices_day}-${choices_hour}-${choices_minute}`;
        const choices_time_data_getTime = new Date(parseInt(choices_year), parseInt(choices_month - 1), parseInt(choices_day), parseInt(choices_hour), parseInt(choices_minute));

        // 檢查時間是選擇時間是否與現在時間相符
        if (now_time_data === choices_time_data) {
            let send_schedule;
            CheckDebugMode(choices_file);
            if (choices_file !== 'undefined' && choices_file !== undefined && choices_schedule_get !== 'null') {
                send_schedule = `${choices_schedule_get}\n${choices_file}`
            } else if (choices_schedule_get === 'null' && choices_file !== 'undefined' && choices_file !== undefined) {
                send_schedule = `${choices_file}`
            } else {
                send_schedule = `${choices_schedule_get}`
            }
            if (choices_tag_get === 'true') {
                // 原指令輸入頻道發話
                if (choices_channel_get === 'NA') {
                    client.channels.cache.get(`${choices_channel}`).send(`<@${choices_user_ID}>${send_schedule}`);
                } else {
                    client.channels.cache.get(`${choices_channel_get_id}`).send(`<@${choices_user_ID}>${send_schedule}`);
                }
            } else {
                if (choices_channel_get === 'NA') {
                    client.channels.cache.get(`${choices_channel}`).send(`${send_schedule}`);
                } else {
                    client.channels.cache.get(`${choices_channel_get_id}`).send(`${send_schedule}`);
                }
            }
            // 私訊使用者
            client.users.send(`${choices_user_ID}`, `${send_schedule}`);
        }
        if (now_time_data_getTime > choices_time_data_getTime) {
            getDelete++;
            data.choices.splice(index, 1);
            // 將文件寫回去

        }
    });
    fs.writeFileSync(__dirname + '/commands/schedule/schedule_date.json', JSON.stringify(data), 'utf8');
}
//====================================
function guild_cache_get() {
    const guilds = client.guilds.cache;
    return guilds;
}
//====================================
client.on('ready', async () => {
    log('機器人目前在', guild_cache_get().size, '台伺服器中');
    setInterval(() => {
        if (getCurrentTime('Second') === 0) {
            GetJson();
            const paddedYear = getCurrentTime('Year').toString().padStart(4, "0"); // 這樣 paddedYear 就會是 "2023"
            const paddedMonth = getCurrentTime('Month').toString().padStart(2, "0"); // 這樣 paddedMonth 就會是 "04"
            const paddedDay = getCurrentTime('Day').toString().padStart(2, "0"); // 這樣 paddedDay 就會是 "11"
            const paddedHour = getCurrentTime('Hour').toString().padStart(2, "0"); // 這樣 paddedHour 就會是 "09"
            const paddedMinute = getCurrentTime('Minute').toString().padStart(2, "0"); // 這樣 paddedMinute 就會是 "05"
            const now_time_data = `${paddedYear}/${paddedMonth}/${paddedDay}-${paddedHour}:${paddedMinute}`;
            CheckDebugMode('使用者資料數量：', getData, '刪除使用者資料數量：', getDelete, '目前時間：', now_time_data);
        }
    }, 1000)
})
//====================================
client.on('messageCreate', message => {
    if (message.content === '!guilds') {
        if (message.author.id === notifyId) {
            const guilds = client.guilds.cache;
            let guilds_message = '';
            guilds.forEach((guild, index) => {
                if (index !== guilds.size - 1) {
                    guilds_message += guild.name + '\n';
                } else {
                    guilds_message += guild.name;
                }
            });
            message.reply(`已收到您的訊息！\n${guilds_message}`);
        } else {
            message.reply(`無權限！`);
        }
    }
});
//====================================
client.on('guildCreate', guild => {
    console.log(`機器人加入了新的伺服器：\x1B[32m${guild.name}\x1B[0m\n機器人目前在 \x1B[33m${guild_cache_get().size}\x1B[0m 台伺服器中`);
});
//====================================
client.on('guildDelete', guild => {
    console.log(`機器人離開了伺服器：\x1B[32m${guild.name}\x1B[0m\n機器人目前在 \x1B[33m${guild_cache_get().size}\x1B[0m 台伺服器中`);
});
//====================================
process.on('SIGINT', async () => {
    try {
        if (DebugMode === true) {
            console.log('\x1B[34m收到 Ctrl+C 信號，退出機器人進程\x1B[0m');
            await client.users.send(notifyId, '收到 Ctrl+C 信號，退出機器人進程');
        } else {
            console.log('\x1B[34m收到 Ctrl+C 信號，退出機器人進程\x1B[0m');
        }
        await process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
//====================================
process.on('SIGTERM', async () => {
    try {
        if (DebugMode === true) {
            console.log('\x1B[34m收到 SIGTERM 信號，退出機器人進程\x1B[0m');
            await client.users.send(notifyId, '收到 SIGTERM 信號，退出機器人進程');
        } process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
//====================================
process.on('uncaughtException', (err) => {
    if (err.message.includes('token')) {
        console.error(`\x1B[31m未處理的異常：\x1B[0m${err}`, err);
    } else {
        console.error(`\x1B[31m未處理的異常：\x1B[0m${err}`, err);
        client.users.send(notifyId, `未處理的異常：${err}`);
    }
});
//====================================
client.login(token);
