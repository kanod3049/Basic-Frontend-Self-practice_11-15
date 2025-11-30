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

// GET: Reservation Periods
// export async function fetchReservationPeriods() {
//     return await fetch(`${API_BASE_URL}/reservation-periods`);
// }

// GET: Course Offerings
// export async function fetchCourseOfferings() {
//     return await fetch(`${API_BASE_URL}/course-offerings-plans`);
// }

// GET: Student Reservations
// export async function fetchStudentReservations(studentId) {
//     return await fetch(`${API_BASE_URL}/students/${studentId}/reservations`);
// }

// POST: Declare Plan
export async function createDeclaredPlan(studentId, planId) {
    return await fetch(`${API_BASE_URL}/students/${studentId}/declared-plan`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ planId: Number(planId) }),
    });
}

// POST: Reserve Course
// export async function reserveCourse(studentId, courseOfferingId) {
//     return await fetch(`${API_BASE_URL}/students/${studentId}/reservations`, {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify({ courseOfferingId: Number(courseOfferingId) })
//     });
// }

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

// DELETE: Remove Reservation
// export async function removeReservation(studentId, courseOfferingId) {
//     return await fetch(`${API_BASE_URL}/students/${studentId}/reservations/${courseOfferingId}`, {
//         method: 'DELETE',
//         headers: headers
//     });
// }

// Mock Data 
const MOCK_PERIODS = {
    currentPeriod: {
        id: 1,
        startDateTime: "2025-11-25T09:00:00", 
        endDateTime: "2025-11-30T18:00:00",
        cumulativeCreditLimit: 9
    },
    nextPeriod: {
        id: 2,
        startDateTime: "2025-12-01T09:00:00",
        endDateTime: "2025-12-05T18:00:00",
        cumulativeCreditLimit: 12
    }
};
export async function fetchReservationPeriods() {
    console.log("⚠️ Using Mock Data for Reservation Periods");
    return new Response(JSON.stringify(MOCK_PERIODS), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
    });
}



export async function fetchCourseOfferings() {

    console.log("⚠️ Using Mock Data: Course Offerings");
    return new Response(JSON.stringify(MOCK_OFFERINGS), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
    });
}


export async function fetchStudentReservations(studentId) {

    console.log("⚠️ Using Mock Data: Student Reservations");
    return new Response(JSON.stringify(MOCK_RESERVATIONS), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
    });
}


let MOCK_OFFERINGS = {
    courseOfferings: [
        {
            id: 1, courseCode: "INT220", courseTitle: "UX Design", courseCredits: 3, 
            planIds: [1, 2], capacity: 64 
        },
        {
            id: 2, courseCode: "INT241", courseTitle: "Data Structures", courseCredits: 3, 
            planIds: [2], capacity: 64
        },
        {
            id: 3, courseCode: "INT221", courseTitle: "Database Systems", courseCredits: 3, 
            planIds: [1], capacity: 64 
        },
        {
            id: 4, courseCode: "GEN111", courseTitle: "Man and Ethics", courseCredits: 3, 
            planIds: [], capacity: 100 
        }
    ]
};

let MOCK_RESERVATIONS = {
    reservedCredits: 3, 
    reservedCourses: [
        {
            courseOfferingId: 1, 
            courseCode: "INT220", 
            courseTitle: "UX Design", 
            courseCredits: 3
        }
    ]
};

export async function reserveCourse(studentId, courseOfferingId) {
    console.log(`⚠️ Mock Reserve: Student ${studentId} reserved offering ${courseOfferingId}`);
    
    return new Promise(resolve => {
        setTimeout(() => {

            const courseToAdd = MOCK_OFFERINGS.courseOfferings.find(c => c.id === Number(courseOfferingId));
            
            if (courseToAdd) {

                const exists = MOCK_RESERVATIONS.reservedCourses.find(r => r.courseOfferingId === courseToAdd.id);
                
                if (!exists) {

                    MOCK_RESERVATIONS.reservedCourses.push({
                        courseOfferingId: courseToAdd.id,
                        courseCode: courseToAdd.courseCode,
                        courseTitle: courseToAdd.courseTitle,
                        courseCredits: courseToAdd.courseCredits
                    });
                    

                    MOCK_RESERVATIONS.reservedCredits += courseToAdd.courseCredits;
                    
                    console.log("✅ Added to Mock DB:", MOCK_RESERVATIONS);
                }
            }

            resolve(new Response(JSON.stringify({ message: "Reserved successfully" }), { 
                status: 201, 
                headers: { 'Content-Type': 'application/json' } 
            }));
        }, 300); 
    });
}


export async function removeReservation(studentId, courseOfferingId) {
    console.log(`⚠️ Mock Remove: Student ${studentId} removed offering ${courseOfferingId}`);
    
    return new Promise(resolve => {
        setTimeout(() => {
     
            const courseToRemove = MOCK_RESERVATIONS.reservedCourses.find(r => r.courseOfferingId === Number(courseOfferingId));
            
            if (courseToRemove) {

                MOCK_RESERVATIONS.reservedCredits -= courseToRemove.courseCredits;

                MOCK_RESERVATIONS.reservedCourses = MOCK_RESERVATIONS.reservedCourses.filter(r => r.courseOfferingId !== Number(courseOfferingId));
                
                console.log("🗑️ Removed from Mock DB:", MOCK_RESERVATIONS);
            }

            resolve(new Response(null, { status: 200 }));
        }, 300);
    });
}