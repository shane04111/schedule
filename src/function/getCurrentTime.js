
function getCurrentTime(time_need) {
    const now = new Date();
    switch (time_need) {
        case 'Year':
            return now.getFullYear();
        case 'Month':
            return now.getMonth() + 1;
        case 'Day':
            return now.getDate();
        case 'Hour':
            return now.getHours();
        case 'Minute':
            return now.getMinutes();
        case 'Second':
            return now.getSeconds();
    }
}

module.exports = getCurrentTime;
