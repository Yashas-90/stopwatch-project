let min = 0;
let sec = 0;
let ms = 0;
let timer = null;

function start() {
    if (timer) return;

    timer = setInterval(() => {
        ms++;

        if (ms === 100) {
            ms = 0;
            sec++;
        }

        if (sec === 60) {
            sec = 0;
            min++;
        }

        document.getElementById("min").innerText = pad(min);
        document.getElementById("sec").innerText = pad(sec);
        document.getElementById("ms").innerText = pad(ms);
    }, 10);
}

function stop() {
    clearInterval(timer);
    timer = null;
}

function reset() {
    stop();
    min = sec = ms = 0;
    document.getElementById("min").innerText = "00";
    document.getElementById("sec").innerText = "00";
    document.getElementById("ms").innerText = "00";
    clearLaps();
}

function pad(value) {
    return value < 10 ? "0" + value : value;
}

/* ===== Laps support ===== */
let laps = [];

function lap() {
    const time = `${pad(min)}:${pad(sec)}.${pad(ms)}`;
    const entry = { time, minutes: min, seconds: sec, ms: ms, created: Date.now() };
    // add newest to top
    laps.unshift(entry);
    renderLaps();
    // brief visual feedback
    if (typeof flashButtonByClass === 'function') flashButtonByClass('lap-button');
}

function renderLaps() {
    const ol = document.getElementById('lapList');
    if (!ol) return;
    ol.innerHTML = '';
    laps.forEach((lapObj, idx) => {
        const li = document.createElement('li');
        li.className = 'lap-item';
        li.innerHTML = `<span class="lap-num">Lap ${laps.length - idx}</span><span class="lap-time">${lapObj.time}</span>`;
        ol.appendChild(li);
        requestAnimationFrame(() => { li.classList.add('new'); setTimeout(() => li.classList.remove('new'), 700); });
    });
}

function clearLaps() {
    laps = [];
    const ol = document.getElementById('lapList');
    if (ol) ol.innerHTML = '';
}

/* Keyboard controls:
   Space -> Start / Stop toggle
   R     -> Reset
   Avoids interfering with inputs or editable elements */
function toggleStartStop() {
    if (timer) stop(); else start();
}

function flashButtonByClass(btnClass) {
    const btn = document.querySelector('.controls .' + btnClass);
    if (!btn) return;
    btn.classList.add('kbd-active');
    setTimeout(() => btn.classList.remove('kbd-active'), 180);
}

document.addEventListener('keydown', (e) => {
    const t = e.target;
    const tag = t && t.tagName ? t.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || t.isContentEditable) return;

    const key = e.key || '';
    const code = e.code || '';
    const isSpace = (code === 'Space') || (key === ' ') || (key === 'Spacebar') || (key === 'Space');

    if (isSpace) {
        e.preventDefault();
        if (timer) {
            stop();
            flashButtonByClass('stop-button');
        } else {
            start();
            flashButtonByClass('start-button');
        }
        return;
    }

    // 'R' to reset (case-insensitive)
    if (key && key.toLowerCase() === 'r') {
        reset();
        flashButtonByClass('reset-button');
        return;
    }

    // 'L' to add a lap
    if (key && key.toLowerCase() === 'l') {
        lap();
        flashButtonByClass('lap-button');
        return;
    }
});
