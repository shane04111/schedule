/*
 * @author: shane
 * @Date: 2023-04-19 03:41:18
 * @LastEditTime: 2023-05-19 00:16:46
 * @FilePath: \timepost\src\function\MonthDay.js
 */
const CheckDebugMode = require(`./CheckDebugMode.js`);
function isLeapMonth(Lap_year) {
    // 如果該年份可以被4整除但是不被100整除，或者可以被400整除，那麼該年份的2月為閏月
    return (Lap_year % 4 === 0 && Lap_year % 100 !== 0) || Lap_year % 400 === 0;
}
function MonthToDay(Month_Input, Lap_year_Input) {
    switch (Month_Input) {
        case '1':
            return 31;
        case '2':
            const Lap_year = Lap_year_Input; // 設定年份
            const isLeap = isLeapMonth(Lap_year); // 判斷該年二月是否為閏月
            if (isLeap) {
                CheckDebugMode(`${Lap_year} 年的 2 月是閏月`);
                return 29;
            } else {
                CheckDebugMode(`${Lap_year} 年的 2 月不是閏月`);
                return 28;
            }
        case '3':
            return 31;
        case '4':
            return 30;
        case '5':
            return 31;
        case '6':
            return 30;
        case '7':
            return 31;
        case '8':
            return 31;
        case '9':
            return 30;
        case '10':
            return 31;
        case '11':
            return 30;
        case '12':
            return 31;
    }
}

module.exports = MonthToDay;