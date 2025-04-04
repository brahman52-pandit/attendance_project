// Dummy subject data
const subjects = [
    { name: "Database Management", attendance: 88, total: 40, present: 35 },
    { name: "Operating Systems", attendance: 92, total: 35, present: 32 },
    { name: "Computer Networks", attendance: 85, total: 38, present: 32 },
    { name: "Web Development", attendance: 90, total: 30, present: 27 }
];

// Populate subject-wise attendance
function populateSubjects() {
    const subjectsList = document.getElementById('subjectsList');
    
    subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
            <h3>${subject.name}</h3>
            <div class="progress-bar">
                <div class="progress" style="width: ${subject.attendance}%"></div>
            </div>
            <p>${subject.attendance}% (${subject.present}/${subject.total} classes)</p>
        `;
        subjectsList.appendChild(card);
    });
}

// Populate attendance history
function populateAttendanceHistory() {
    const attendanceHistory = document.getElementById('attendanceHistory');
    const allAttendance = JSON.parse(localStorage.getItem('allAttendance') || '{}');
    const studentId = 'CSE001'; // This should match the logged-in student's ID

    Object.keys(allAttendance).reverse().forEach(date => {
        allAttendance[date].forEach(record => {
            const studentRecord = record.attendance.find(a => a.rollNo === studentId);
            if (studentRecord) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${date}</td>
                    <td>${record.subject}</td>
                    <td class="status-${studentRecord.status}">${studentRecord.status.toUpperCase()}</td>
                    <td>${studentRecord.remark !== 'No remark' ? studentRecord.remark : '-'}</td>
                `;
                attendanceHistory.appendChild(row);
            }
        });
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    populateSubjects();
    populateAttendanceHistory();
});
