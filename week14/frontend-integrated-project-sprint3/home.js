import { reserveBtn } from './ui.js';
import { loadStudyPlansHome } from './plans.js';

// ================================
// Navigation Logic
// ================================
function goReservePage() {
    window.location.href = './reserve.html';
}

// Bind Event Listener
if (reserveBtn) {
    reserveBtn.addEventListener('click', goReservePage);
}

// ================================
// Init Home Page
// ================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadStudyPlansHome();
});