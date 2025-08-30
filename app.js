// Show/hide history and home
const historyBtn = document.getElementById('historyBtn');
const homeBtn = document.getElementById('homeBtn');
const configSection = document.getElementById('configSection');
const historySection = document.getElementById('historySection');

if (historyBtn && homeBtn && configSection && historySection) {
  historyBtn.addEventListener('click', () => {
    configSection.classList.add('hidden');
    sessionSection.classList.add('hidden');
    historySection.classList.remove('hidden');
    historyBtn.classList.add('hidden');
    homeBtn.classList.remove('hidden');
  });
  homeBtn.addEventListener('click', () => {
    configSection.classList.remove('hidden');
    sessionSection.classList.add('hidden');
    historySection.classList.add('hidden');
    historyBtn.classList.remove('hidden');
    homeBtn.classList.add('hidden');
  });
}
// Speak the current step number with a female voice if available
function speakStep(number) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(number.toString());
    const voices = window.speechSynthesis.getVoices();
    // Try to select a female voice
    const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.gender === 'female' || v.name.toLowerCase().includes('woman') || v.voiceURI.toLowerCase().includes('female'))
      || voices.find(v => v.name.toLowerCase().includes('zira')) // common female voice on Windows
      || voices.find(v => v.name.toLowerCase().includes('susan')) // another common female
      || voices.find(v => v.name.toLowerCase().includes('samantha')) // macOS
      || voices.find(v => v.name.toLowerCase().includes('karen')) // macOS
      || voices.find(v => v.name.toLowerCase().includes('moira')) // macOS
      || voices.find(v => v.name.toLowerCase().includes('tessa')) // macOS
      || voices.find(v => v.name.toLowerCase().includes('lucia')) // macOS
      || voices.find(v => v.name.toLowerCase().includes('victoria')) // macOS
      || voices.find(v => v.name.toLowerCase().includes('alice')) // macOS
      || voices.find(v => v.name.toLowerCase().includes('anya')) // macOS
      || voices.find(v => v.name.toLowerCase().includes('joanna')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('ivy')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('emma')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('mia')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('amy')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('nicole')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('salli')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('kimberly')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('kendra')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('raveena')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('aditi')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('carla')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('lupe')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('marlene')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('vicki')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('zeina')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('zhiyu')) // AWS Polly
      || voices.find(v => v.name.toLowerCase().includes('female'));
    if (femaleVoice) utter.voice = femaleVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
}

// Speak the current Surya Namaskar (cycle) completion phrase with a female voice if available
function speakCycle(number) {
  if ('speechSynthesis' in window) {
    const phrase = `${number} SuryaNamaskar`;
    const utter = new SpeechSynthesisUtterance(phrase);
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.gender === 'female' || v.name.toLowerCase().includes('woman') || v.voiceURI.toLowerCase().includes('female'))
      || voices.find(v => v.name.toLowerCase().includes('zira'))
      || voices.find(v => v.name.toLowerCase().includes('susan'))
      || voices.find(v => v.name.toLowerCase().includes('samantha'))
      || voices.find(v => v.name.toLowerCase().includes('karen'))
      || voices.find(v => v.name.toLowerCase().includes('moira'))
      || voices.find(v => v.name.toLowerCase().includes('tessa'))
      || voices.find(v => v.name.toLowerCase().includes('lucia'))
      || voices.find(v => v.name.toLowerCase().includes('victoria'))
      || voices.find(v => v.name.toLowerCase().includes('alice'))
      || voices.find(v => v.name.toLowerCase().includes('anya'))
      || voices.find(v => v.name.toLowerCase().includes('joanna'))
      || voices.find(v => v.name.toLowerCase().includes('ivy'))
      || voices.find(v => v.name.toLowerCase().includes('emma'))
      || voices.find(v => v.name.toLowerCase().includes('mia'))
      || voices.find(v => v.name.toLowerCase().includes('amy'))
      || voices.find(v => v.name.toLowerCase().includes('nicole'))
      || voices.find(v => v.name.toLowerCase().includes('salli'))
      || voices.find(v => v.name.toLowerCase().includes('kimberly'))
      || voices.find(v => v.name.toLowerCase().includes('kendra'))
      || voices.find(v => v.name.toLowerCase().includes('raveena'))
      || voices.find(v => v.name.toLowerCase().includes('aditi'))
      || voices.find(v => v.name.toLowerCase().includes('carla'))
      || voices.find(v => v.name.toLowerCase().includes('lupe'))
      || voices.find(v => v.name.toLowerCase().includes('marlene'))
      || voices.find(v => v.name.toLowerCase().includes('vicki'))
      || voices.find(v => v.name.toLowerCase().includes('zeina'))
      || voices.find(v => v.name.toLowerCase().includes('zhiyu'))
      || voices.find(v => v.name.toLowerCase().includes('female'));
    if (femaleVoice) utter.voice = femaleVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
}
// ========== Constants ==========
const STEPS_PER_CYCLE = 12;
const HISTORY_KEY = 'suryaNamaskarHistory';

