import { 
    dialog, 
    message, 
    okButton, 
    confirmCancelBtn, 
    keepBtn 
} from './ui.js';

// ================================
// Dialog Setup 
// ================================
export function initDialogListeners() {
    if (okButton) {
        okButton.addEventListener('click', () => {
          dialog.close();
        });
    }
    
    if (dialog) {
        dialog.addEventListener('close', () => {
          dialog.style.display = 'none';
        });
    }
    
    if (keepBtn) {
        keepBtn.addEventListener('click', () => {
            dialog.close();
        });
    }
}

// ================================
// General Message 
// ================================
export function showModal(texts) {
    message.innerHTML = texts || 'There is a problem. Please try again later.';
    dialog.style.display = 'flex';
    dialog.showModal();

    if(okButton) okButton.style.display = 'inline-block';
    if(confirmCancelBtn) confirmCancelBtn.style.display = 'none';
    if(keepBtn) keepBtn.style.display = 'none';
}

// ================================
// Show Confirmation 
// ================================
export function showConfirmModal(texts, onConfirmCallback) {
    message.innerHTML = texts;
    dialog.style.display = 'flex';
    dialog.showModal();

    if(okButton) okButton.style.display = 'none';                 
    if(confirmCancelBtn) {
        confirmCancelBtn.style.display = 'inline-block'; 
        confirmCancelBtn.classList.add('ecors-button-cancel');
        confirmCancelBtn.disabled = false;
        
        confirmCancelBtn.onclick = () => {
            onConfirmCallback();
        };
    }
    if(keepBtn) keepBtn.style.display = 'inline-block';  
}