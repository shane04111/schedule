/*
 * @author: shane
 * @Date: 2023-04-11 06:25:58
 * @LastEditTime: 2023-05-23 16:24:45
 * @FilePath: \timepost\src\index.js
 */

const { Client, Events, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, AuditLogEvent } = require('discord.js');
const { token, notifyId, DebugMode } = require('./config.json');
const CheckDebugMode = require(`./function/CheckDebugMode.js`);
const fs = require('node:fs');
const path = require('node:path');
const wait = require('node:timers/promises').setTimeout;
const getCurrentTime = require(`./function/getCurrentTime.js`);
const { exec } = require('child_process');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

// 機器人上線提示
client.once(Events.ClientReady, async c => {
    if (typeof DebugMode !== "boolean") {
        try {
            const filePath = './src/config.json';
            const fileContent = fs.readFileSync(filePath, 'utf8');
            // 使用正規表達式搜尋 DebugMode
            const regex = /"DebugMode"\s*:/;
            const match = fileContent.match(regex);
            if (match) {
                // 取得 DebugMode 所在的行數
                const lineNumber = fileContent.substr(0, match.index).split('\n').length;
                const error = `./src/config.json:${lineNumber} 中的 "DebugMode" 設定錯誤，並非布林值，請改為 true 或者 false`;
                const filePath = path.join(__dirname, 'config.json');
                let command;
                switch (process.platform) {
                    case 'win32':
                        command = `start "" "${filePath}"`;
                        break;
                    case 'linux':
                        command = `xdg-open "${filePath}"`;
                        break;
                    case 'darwin':
                        command = `open "${filePath}"`;
                        break;
                    default:
                        console.error('不支援的作業系統');
                        process.exit(1);
                }exec(command, (error) => {
                    if (error) {
                        console.error(`無法開啟檔案: ${error}`);
                    }
                });
                await wait(1000);
                c.users.send(notifyId, `正在關閉機器人，發生設定錯誤：${error}`);
                console.error('正在關閉機器人，發生設定錯誤：', error);
                await wait(500);
                process.exit(0);
            }
        } catch (error) {
            console.error('在讀取 config.js 檔案時發生錯誤。:', error);
        }
    } else {
        // 創建新的按鈕用來關閉機器人
        const shutdown = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('shutdown')
                    .setLabel('強制關閉機器人')
                    .setStyle(ButtonStyle.Danger),
            );
        // 私訊給特定使用者
        if (DebugMode === true) c.users.send(notifyId, { content: '機器人已上線 !', components: [shutdown] });
        // 傳送訊息到特定頻道
        // c.channels.cache.get('Your-channels').send({ content: 'Hello World!', components: [shutdown] });
        console.log(`機器人已上線-${c.user.tag}`);
    }
});

// 關閉機器人按鈕回復
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'shutdown') {
        // 回復訊息說機器人在關閉中
        interaction.reply({ content: '正在關閉機器人...' });
        // 在終端機中顯示正在關閉
        console.log('Stopping bot...');
        // 等0.5秒後關閉機器人
        await wait(500);
        // 關閉機器人
        await client.destroy();
        process.exit();
    }
});

// 創建指令合集
client.commands = new Collection();

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
        } else {
            console.log(`[警告] 位於 ${filePath} 的指令缺少必要的 "data" 或 "execute" 屬性。`);
        }
    }
}

// 執行命令
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand() || !interaction.isAutocomplete()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`找不到符合 ${interaction.commandName} 的指令。`);
        return;
    }

    try {
        if (interaction.isAutocomplete()) {
            await command.autocomplete(interaction);
        } else {
            await command.execute(interaction);
        }
        // await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '這個指令執行時發生了錯誤！', ephemeral: true });
            await client.users.send(notifyId, `/${interaction.commandName}執行時發生錯誤`)
        } else {
            await interaction.reply({ content: '這個指令執行時發生了錯誤！', ephemeral: true });
            await client.users.send(notifyId, `/${interaction.commandName} 執行時發生錯誤`)
        }
    }
});

// 設定參數
let choices_year, choices_month, choices_day, choices_hour, choices_minute, choices_user_ID, choices_tag_get, choices_schedule_get, choices_channel_get, choices_channel_get_id, choices_channel, choices_user, getData, getDelete;
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
            fs.writeFileSync(__dirname + '/commands/schedule/schedule_date.json', JSON.stringify(data), 'utf8');
            await wait(100);
        }
    });
}

client.on('ready', async () => {
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

process.on('SIGINT', async () => {
    try {
        if (DebugMode === true) {
            console.log('收到 Ctrl+C 信號，退出機器人進程');
            await client.users.send(notifyId, '收到 Ctrl+C 信號，退出機器人進程');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        if (DebugMode === true) {
            console.log('收到 SIGTERM 信號，退出機器人進程');
            await client.users.send(notifyId, '收到 SIGTERM 信號，退出機器人進程');
        } process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});

process.on('uncaughtException', async (err) => {
    console.error(`未處理的異常：${err}`, err);
});

client.login(token);
