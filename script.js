let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const toggleButton = document.getElementById('toggle-mode');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update page title with timer
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const mode = isWorkTime ? 'Work' : 'Break';
    document.title = `${timeString} - ${mode} | Pomodoro`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleButton.textContent = isWorkTime ? 'Switch to Break' : 'Switch to Work';
    updateDisplay();
    saveState();
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            alert(isWorkTime ? 'Work time is over! Take a break!' : 'Break is over! Back to work!');
            switchMode();
        }
    }, 1000);
    
    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    statusText.textContent = 'Work Time';
    startButton.textContent = 'Start';
    toggleButton.textContent = 'Switch to Break';
    updateDisplay();
    saveState();
}

function saveState() {
    const state = {
        timeLeft,
        isWorkTime,
        isRunning: timerId !== null
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
        const state = JSON.parse(savedState);
        timeLeft = state.timeLeft;
        isWorkTime = state.isWorkTime;
        
        // Update UI elements
        statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
        toggleButton.textContent = isWorkTime ? 'Switch to Break' : 'Switch to Work';
        
        // Restart timer if it was running
        if (state.isRunning) {
            startTimer();
        }
        
        updateDisplay();
    }
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', resetTimer);

// Add event listener for toggle button
toggleButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
    switchMode();
});

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay();

loadState() || (timeLeft = WORK_TIME, updateDisplay()); 