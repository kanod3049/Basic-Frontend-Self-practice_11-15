import { keycloak } from './auth.js';
import { fullNameLabel } from './ui.js';
import { loadDeclaredPlan, loadStudyPlans } from './plans.js';
import { initDialogListeners, showModal } from './dialog.js'; 

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

    if (preferredName) {
        const currentDeclaredData = await loadDeclaredPlan(preferredName);
        await loadStudyPlans(preferredName, currentDeclaredData);
    }

  } catch (err) {
    console.error("Failed to initialize Keycloak:", err);
    showModal();
  }
}

document.addEventListener("DOMContentLoaded", ()=> {
  initApp();
});