// ========== State ==========
let sessionConfig = {
  cycles: 5,
  stepPause: 5,
  cyclePause: 30
};
let sessionState = null;
let timerInterval = null;
let deleteTargetId = null;
let isPaused = false;

// ========== DOM Elements ==========
const cyclesInput = document.getElementById('cyclesInput');
const stepPauseInput = document.getElementById('stepPauseInput');
const cyclePauseInput = document.getElementById('cyclePauseInput');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const configForm = document.getElementById('configForm');

const sessionSection = document.getElementById('sessionSection');
const cycleStatus = document.getElementById('cycleStatus');
const stepStatus = document.getElementById('stepStatus');
const timerLabel = document.getElementById('timerLabel');
const timerValue = document.getElementById('timerValue');
const progressBar = document.getElementById('progressBar');

const historyList = document.getElementById('historyList');
const deleteConfirm = document.getElementById('deleteConfirm');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

// ========== Event Listeners ==========

// Form submission (start session)
configForm.addEventListener('submit', e => {
  e.preventDefault();
  if (timerInterval) return;
  sessionConfig.cycles = Math.max(0.5, parseFloat(cyclesInput.value));
  sessionConfig.stepPause = Math.max(0, parseFloat(stepPauseInput.value));
  sessionConfig.cyclePause = Math.max(0, parseFloat(cyclePauseInput.value));
  startSession();
});

// Stop session
stopBtn.addEventListener('click', stopSession);

// Pause session
pauseBtn.addEventListener('click', pauseSession);

// Resume session
resumeBtn.addEventListener('click', resumeSession);

// History deletion (delegated)
historyList.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-btn')) {
    deleteTargetId = e.target.dataset.id;
    showDeleteModal();
  }
});

// Confirm/cancel delete
confirmDelete.addEventListener('click', function() {
  if (deleteTargetId) {
    deleteHistoryEntry(deleteTargetId);
    hideDeleteModal();
  }
});
cancelDelete.addEventListener('click', hideDeleteModal);

// ========== Session Logic ==========

function startSession() {
  sessionState = {
    currentCycle: 1,
    currentStep: 1,
    isCyclePause: false,
    totalSeconds: 0,
    startedAt: new Date()
  };
  isPaused = false;
  updateSessionUI();
  configForm.querySelectorAll('input').forEach(input => input.disabled = true);
  
  // Hide start button and navigation
  startBtn.classList.add('hidden');
  document.getElementById('historyBtn').classList.add('hidden');
  document.getElementById('homeBtn').classList.add('hidden');
  
  // Show session controls and section
  pauseBtn.classList.remove('hidden');
  stopBtn.classList.remove('hidden');
  sessionSection.classList.remove('hidden');
  configSection.classList.add('hidden');
  
  nextStep();
}

function stopSession() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = false;
  
  // Hide session controls and section
  sessionSection.classList.add('hidden');
  pauseBtn.classList.add('hidden');
  resumeBtn.classList.add('hidden');
  stopBtn.classList.add('hidden');
  
  // Show configuration and navigation
  configSection.classList.remove('hidden');
  startBtn.classList.remove('hidden');
  document.getElementById('historyBtn').classList.remove('hidden');
  
  configForm.querySelectorAll('input').forEach(input => input.disabled = false);
  sessionState = null;
  resetSessionUI();
}

function pauseSession() {
  if (!sessionState || isPaused) return;
  
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = true;
  
  // Switch buttons
  pauseBtn.classList.add('hidden');
  resumeBtn.classList.remove('hidden');
  
  // Update timer label
  timerLabel.textContent = 'Paused';
}

function resumeSession() {
  if (!sessionState || !isPaused) return;
  
  isPaused = false;
  
  // Switch buttons
  resumeBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');
  
  // Resume the timer - need to continue from where we left off
  nextStep();
}

function nextStep() {
  if (!sessionState || isPaused) return;

  // Step mode
  if (!sessionState.isCyclePause) {
    if (sessionState.currentStep > STEPS_PER_CYCLE) {
      // Completed one Surya Namaskar (cycle)
      speakCycle(sessionState.currentCycle); // Speak the cycle number
      sessionState.isCyclePause = true;
      sessionState.currentStep = 1;
      updateSessionUI();
      startTimer(sessionConfig.cyclePause, 'Cycle Pause', () => {
        sessionState.isCyclePause = false;
        sessionState.currentCycle++;
        
        // Handle fractional cycles
        const totalSteps = sessionConfig.cycles * STEPS_PER_CYCLE;
        const completedSteps = (sessionState.currentCycle - 1) * STEPS_PER_CYCLE;
        
        if (completedSteps >= totalSteps) {
          finishSession();
        } else {
          updateSessionUI();
          nextStep();
        }
      });
    } else {
      // Check if we've reached the fractional cycle limit
      const totalSteps = sessionConfig.cycles * STEPS_PER_CYCLE;
      const completedSteps = (sessionState.currentCycle - 1) * STEPS_PER_CYCLE + sessionState.currentStep - 1;
      
      if (completedSteps >= totalSteps) {
        finishSession();
        return;
      }
      
      updateSessionUI();
      speakStep(sessionState.currentStep); // Speak the step number
      
      // Step pause phase
      if (sessionConfig.stepPause > 0) {
        startTimer(sessionConfig.stepPause, `Step Pause`, () => {
          sessionState.currentStep++;
          nextStep();
        });
      } else {
        sessionState.currentStep++;
        nextStep();
      }
    }
  }
}

