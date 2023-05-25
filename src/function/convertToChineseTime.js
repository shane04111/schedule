function convertToChineseTime(hour) {
    switch (hour) {
        case 0:
            return '半夜十二點';
        case 1:
            return '凌晨一點';
        case 2:
            return '凌晨二點';
        case 3:
            return '凌晨三點';
        case 4:
            return '凌晨四點';
        case 5:
            return '凌晨五點';
        case 6:
            return '早上六點';
        case 7:
            return '早上七點';
        case 8:
            return '早上八點';
        case 9:
            return '早上九點';
        case 10:
            return '上午十點';
        case 11:
            return '上午十一點';
        case 12:
            return '中午十二點';
        case 13:
            return '下午一點';
        case 14:
            return '下午二點';
        case 15:
            return '下午三點';
        case 16:
            return '下午四點';
        case 17:
            return '下午五點';
        case 18:
            return '晚上六點';
        case 19:
            return '晚上七點';
        case 20:
            return '晚上八點';
        case 21:
            return '晚上九點';
        case 22:
            return '晚上十點';
        case 23:
            return '晚上十一點';
        default:
            return '無效的小時數';
    }
}

module.exports = convertToChineseTime;
