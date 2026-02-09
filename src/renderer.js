const timerMinutesInput = document.getElementById("timer-minutes");
const timerSecondsInput = document.getElementById("timer-seconds");
const timerTime = document.getElementById("timer-time");
const timerStatus = document.getElementById("timer-status");
const timerRing = document.getElementById("timer-ring");
const timerStart = document.getElementById("timer-start");
const timerPause = document.getElementById("timer-pause");
const timerReset = document.getElementById("timer-reset");

const stopwatchTime = document.getElementById("stopwatch-time");
const stopwatchStatus = document.getElementById("stopwatch-status");
const stopwatchStart = document.getElementById("stopwatch-start");
const stopwatchLap = document.getElementById("stopwatch-lap");
const stopwatchReset = document.getElementById("stopwatch-reset");
const lapList = document.getElementById("lap-list");

let timerInterval = null;
let timerTotalSeconds = 25 * 60;
let timerRemainingSeconds = timerTotalSeconds;

let stopwatchInterval = null;
let stopwatchStartTime = null;
let stopwatchElapsed = 0;
let lapCount = 0;

const padTime = (value) => value.toString().padStart(2, "0");

const formatTimer = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${padTime(minutes)}:${padTime(remainder)}`;
};

const updateTimerDisplay = () => {
  timerTime.textContent = formatTimer(timerRemainingSeconds);
  const progress = timerTotalSeconds
    ? ((timerTotalSeconds - timerRemainingSeconds) / timerTotalSeconds) * 360
    : 0;
  timerRing.style.setProperty("--progress", `${progress}deg`);
};

const updateTimerFromInputs = () => {
  const minutes = Math.max(0, Number(timerMinutesInput.value));
  const seconds = Math.max(0, Number(timerSecondsInput.value));
  timerTotalSeconds = minutes * 60 + Math.min(59, seconds);
  timerRemainingSeconds = timerTotalSeconds;
  timerStatus.textContent = "Ready";
  updateTimerDisplay();
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const tickTimer = () => {
  if (timerRemainingSeconds > 0) {
    timerRemainingSeconds -= 1;
    updateTimerDisplay();
    timerStatus.textContent = "Running";
    return;
  }

  stopTimer();
  timerStatus.textContent = "Complete";
};

const startTimer = () => {
  if (timerTotalSeconds === 0) {
    timerStatus.textContent = "Set time";
    return;
  }

  if (timerInterval) {
    return;
  }

  timerStatus.textContent = "Running";
  timerInterval = setInterval(tickTimer, 1000);
};

const pauseTimer = () => {
  if (!timerInterval) {
    return;
  }

  stopTimer();
  timerStatus.textContent = "Paused";
};

const resetTimer = () => {
  stopTimer();
  updateTimerFromInputs();
};

const formatStopwatch = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((milliseconds % 1000) / 100);
  return `${padTime(minutes)}:${padTime(seconds)}.${tenths}`;
};

const updateStopwatchDisplay = () => {
  stopwatchTime.textContent = formatStopwatch(stopwatchElapsed);
};

const updateStopwatchStatus = (status) => {
  stopwatchStatus.textContent = status;
};

const startStopwatch = () => {
  if (stopwatchInterval) {
    return;
  }

  stopwatchStartTime = Date.now() - stopwatchElapsed;
  updateStopwatchStatus("Running");
  stopwatchInterval = setInterval(() => {
    stopwatchElapsed = Date.now() - stopwatchStartTime;
    updateStopwatchDisplay();
  }, 100);
};

const stopStopwatch = () => {
  if (!stopwatchInterval) {
    return;
  }

  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  updateStopwatchStatus("Paused");
};

const resetStopwatch = () => {
  stopStopwatch();
  stopwatchElapsed = 0;
  lapCount = 0;
  lapList.innerHTML = '<p class="empty">No laps yet.</p>';
  updateStopwatchDisplay();
  updateStopwatchStatus("Idle");
};

const addLap = () => {
  if (!stopwatchInterval) {
    return;
  }

  lapCount += 1;
  if (lapCount === 1) {
    lapList.innerHTML = "";
  }

  const lap = document.createElement("div");
  lap.className = "lap";
  lap.innerHTML = `<span>#${padTime(lapCount)}</span><span>${formatStopwatch(stopwatchElapsed)}</span>`;
  lapList.prepend(lap);
};

const toggleStopwatch = () => {
  if (stopwatchInterval) {
    stopStopwatch();
    stopwatchStart.textContent = "Resume";
  } else {
    startStopwatch();
    stopwatchStart.textContent = "Pause";
  }
};

const syncTimerInputs = () => {
  if (timerInterval) {
    return;
  }
  updateTimerFromInputs();
};

timerMinutesInput.addEventListener("change", syncTimerInputs);
timerSecondsInput.addEventListener("change", syncTimerInputs);

timerStart.addEventListener("click", () => {
  startTimer();
});

timerPause.addEventListener("click", pauseTimer);
timerReset.addEventListener("click", resetTimer);

stopwatchStart.addEventListener("click", toggleStopwatch);
stopwatchLap.addEventListener("click", addLap);
stopwatchReset.addEventListener("click", resetStopwatch);

updateTimerFromInputs();
updateStopwatchDisplay();
