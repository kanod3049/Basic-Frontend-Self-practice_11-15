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

export const currentMsg = document.querySelector('[data-cy="current-message"]');
export const currentPeriod = document.querySelector('[data-cy="current-period"]');
export const nextMsg = document.querySelector('[data-cy="next-message"]');
export const nextPeriod = document.querySelector('[data-cy="next-period"]');

export const myResList = document.getElementById('my-reservation-list');
export const offeringList = document.getElementById('offering-list');
export const reservedCreditsSpan = document.querySelector('[data-cy="total-reserved-credits"]');
export const limitCreditsSpan = document.querySelector('[data-cy="total-limit-credits"]');
// ================================
// Helper UI functions
// ================================
export function disableDeclareOptions() {
  dropdownPlans.value = '';
  declarebtn.style.display = 'none';
  if (changeBtn) changeBtn.style.display = 'none';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

export let isPeriodActive = false;
export let creditLimit = 0;

export function setPeriodActive(status, limit) {
    isPeriodActive = status;
    creditLimit = limit || 0;
}
