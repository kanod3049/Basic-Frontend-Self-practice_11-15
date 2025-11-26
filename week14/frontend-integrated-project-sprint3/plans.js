import { 
    tbody,
    declaredText, 
    declarebtn, 
    dropdownPlans, 
    changeBtn,
    cancelBtn, 
    confirmCancelBtn
} from './ui.js';
import { formatBangkok } from './utils.js';
import { showModal, showConfirmModal } from './dialog.js'; // Import Dialog Module
import * as API from './api.js'; // Import All API functions

// ================================
// Homepage study-plans
// ================================
export async function loadStudyPlansHome() {
  try {
    const response = await API.fetchStudyPlans(); 

    if (!response.ok) {
        throw new Error('API request failed with status: ' + response.status);
    }

    const data = await response.json();
    
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = "ecors-row";
        
        const values = [item.id, item.planCode, item.nameEng, item.nameTh];
        const tdclass = ["ecors-id", "ecors-planCode", "ecors-nameEng", "ecors-nameTh"];
        
        values.forEach((value, index) => {
            const td = document.createElement('td');
            td.textContent = value;
            td.className = tdclass[index];
            tr.appendChild(td);
        });

        if (tbody) {
            tbody.appendChild(tr);
        }
    });

  } catch (err) {
    console.error(err);
    showModal(); // Use Dialog Module
  }
}

// ================================
// Load declared plan
// ================================
export async function loadDeclaredPlan(studentId) {
  try {
    const res = await API.fetchDeclaredPlan(studentId); // Use API module

    console.log("Fetching declared plan status:", res.status);
    
    if (res.status === 404) {
      console.log("No declared plan found.");
      declaredText.textContent = `Declaration Status: Not Declared`;
      return null; 
    }

    if (!res.ok) {
      console.error("Error fetching declared plan:", res.status);
      showModal();
      return undefined;
    }

    let data;
    try {
        data = await res.json();
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        declaredText.textContent = `Declaration Status: Not Declared (Data Error)`;
        return null;
    }

    if (!data) {
        console.error("Data is null or undefined");
        declaredText.textContent = `Declaration Status: Not Declared`;
        return null;
    }

    console.log("Declared plan data:", data);

    const formatted = data.updatedAt ? formatBangkok(data.updatedAt) : "N/A";
    console.log("Formatted updatedAt:", formatted);

    const planCode = data.planCode || "?";
    const nameEng = data.nameEng || "Unknown Plan";

    // เช็ค status Backend
    let statusDisplay = 'Declared'; 
    if (data.status && data.status.toUpperCase() === 'CANCELLED') {
        statusDisplay = 'Cancelled';
    }
    declaredText.textContent =
      `Declaration Status: ${statusDisplay} ${planCode} - ${nameEng} plan on ${formatted}`;

    return data; 

  } catch (err) {
    console.error("Error loading declared plan:", err);
    showModal();
  }
}

