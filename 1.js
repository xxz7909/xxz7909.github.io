const now = new Date();
const currentYear = now.getFullYear();
const startTime = new Date(currentYear, 0, 1, 0, 0, 0);
const endTime = new Date(currentYear + 1, 0, 1, 0, 0, 0);

const totalMilliseconds = endTime.getTime() - startTime.getTime();
const infoElement = document.getElementById("info");
const headingElement = document.getElementById("heading");

if (headingElement) {
    headingElement.textContent = `${currentYear} 年已经过去`;
}

const getProgressPercent = () => {
    const elapsed = Date.now() - startTime.getTime();
    return (elapsed / totalMilliseconds) * 100;
};

const renderProgress = () => {
    const percent = getProgressPercent();
    const clamped = Math.min(Math.max(percent, 0), 100);
    infoElement.textContent = `${clamped.toFixed(6)}%`;
};

renderProgress();
setInterval(renderProgress, 1000);
