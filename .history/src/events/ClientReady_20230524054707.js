/*
 * @author: shane
 * @Date: 2023-05-24 05:43:19
 * @LastEditTime: 2023-05-24 05:47:06
 * @FilePath: \timepost\src\events\ClientReady.js
 */
const { Events } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const wait = require('node:timers/promises').setTimeout;
const { exec } = require('child_process');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(c) {
        if (typeof DebugMode !== "boolean") {
            try {
                const filePath = './src/config.json';
                const fileContent = fs.readFileSync(filePath, 'utf8');
                // 使用正規表達式搜尋 DebugMode
                const regex = /"DebugMode"\s*:/;
                const match = fileContent.match(regex);
                if (match) {
                    // 取得 DebugMode 所在的行數
                    const lineNumber = fileContent.substring(0, match.index).split('\n').length;
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
                    await wait(500);
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
    }
}