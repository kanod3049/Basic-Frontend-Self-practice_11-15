import { API_BASE_URL } from './config.js';

const headers = { 'Content-Type': 'application/json' };

// GET: All Study Plans
export async function fetchStudyPlans() {
    return await fetch(`${API_BASE_URL}/study-plans`);
}

// GET: Student Declared Plan
export async function fetchDeclaredPlan(studentId) {
    return await fetch(`${API_BASE_URL}/students/${studentId}/declared-plan`);
}

// POST: Declare Plan
export async function createDeclaredPlan(studentId, planId) {
    return await fetch(`${API_BASE_URL}/students/${studentId}/declared-plan`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ planId: Number(planId) }),
    });
}

// PUT: Change Plan
export async function updateDeclaredPlan(studentId, planId) {
    return await fetch(`${API_BASE_URL}/students/${studentId}/declared-plan`, {
        method: 'PUT',  
        headers: headers,
        body: JSON.stringify({ planId: Number(planId) }),
    });
}

// DELETE: Cancel Plan
export async function deleteDeclaredPlan(studentId) {
    return await fetch(`${API_BASE_URL}/students/${studentId}/declared-plan`, {
        method: 'DELETE', 
        headers: headers
    });
}