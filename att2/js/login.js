document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userType = document.getElementById('userType').value;
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // Show error function
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Remove any existing error message
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Insert error message after the form
        document.querySelector('.login-form').appendChild(errorDiv);
    }

    // Admin credentials
    const adminCredentials = {
        username: "admin",
        password: "admin123"
    };

    // Faculty credentials
    const facultyCredentials = [
        { username: "faculty1", password: "faculty123" },
        { username: "teacher1", password: "teacher123" }
    ];

    // Student credentials
    const studentCredentials = [
        { username: "student1", password: "student123" },
        { username: "student2", password: "student456" },
        { username: "student3", password: "student789" }
    ];
    
    switch(userType) {
        case 'admin':
            if(username === adminCredentials.username && password === adminCredentials.password) {
                window.location.href = 'dashboard/admin.html';  // Changed from 'admin.html' to 'dashboard/admin.html'
            } else {
                showError('Invalid admin credentials! Please check your username and password.');
            }
            break;
        case 'faculty':
            const facultyFound = facultyCredentials.find(f => 
                f.username === username && f.password === password
            );
            if(facultyFound) {
                window.location.href = 'dashboard/faculty.html';
            } else {
                showError('Invalid faculty credentials! Please check your username and password.');
            }
            break;
        case 'student':
            const studentFound = studentCredentials.find(s => 
                s.username === username && s.password === password
            );
            if(studentFound) {
                window.location.href = 'dashboard/student.html';
            } else {
                showError('Invalid student credentials! Please check your username and password.');
            }
            break;
        default:
            showError('Please select a user type');
    }
});
