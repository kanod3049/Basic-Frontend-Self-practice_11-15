import { keycloak } from './auth.js';
import { fullNameLabel } from './ui.js';
import { loadDeclaredPlan, loadStudyPlans } from './plans.js';
import { initDialogListeners, showModal } from './dialog.js'; 
import { fetchReservationPeriods } from './api.js';
import { formatBangkok } from './utils.js';
import { currentMsg, currentPeriod, nextMsg, nextPeriod, setPeriodActive } from './ui.js';
import { loadReservationPage, setUserPlanId } from './reserve.js';

// ================================
// Main initialization
// ================================
async function initApp() {
  
  initDialogListeners();

  try {
    const authenticated = await keycloak.init({
      onLoad: "login-required",
    });

    if (!authenticated) {
      console.log("User is NOT authenticated ❌");
      return;
   }
    console.log("User is authenticated ✔");

    // แสดงชื่อเต็ม
    const fullName = keycloak.tokenParsed?.name || "Unknown User";
    console.log("Full Name:", fullName);
    fullNameLabel.textContent = `Welcome, ${fullName}`;

    // อ่าน studentId
    const preferredName = keycloak.tokenParsed?.preferred_username || "No username found";
    console.log("Student ID:", preferredName);

    // fetch reservation periods
    const periodRes = await fetchReservationPeriods();

    if (periodRes.ok) {
      const periodData = await periodRes.json();
      const nowPeriod = periodData.currentPeriod;
      const nextPeri = periodData.nextPeriod;

      if (nowPeriod) {
        setPeriodActive(true, nowPeriod.cumulativeCreditLimit);
        currentMsg.textContent = "Reservation is open";
        currentMsg.style.color = "Green";
        currentPeriod.textContent = `Period: ${formatBangkok(nowPeriod.startDateTime, false)} - ${formatBangkok(nowPeriod.endDateTime)}`;
      } else {
        setPeriodActive(false, 0);
        currentMsg.textContent = "Reservation is closed"
        currentMsg.style.color = "red";
        currentPeriod.textContent = "";
      }

      if (nextPeri) {
        nextMsg.textContent = "Next reservation period";
        nextPeriod.textContent = `Period: ${formatBangkok(nextPeri.startDateTime, false)} - ${formatBangkok(nextPeri.endDateTime)}`;
      } else {
        nextMsg.textContent = "There are no upcoming active reservation periods.";
        nextPeriod.textContent = "";
      }
    } else {
      console.log("Failed to fetch periods");
      setPeriodActive(false,0);
      currentMsg.textContent = "System unavailable";
    }

    if (preferredName) {
        const currentDeclaredData = await loadDeclaredPlan(preferredName);
        await loadStudyPlans(preferredName, currentDeclaredData);

        if (currentDeclaredData) {
        setUserPlanId(currentDeclaredData.planId);
        }
        await loadStudyPlans(preferredName, currentDeclaredData);
    
        await loadReservationPage(preferredName);
    }

  } catch (err) {
    console.error("Failed to initialize Keycloak:", err);
    showModal();
  }
}

document.addEventListener("DOMContentLoaded", ()=> {
  initApp();
});