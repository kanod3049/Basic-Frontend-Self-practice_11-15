import { declarebtn, changeBtn, confirmCancelBtn, okButton, dialog, declaredText } from "./ui.js";
import * as API from './api.js';
import { loadDeclaredPlan, loadStudyPlans } from "./plans.js";
import { showModal } from "./dialog.js";
import { loadReservationPage } from "./reserve.js";
// ================================
// Handler: Declare (POST)
// ================================
export async function handleDeclare(studentId, planId) {
    try {
        console.log('Handling Declare -> Plan ID:', planId);

        const res = await API.createDeclaredPlan(studentId, planId); 

        console.log('Declare response status:', res.status);

        if (res.status === 201) {
          const body = await res.json();
          console.log('Created declared plan successfully:', body);

          declarebtn.classList.remove('plan-selected');
          declarebtn.disabled = true;
          
          const newData = await loadDeclaredPlan(studentId);
          await loadStudyPlans(studentId, newData); 
        } else if (res.status === 403) {
            handle403Error();
        } else if (res.status === 409) {
          console.log("Conflict: Already declared.");
          showModal('You may have declared study plan already. Please check again.');
          
          const newData = await loadDeclaredPlan(studentId);
          await loadStudyPlans(studentId, newData);
          
        } else {
          console.error("Declare failed with status:", res.status);
          showModal();
        }

    } catch (err) {
        console.error('Error while declaring plan:', err);
        showModal();
    }
}

// ================================
// Handler: Change (PUT)
// ================================
export async function handleChange(studentId, planId) {
    try {
        console.log('Handling Change -> Plan ID:', planId);

        const res = await API.updateDeclaredPlan(studentId, planId); 

        console.log('Change response status:', res.status);

        if (res.status === 200) {
            showModal('Declaration updated.');
            
            if (changeBtn) {
                changeBtn.disabled = true;            
                changeBtn.classList.remove('plan-selected'); 
            }

            const newData = await loadDeclaredPlan(studentId); 
            await loadStudyPlans(studentId, newData); 
        } else if (res.status === 403) {
            handle403Error(); 
        } else if (res.status === 404) {
            console.log("Error 404: Declared plan missing");
            showModal(`No declared plan found for student with id=${studentId}.`);
            
            declaredText.textContent = `Declaration Status: Not Declared`;
            await loadStudyPlans(studentId, null); 

        } else if (res.status === 409) {
            console.log("Error 409: Plan cancelled");
            showModal('Cannot update the declared plan because it has been cancelled.');
            
            const newData = await loadDeclaredPlan(studentId);
            await loadStudyPlans(studentId, newData);

        } else {
            console.error("Change failed with status:", res.status);
            showModal('There is a problem. Please try again later.');
        }

    } catch (err) {
        console.error('Error changing plan:', err);
        showModal();
    }
}

// ================================
// Handler: Cancel (DELETE)
// ================================
export async function handleCancel(studentId) {
    if (confirmCancelBtn) confirmCancelBtn.disabled = true;
    try {
        console.log('Handling Cancel -> Student ID:', studentId);

        const res = await API.deleteDeclaredPlan(studentId); 

        console.log('Cancel response status:', res.status);

        if (res.status === 200 || res.status === 204) {
            showModal('Declaration cancelled.'); 
            
            const newData = await loadDeclaredPlan(studentId); 
            await loadStudyPlans(studentId, newData); 
        } else if (res.status === 403) {
            handle403Error();    
        } else if (res.status === 404) { 
            showModal(`No declared plan found for student with id=${studentId}.`);
            declaredText.textContent = `Declaration Status: Not Declared`;
            await loadStudyPlans(studentId, null);

        } else if (res.status === 409) {
            showModal('Cannot cancel the declared plan because it is already cancelled.');
            const newData = await loadDeclaredPlan(studentId);
            await loadStudyPlans(studentId, newData);

        } else {
            showModal('There is a problem. Please try again later.');
        }

    } catch (err) {
        console.error('Error cancelling plan:', err);
        showModal();
    }
}

export async function handle403Error() {
    showModal("Cannot perform this action because the reservation period is currently closed.");
    
    dialog.addEventListener('close', () => {
        window.location.reload();
    }, {once : true});

    if (okButton) {
        const newOkBtn = okButton.cloneNode(true);
        okButton.parentNode.replaceChild(newOkBtn, okButton);
        
        newOkBtn.style.display = 'inline-block';
        newOkBtn.textContent = 'OK'; 
        newOkBtn.addEventListener('click', () => {
            dialog.close();
            window.location.reload();
        });
    }
}

export async function handleReserve(studentId, offeringId) {
    try {
        const res = await API.reserveCourse(studentId, offeringId);
        if (res.status === 201) {
            await loadReservationPage(studentId);
        } else if (res.status === 403) {
            handle403Error();
        } else if (res.status === 409) {
            const errData = await res.json();
            showModal(errData.message || "Cannot reserve.");
            await loadReservationPage(studentId);
        } else {
            showModal("Error reserving course.");
        }
    } catch (err) { console.error(err); showModal(); }
}
export async function handleRemove(studentId, offeringId) {
    try {
        const res = await API.removeReservation(studentId, offeringId);

        if (res.status === 200 || res.status === 204) {
            await loadReservationPage(studentId);
        } else if (res.status === 403) {
            showForbiddenModal();
        } else if (res.status === 404) {
            showModal("Reservation not found.");
            await loadReservationPage(studentId);
        } else {
            showModal("Failed to remove course.");
        }
    } catch (err) {
        console.error(err);
        showModal();
    }
}


