let startTime = new Date("2022-01-01:00:00:00");
let endTime = new Date("2023-01-01:00:00:00");

const getSumTime = () => {
    return endTime.getTime() - startTime.getTime();
}

const getNowTime = () => {
    let date = new Date();
    return date.getTime() - startTime.getTime();
}

const getPercent = () => {
    return getNowTime() / getSumTime() * 100;
}


func = () => {
    str = getPercent().toString();
    let self = document.getElementById('info');
    self.innerHTML = str;
}

function sleep(delay) {
    let start = new Date().getTime();
    while(new Date().getTime() - start < delay) {
    }
}
cnt = 100;
// while(cnt--) {
    setInterval(func,1000);
    // delInfo();
    // setInterval(delInfo,1000);
// }





