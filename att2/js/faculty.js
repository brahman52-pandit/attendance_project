// Add at the beginning of the file
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const mainContent = document.querySelector('.main-content');

    // Toggle menu with animation
    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    // Menu toggle handler
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking overlay
    overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking links on mobile
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1023) {
                toggleMenu();
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1023) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // Initialize page
    populateStudentList();
});

// Set current date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString();

// Dummy student data
const students = [
    { rollNo: "CSE001", name: "Rahul Sharma" },
    { rollNo: "CSE002", name: "Priya Patel" },
    { rollNo: "CSE003", name: "Amit Kumar" },
    { rollNo: "CSE004", name: "Neha Singh" },
    { rollNo: "CSE005", name: "Raj Malhotra" },
    { rollNo: "CSE006", name: "Anita Desai" },
    { rollNo: "CSE007", name: "Suresh Kumar" },
    { rollNo: "CSE008", name: "Meera Kapoor" },
    { rollNo: "CSE009", name: "Vikram Singh" },
    { rollNo: "CSE010", name: "Pooja Verma" },
    { rollNo: "CSE011", name: "Arun Gupta" },
    { rollNo: "CSE012", name: "Divya Shah" },
    { rollNo: "CSE013", name: "Karan Mehta" },
    { rollNo: "CSE014", name: "Anjali Reddy" },
    { rollNo: "CSE015", name: "Sanjay Joshi" },
    { rollNo: "CSE016", name: "Riya Patel" },
    { rollNo: "CSE017", name: "Deepak Sharma" },
    { rollNo: "CSE018", name: "Kavita Singh" },
    { rollNo: "CSE019", name: "Rohit Kumar" },
    { rollNo: "CSE020", name: "Sneha Gupta" }
];

// Populate student list with checkboxes
function populateStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.setAttribute('data-student-id', student.rollNo);
        
        row.innerHTML = `
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>
                <label class="attendance-checkbox">
                    <input type="checkbox" 
                        name="attendance_${student.rollNo}" 
                        checked 
                        onchange="updateRowStyle(this)">
                    <span class="checkbox-text">Present</span>
                </label>
                <input type="text" 
                    class="remark-input" 
                    name="remark_${student.rollNo}" 
                    placeholder="Add remark (optional)"
                    oninput="updateRowStyle(this)"
                >
            </td>
        `;
        studentList.appendChild(row);
    });
}

// Add function to update row styles
function updateRowStyle(element) {
    const row = element.closest('tr');
    const checkbox = row.querySelector('input[type="checkbox"]');
    const remark = row.querySelector('.remark-input').value;
    const checkboxText = row.querySelector('.checkbox-text');

    // Remove existing classes
    row.classList.remove('absent-row', 'remarked-row');

    // Update checkbox text and row style
    if (!checkbox.checked) {
        row.classList.add('absent-row');
        checkboxText.textContent = 'Absent';
    } else {
        checkboxText.textContent = 'Present';
    }

    if (remark.trim() !== '') {
        row.classList.add('remarked-row');
    }
}

// Handle form submission with remarks
document.getElementById('attendanceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const attendanceData = {
        class: document.getElementById('classSelect').value,
        subject: document.getElementById('subjectSelect').value,
        date: new Date().toLocaleDateString(),
        attendance: []
    };

    // Collect attendance data with remarks
    students.forEach(student => {
        const checkbox = document.querySelector(`input[name="attendance_${student.rollNo}"]`);
        const remark = document.querySelector(`input[name="remark_${student.rollNo}"]`).value;
        attendanceData.attendance.push({
            rollNo: student.rollNo,
            name: student.name,
            status: checkbox.checked ? 'present' : 'absent',
            remark: remark || 'No remark'
        });
    });

    // Save attendance data with date as key
    let allAttendance = JSON.parse(localStorage.getItem('allAttendance') || '{}');
    const dateKey = new Date().toISOString().split('T')[0];
    
    if (!allAttendance[dateKey]) {
        allAttendance[dateKey] = [];
    }
    
    allAttendance[dateKey].push(attendanceData);
    localStorage.setItem('allAttendance', JSON.stringify(allAttendance));

    // Show success message with summary
    let summary = `Attendance Saved Successfully!\n\n`;
    summary += `Date: ${attendanceData.date}\n`;
    summary += `Class: ${attendanceData.class}\n`;
    summary += `Subject: ${attendanceData.subject}\n\n`;
    
    let presentCount = attendanceData.attendance.filter(a => a.status === 'present').length;
    let absentCount = attendanceData.attendance.filter(a => a.status === 'absent').length;
    
    summary += `Present: ${presentCount}\n`;
    summary += `Absent: ${absentCount}\n\n`;

    // Add absent students list
    summary += 'Absent Students:\n';
    attendanceData.attendance
        .filter(student => student.status === 'absent')
        .forEach(student => {
            summary += `- ${student.name} (${student.rollNo})\n`;
        });

    summary += '\nStudents with Remarks:\n';
    attendanceData.attendance
        .filter(student => student.remark && student.remark !== 'No remark')
        .forEach(student => {
            summary += `${student.name} (${student.rollNo}): ${student.remark}\n`;
        });

    alert(summary);
    
    // Optional: Clear remarks after submission
    document.querySelectorAll('.remark-input').forEach(input => input.value = '');
});

// Add function to view saved attendance
function viewSavedAttendance() {
    const allAttendance = JSON.parse(localStorage.getItem('allAttendance') || '{}');
    const dates = Object.keys(allAttendance);
    
    if (dates.length === 0) {
        alert('No attendance records found');
        return;
    }

    let report = 'Saved Attendance Records:\n\n';
    dates.forEach(date => {
        report += `Date: ${date}\n`;
        allAttendance[date].forEach(record => {
            report += `Class: ${record.class}, Subject: ${record.subject}\n`;
            report += `Present: ${record.attendance.filter(a => a.status === 'present').length}\n`;
            report += `Absent: ${record.attendance.filter(a => a.status === 'absent').length}\n\n`;
            
            // Add absent students list
            const absentStudents = record.attendance.filter(a => a.status === 'absent');
            if (absentStudents.length > 0) {
                report += 'Absent Students:\n';
                absentStudents.forEach(student => {
                    report += `- ${student.name} (${student.rollNo})\n`;
                });
                report += '\n';
            }
            
            // Add remarks section
            const remarkedStudents = record.attendance.filter(a => a.remark && a.remark !== 'No remark');
            if (remarkedStudents.length > 0) {
                report += 'Remarks:\n';
                remarkedStudents.forEach(student => {
                    report += `- ${student.name} (${student.rollNo}): ${student.remark}\n`;
                });
            }
            report += '------------------------\n';
        });
    });

    alert(report);
}
