// Show Add Student Modal
function showAddStudent() {
    alert('Add Student functionality will be implemented here');
}

// Show Add Faculty Modal
function showAddFaculty() {
    const modal = document.getElementById('addFacultyModal');
    modal.style.display = "block";
}

// Close modal when clicking (X) or outside
document.querySelector('.close').onclick = function() {
    document.getElementById('addFacultyModal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('addFacultyModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Handle faculty form submission
document.getElementById('addFacultyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const facultyData = {
        name: document.getElementById('facultyName').value,
        id: document.getElementById('facultyId').value,
        email: document.getElementById('facultyEmail').value,
        department: document.getElementById('facultyDepartment').value
    };

    // For now, just show the data in an alert
    alert('Faculty Added Successfully!\n\n' + 
          'Name: ' + facultyData.name + '\n' +
          'ID: ' + facultyData.id + '\n' +
          'Email: ' + facultyData.email + '\n' +
          'Department: ' + facultyData.department);

    // Clear form and close modal
    this.reset();
    document.getElementById('addFacultyModal').style.display = "none";
});

// Generate Report
function generateReport() {
    alert('Report generation functionality will be implemented here');
}

// Load and display attendance reports
function loadAttendanceReports() {
    const allAttendance = JSON.parse(localStorage.getItem('allAttendance') || '{}');
    const reportContent = document.getElementById('attendanceReportContent');
    const filterDate = document.getElementById('filterDate');
    
    // Populate date filter
    const dates = Object.keys(allAttendance);
    filterDate.innerHTML = '<option value="">All Dates</option>';
    dates.forEach(date => {
        filterDate.innerHTML += `<option value="${date}">${date}</option>`;
    });
    
    displayAttendanceReports(allAttendance);
}

function displayAttendanceReports(data) {
    const reportContent = document.getElementById('attendanceReportContent');
    reportContent.innerHTML = '';
    
    Object.keys(data).forEach(date => {
        data[date].forEach(record => {
            const card = document.createElement('div');
            card.className = 'attendance-card';
            
            const presentCount = record.attendance.filter(a => a.status === 'present').length;
            const absentCount = record.attendance.filter(a => a.status === 'absent').length;
            const percentage = ((presentCount / record.attendance.length) * 100).toFixed(2);
            
            card.innerHTML = `
                <h3>${record.class} - ${record.subject}</h3>
                <div class="attendance-details">
                    <div>
                        <strong>Date:</strong> ${date}
                    </div>
                    <div>
                        <strong>Present:</strong> ${presentCount}
                    </div>
                    <div>
                        <strong>Absent:</strong> ${absentCount}
                    </div>
                    <div>
                        <strong>Attendance:</strong> ${percentage}%
                    </div>
                </div>
                <div class="absent-list">
                    <strong>Absent Students:</strong><br>
                    ${record.attendance
                        .filter(a => a.status === 'absent')
                        .map(student => `${student.name} (${student.rollNo})`)
                        .join(', ')}
                </div>
                ${getRemarksList(record.attendance)}
            `;
            
            reportContent.appendChild(card);
        });
    });
}

function getRemarksList(attendance) {
    const remarkedStudents = attendance.filter(a => a.remark && a.remark !== 'No remark');
    if (remarkedStudents.length === 0) return '';
    
    return `
        <div class="remarks-list">
            <strong>Remarks:</strong><br>
            ${remarkedStudents
                .map(student => `${student.name} (${student.rollNo}): ${student.remark}`)
                .join('<br>')}
        </div>
    `;
}

function filterAttendanceReports() {
    const filterClass = document.getElementById('filterClass').value;
    const filterDate = document.getElementById('filterDate').value;
    const allAttendance = JSON.parse(localStorage.getItem('allAttendance') || '{}');
    
    let filteredData = {};
    
    Object.keys(allAttendance).forEach(date => {
        if (filterDate && date !== filterDate) return;
        
        filteredData[date] = allAttendance[date].filter(record => 
            !filterClass || record.class === filterClass
        );
        
        if (filteredData[date].length === 0) {
            delete filteredData[date];
        }
    });
    
    displayAttendanceReports(filteredData);
}

// Add active class to current nav item
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    loadAttendanceReports();
});
