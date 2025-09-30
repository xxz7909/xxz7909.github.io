const startTime = new Date("2025-01-01T00:00:00");
const endTime = new Date("2026-01-01T00:00:00");

const totalMilliseconds = endTime.getTime() - startTime.getTime();
const infoElement = document.getElementById("info");

const getProgressPercent = () => {
    const now = new Date().getTime();
    const elapsed = now - startTime.getTime();
    return (elapsed / totalMilliseconds) * 100;
};

const renderProgress = () => {
    const percent = getProgressPercent();
    const clamped = Math.min(Math.max(percent, 0), 100);
    infoElement.textContent = `${clamped.toFixed(6)}%`;
};

renderProgress();
setInterval(renderProgress, 1000);