// Timer logic
function startTimer(duration, label, callback) {
  let secondsLeft = duration;
  timerLabel.textContent = label;
  timerValue.textContent = duration ? formatSeconds(secondsLeft) : '0';
  setProgressBar(0, duration);

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (isPaused) return; // Don't tick when paused
    
    secondsLeft--;
    sessionState.totalSeconds++;
    timerValue.textContent = formatSeconds(secondsLeft);
    setProgressBar(duration - secondsLeft, duration);
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      setProgressBar(duration, duration);
      callback();
    }
  }, 1000);

  // If pause is zero, call callback immediately
  if (duration === 0) {
    callback();
  }
}

function finishSession() {
  clearInterval(timerInterval);
  timerInterval = null;
  saveHistoryEntry({
    date: sessionState.startedAt.toISOString(),
    cycles: sessionConfig.cycles,
    totalTimeSeconds: sessionState.totalSeconds
  });
  stopSession();
  loadHistory();
  showSessionCompleteModal();
}

// Show session complete modal
function showSessionCompleteModal() {
  const modal = document.getElementById('sessionComplete');
  if (modal) modal.classList.remove('hidden');
}

// Hide session complete modal
function hideSessionCompleteModal() {
  const modal = document.getElementById('sessionComplete');
  if (modal) modal.classList.add('hidden');
}

// Add event listener for close button after DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  const closeBtn = document.getElementById('closeSessionComplete');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideSessionCompleteModal);
  }
});

// ========== UI Updates ==========

function updateSessionUI() {
  if (!sessionState) return;
  
  // Calculate progress for fractional cycles
  const totalSteps = sessionConfig.cycles * STEPS_PER_CYCLE;
  const completedSteps = (sessionState.currentCycle - 1) * STEPS_PER_CYCLE + sessionState.currentStep - 1;
  const currentCycleProgress = sessionState.currentCycle + (sessionState.currentStep - 1) / STEPS_PER_CYCLE;
  
  // Display current cycle with decimal if applicable
  const cycleDisplay = sessionConfig.cycles % 1 === 0 ? 
    `${sessionState.currentCycle} / ${sessionConfig.cycles}` :
    `${currentCycleProgress.toFixed(1)} / ${sessionConfig.cycles}`;
    
  cycleStatus.textContent = `Cycle: ${cycleDisplay}`;
  
  if (sessionState.isCyclePause) {
    stepStatus.textContent = `Resting before next cycle...`;
  } else {
    stepStatus.textContent = `Step: ${sessionState.currentStep} / ${STEPS_PER_CYCLE}`;
  }
  
  // Update progress bar for overall session progress
  const overallProgress = Math.min(completedSteps / totalSteps, 1);
  setProgressBar(overallProgress, 1);
}

function resetSessionUI() {
  cycleStatus.textContent = '';
  stepStatus.textContent = '';
  timerLabel.textContent = '';
  timerValue.textContent = '';
  setProgressBar(0, 1);
}

function setProgressBar(value, max) {
  let percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  progressBar.style.width = percent + '%';
}

// ========== History Management ==========

function loadHistory() {
  let history = getHistory();
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = `<li style="color:#888;">No sessions yet.</li>`;
    return;
  }
  history
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="history-info">
          <strong>${entry.cycles} SuryaNamaskar</strong>
          <span class="history-date">${formatDate(entry.date)} &mdash; ${formatSeconds(entry.totalTimeSeconds)} min</span>
        </div>
        <button class="delete-btn" data-id="${entry.id}" title="Delete">&times;</button>
      `;
      historyList.appendChild(li);
    });
}

function saveHistoryEntry(entry) {
  let history = getHistory();
  entry.id = Date.now().toString();
  history.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function deleteHistoryEntry(id) {
  let history = getHistory();
  history = history.filter(e => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  loadHistory();
}

// ========== Utility Functions ==========

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function formatSeconds(total) {
  if (isNaN(total)) return '--:--';
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Delete modal
function showDeleteModal() {
  deleteConfirm.classList.remove('hidden');
}
function hideDeleteModal() {
  deleteConfirm.classList.add('hidden');
  deleteTargetId = null;
}

// ========== Initialization ==========
window.addEventListener('DOMContentLoaded', () => {
  loadHistory();
});