// ================================
// Load study plans + dropdown + Declare/Change
// ================================
export async function loadStudyPlans(studentId, currentDeclaredPlan = null) {
  // Reset ปุ่ม
  declarebtn.style.display = 'none';
  if(changeBtn) changeBtn.style.display = 'none';
  if(cancelBtn) cancelBtn.style.display = 'none';
  
  declarebtn.disabled = true;
  if(changeBtn) changeBtn.disabled = true;

  try {
    const response = await API.fetchStudyPlans(); // Use API module

    if (!response.ok) {
      console.error("Error fetching study plans:", response.statusText);
      showModal();
      return;
    }

    const data = await response.json();
    console.log("Study plans list:", data);
    
    // ล้าง options เดิม
    dropdownPlans.innerHTML = '<option value="" selected>-- Select Major --</option>';
    data.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.classList.add('ecors-plan-row');
      option.textContent = `${plan.planCode} - ${plan.nameEng}`;
      dropdownPlans.appendChild(option);
    });

    const isDeclared = currentDeclaredPlan && currentDeclaredPlan.status?.toUpperCase() !== 'CANCELLED';
    let currentPlanId = isDeclared ? currentDeclaredPlan.planId : null;
    console.log("Is Declared:", isDeclared, "Current Plan ID:", currentPlanId);

    if (isDeclared) {
        dropdownPlans.value = currentPlanId; 
        if(changeBtn) changeBtn.style.display = 'inline-block';
        if(cancelBtn) {
            cancelBtn.style.display = 'inline-block';
            
            // Bind ปุ่ม Cancel -> เรียก Confirm Dialog
            cancelBtn.onclick = () => {
                const formattedDate = formatBangkok(currentDeclaredPlan.updatedAt);
                const confirmMsg = `You have declared ${currentDeclaredPlan.planCode} - ${currentDeclaredPlan.nameEng} as your plan on ${formattedDate}. <br><b>Are you sure you want to cancel this declaration?<b>`;
                
                // เรียกใช้ Dialog Module พร้อมส่ง callback function
                showConfirmModal(confirmMsg, () => handleCancel(studentId));
            };
        }
    } else {
        dropdownPlans.value = "";
        declarebtn.style.display = 'inline-block';
        if (changeBtn) changeBtn.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'none';
    }

    // Event Listener Dropdown Change
    dropdownPlans.onchange = (event) => {
        const selectedId = Number(event.target.value);
        console.log("Selected ID:", selectedId);

        if (isDeclared) {
            if (changeBtn) {
                if (selectedId && selectedId !== currentPlanId) {
                    changeBtn.disabled = false;
                    changeBtn.classList.add('plan-selected'); 
                } else {
                    changeBtn.disabled = true;
                    changeBtn.classList.remove('plan-selected');
                }
            }
        } else {
            if (selectedId) {
                declarebtn.disabled = false;
                declarebtn.classList.add('plan-selected');
                if (changeBtn) changeBtn.style.display = 'none';
            } else {
                declarebtn.disabled = true;
                declarebtn.classList.remove('plan-selected');
            }
        }
    };

    declarebtn.onclick = () => handleDeclare(studentId, dropdownPlans.value);
    if(changeBtn) changeBtn.onclick  = () => handleChange(studentId, dropdownPlans.value);    

  } catch (err) {
    console.error("Error loading study plans:", err);
    showModal();
  }
}

// ================================
// Handler: Declare (POST)
// ================================
async function handleDeclare(studentId, planId) {
    try {
        console.log('Handling Declare -> Plan ID:', planId);

        const res = await API.createDeclaredPlan(studentId, planId); // Use API module

        console.log('Declare response status:', res.status);

        if (res.status === 201) {
          const body = await res.json();
          console.log('Created declared plan successfully:', body);

          declarebtn.classList.remove('plan-selected');
          declarebtn.disabled = true;
          
          const newData = await loadDeclaredPlan(studentId);
          await loadStudyPlans(studentId, newData); 

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
async function handleChange(studentId, planId) {
    try {
        console.log('Handling Change -> Plan ID:', planId);

        const res = await API.updateDeclaredPlan(studentId, planId); // Use API module

        console.log('Change response status:', res.status);

        if (res.status === 200) {
            showModal('Declaration updated.');
            
            if (changeBtn) {
                changeBtn.disabled = true;            
                changeBtn.classList.remove('plan-selected'); 
            }

            const newData = await loadDeclaredPlan(studentId); 
            await loadStudyPlans(studentId, newData); 
            
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
async function handleCancel(studentId) {
    if (confirmCancelBtn) confirmCancelBtn.disabled = true;
    try {
        console.log('Handling Cancel -> Student ID:', studentId);

        const res = await API.deleteDeclaredPlan(studentId); // Use API module

        console.log('Cancel response status:', res.status);

        if (res.status === 200 || res.status === 204) {
            showModal('Declaration cancelled.'); // Shows alert (since confirm is done)
            
            const newData = await loadDeclaredPlan(studentId); 
            await loadStudyPlans(studentId, newData); 
            
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