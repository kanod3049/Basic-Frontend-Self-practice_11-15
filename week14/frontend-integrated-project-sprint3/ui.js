// ================================
// DOM elements
// ================================
export const tbody = document.getElementById('plans-tbody');
export const reserveBtn = document.querySelector('.ecors-button-manage');

export const fullNameLabel = document.querySelector(".ecors-fullname");
export const declaredText  = document.querySelector(".ecors-declared-plan");

export const dropdownPlans = document.querySelector('.ecors-dropdown-plan');
export const declarebtn = document.querySelector('.ecors-button-declare');
export const logoutbtn = document.querySelector(".ecors-button-signout");

export const changeBtn = document.querySelector(".ecors-button-change")
export const cancelBtn = document.querySelector(".ecors-button-cancel");
export const confirmCancelBtn = document.querySelector('.ecors-button-confirm-cancel');
export const keepBtn = document.querySelector('.ecors-button-keep');

export const dialog = document.querySelector('.ecors-dialog');
export const okButton = document.querySelector('.ecors-button-dialog');
export const message  = document.querySelector('.ecors-dialog-message');

// ================================
// Helper UI functions
// ================================
export function disableDeclareOptions() {
  dropdownPlans.value = '';
  declarebtn.style.display = 'none';
  if (changeBtn) changeBtn.style.display = 'none';
  if (cancelBtn) cancelBtn.style.display = 'none';
}
