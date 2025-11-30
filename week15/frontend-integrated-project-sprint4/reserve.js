import * as API from './api.js';
import { isPeriodActive, creditLimit } from './ui.js';
import { showModal, showConfirmModal } from './dialog.js';
import { handleReserve, handleRemove} from './handle.js';
import { myResList, offeringList, reservedCreditsSpan, limitCreditsSpan } from './ui.js';

let myReservations = [];
let totalCredits = 0;
let userPlanId = null;

export function setUserPlanId(id) { userPlanId = id; }

// ============================================
// Main Load Function
// ============================================
export async function loadReservationPage(studentId) {
    if (!offeringList) return;

    try {
        const [offerRes, myRes] = await Promise.all([
            API.fetchCourseOfferings(),
            API.fetchStudentReservations(studentId)
        ]);

        const offeringsData = await offerRes.json();
        const myResData = myRes.ok ? await myRes.json() : { reservedCourses: [], reservedCredits: 0 };

        myReservations = myResData.reservedCourses || [];
        totalCredits = myResData.reservedCredits || 0;
        const allOfferings = offeringsData.courseOfferings || [];

        myReservations.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
        allOfferings.sort((a, b) => a.courseCode.localeCompare(b.courseCode));

        renderMyReservations();
        renderOfferings(allOfferings, studentId);

    } catch (err) {
        console.error("Load failed:", err);
    }
}

// ============================================
// Render 1: Your Reservations (Text Only)
// ============================================
function renderMyReservations() {
    myResList.innerHTML = '';

    if (reservedCreditsSpan) reservedCreditsSpan.textContent = totalCredits;
    if (limitCreditsSpan) limitCreditsSpan.textContent = creditLimit || 0; 

    if (myReservations.length === 0) {
        myResList.innerHTML = '<div style="color: #666;">No reserved courses yet.</div>';
        return;
    }

    myReservations.forEach(res => {
        const div = document.createElement('div');
        div.dataset.cy = "course-reserved"; 
        div.style.marginBottom = "5px";
        div.style.color = "#333";
        div.innerHTML = `<span data-cy="course-code">${res.courseCode}</span> <span data-cy="course-title">${res.courseTitle}</span> — <span data-cy="course-credits">${res.courseCredits} credits</span>`;
        myResList.appendChild(div);
    });
}

// ============================================
// Render 2: Course Offerings (Cards & Buttons)
// ============================================
function renderOfferings(offerings, studentId) {
    offeringList.innerHTML = '';

    offerings.forEach(course => {
        const card = document.createElement('div');
        card.dataset.cy = "course-offering";
        card.style.border = "1px solid #d9d9d9";
        card.style.padding = "15px";
        card.style.marginBottom = "10px";
        card.style.borderRadius = "6px";
        card.style.backgroundColor = "#fff";
        card.style.display = "flex";
        card.style.justifyContent = "space-between";
        card.style.alignItems = "center";

        // Check Highlight
        const isCore = userPlanId && course.planIds && course.planIds.includes(Number(userPlanId));
        if (isCore) {
            card.style.backgroundColor = "#f0f7ff"; 
            card.style.borderLeft = "4px solid #1890ff"; 
        }

        const infoDiv = document.createElement('div');
        infoDiv.style.display = "flex";
        infoDiv.style.flexDirection = "column";
        
        let coreLabelHtml = '';
        if (isCore) {
            coreLabelHtml = `<div data-cy="course-core" style="color: #1890ff; font-size: 0.85em; margin: 2px 0;">Core course of your plan</div>`;
        }

        infoDiv.innerHTML = `
            <div data-cy="course-code" style="font-weight: bold; color: #000;">${course.courseCode}</div>
            <div data-cy="course-title" style="margin-bottom: 2px;">${course.courseTitle}</div>
            ${coreLabelHtml}
            <div data-cy="course-credits" style="color: #666; font-size: 0.9em;">${course.courseCredits} credits</div>
        `;
        card.appendChild(infoDiv);


        const actionDiv = document.createElement('div');
        actionDiv.style.display = "flex";
        actionDiv.style.gap = "10px";
        actionDiv.style.alignItems = "center";

        if (!isPeriodActive) {
            const msg = document.createElement('span');
            msg.dataset.cy = "message-reserve";
            msg.textContent = "Not in reservation period";
            msg.style.color = "#999";
            msg.style.fontSize = "0.9em";
            actionDiv.appendChild(msg);

        } else {
            const isReserved = myReservations.some(r => r.courseOfferingId === course.id);
            const isOverLimit = (totalCredits + course.courseCredits) > creditLimit;
            const limitDisable = isReserved || isOverLimit;

            const reserveBtn = document.createElement('button');
            reserveBtn.textContent = "Reserve";
            reserveBtn.dataset.cy = "button-reserve";

            reserveBtn.style.padding = "5px 15px";
            reserveBtn.style.borderRadius = "4px";
            reserveBtn.style.border = "none";
            reserveBtn.style.cursor = "pointer";
            
            if (limitDisable) {
                // Disabled (Gray)
                reserveBtn.style.backgroundColor = "#d9d9d9";
                reserveBtn.style.color = "#fff";
                reserveBtn.disabled = true;
                reserveBtn.style.cursor = "not-allowed"; 
            } else {
                // Active (Blue)
                reserveBtn.style.backgroundColor = "#1890ff";
                reserveBtn.style.color = "#fff";
                reserveBtn.disabled = false;
                reserveBtn.style.cursor = "pointer";
                reserveBtn.onclick = () => handleReserve(studentId, course.id);
            }

            // 2. Change Button
            const changeBtn = document.createElement('button');
            changeBtn.textContent = "Change"; 
            changeBtn.dataset.cy = "button-change";
            // Style Base
            changeBtn.style.padding = "5px 15px";
            changeBtn.style.borderRadius = "4px";
            changeBtn.style.border = "none";
            
            if (isReserved) {
                changeBtn.style.backgroundColor = "#faad14";
                changeBtn.style.color = "#fff";
                changeBtn.style.cursor = "pointer";
                
                changeBtn.onclick = () => {
                     const confirmMsg = `Are you sure you want to remove ${course.courseCode} ${course.courseTitle}?`;
                     showConfirmModal(confirmMsg, () => handleRemove(studentId, course.id), "Remove", "Cancel");
                };
            } else {
                // Disabled (Gray)
                changeBtn.style.backgroundColor = "#e6e6e6"; 
                changeBtn.style.color = "#bbb";
                changeBtn.disabled = true;
                changeBtn.style.cursor = "default";
            }

            actionDiv.appendChild(reserveBtn);
            actionDiv.appendChild(changeBtn);
        }

        card.appendChild(actionDiv);
        offeringList.appendChild(card);
    });
}


