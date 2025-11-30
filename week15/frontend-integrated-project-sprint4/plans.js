import { 
    tbody,
    declaredText, 
    declarebtn, 
    dropdownPlans, 
    changeBtn,
    cancelBtn, 
    confirmCancelBtn,
    isPeriodActive,
    okButton,
    dialog
} from './ui.js';
import { formatBangkok } from './utils.js';
import { showModal, showConfirmModal } from './dialog.js'; 
import * as API from './api.js'; 
import { handleDeclare, handleChange, handleCancel } from './handle.js';

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
    const res = await API.fetchDeclaredPlan(studentId);

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

    console.log("DEBUG STATE:", {
        isPeriodActive: isPeriodActive,
        isDeclared: isDeclared,
        currentDeclaredPlan: currentDeclaredPlan
    });
    
    if (!isPeriodActive) {
        if (isDeclared) {
            dropdownPlans.value = currentPlanId;
        } else {
            dropdownPlans.value = "";
        }
        dropdownPlans.disabled = true;
        console.log("Reservation closed: Controls disabled");
        return;
    }
    dropdownPlans.disabled = false;

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
                showConfirmModal(confirmMsg, () => handleCancel(studentId), "Cancel Declaration", "Keep Declaration");
            };
        }
    } else {
        dropdownPlans.value = "";
        if (declarebtn) {
            declarebtn.style.display = 'inline-block';
            declarebtn.disabled = true;
        }
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

    if (declarebtn) declarebtn.onclick = () => handleDeclare(studentId, dropdownPlans.value);
    if(changeBtn) changeBtn.onclick  = () => handleChange(studentId, dropdownPlans.value);    

  } catch (err) {
    console.error("Error loading study plans:", err);
    showModal();
  }
}
