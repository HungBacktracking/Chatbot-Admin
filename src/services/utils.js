const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getDateStr = (time) => {
    var currentdate;
    if (time == -1) currentdate = new Date();
    else currentdate = new Date(time);
    return (
        currentdate.getDate() +
        '/' +
        (currentdate.getMonth() + 1) +
        '/' +
        currentdate.getFullYear() +
        ' ' +
        (currentdate.getHours() < 10 ? '0' : '') +
        currentdate.getHours() +
        ':' +
        (currentdate.getMinutes() < 10 ? '0' : '') +
        currentdate.getMinutes() +
        ':' +
        (currentdate.getSeconds() < 10 ? '0' : '') +
        currentdate.getSeconds()
    );
}

export { delay, getDateStr };