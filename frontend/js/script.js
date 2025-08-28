// Classroom & Exam Allotment System - JavaScript

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initializeApp();
});

// App State
let currentUser = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize App
function initializeApp() {
    setupThemeToggle();
    setupLoginForm();
    setupTabs();
    setupLogoutButtons();
    loadMockData();
    
    // Apply saved theme
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
    
    // Show login page by default
    showPage('login-page');
}

// Theme Management
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
        document.documentElement.classList.remove('dark');
        currentTheme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        currentTheme = 'dark';
    }
    
    localStorage.setItem('theme', currentTheme);
}

// Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        selectedPage.classList.remove('hidden');
    }
}

// Login System
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const roleTabs = document.querySelectorAll('.tab-trigger[data-role]');
    
    // Role switching
    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => switchRole(tab.dataset.role));
    });
    
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
}

function switchRole(role) {
    // Update active tab
    document.querySelectorAll('.tab-trigger[data-role]').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-role="${role}"]`).classList.add('active');
    
    // Update form content based on role
    const roleDetails = getRoleDetails(role);
    
    document.querySelector('.current-role-icon').setAttribute('data-lucide', roleDetails.icon);
    document.querySelector('.current-role-title').textContent = roleDetails.title;
    document.querySelector('.current-role-description').textContent = roleDetails.description;
    document.querySelector('.current-identifier-label').textContent = roleDetails.identifierLabel;
    document.getElementById('identifier').placeholder = roleDetails.placeholder;
    document.getElementById('identifier').type = roleDetails.inputType;
    
    const sampleCredentials = document.getElementById('sample-credentials');
    if (roleDetails.sampleCredentials) {
        sampleCredentials.textContent = roleDetails.sampleCredentials;
        sampleCredentials.style.display = 'block';
    } else {
        sampleCredentials.style.display = 'none';
    }
    
    // Reinitialize icons
    lucide.createIcons();
}

function getRoleDetails(role) {
    const roles = {
        student: {
            icon: 'graduation-cap',
            title: 'Student Portal',
            description: 'Access your timetable, exam schedule, and apply for leave',
            identifierLabel: 'Roll Number',
            placeholder: 'Roll Number (e.g., 23CSE001)',
            inputType: 'text',
            sampleCredentials: 'Sample: 23CSE001 / password123'
        },
        faculty: {
            icon: 'users',
            title: 'Faculty Portal',
            description: 'Manage your teaching schedule and invigilation duties',
            identifierLabel: 'Email',
            placeholder: 'Email (e.g., faculty@college.edu)',
            inputType: 'email',
            sampleCredentials: 'Sample: ram@college.edu / password123'
        },
        admin: {
            icon: 'shield',
            title: 'Admin Portal',
            description: 'Complete system administration and management',
            identifierLabel: 'Username',
            placeholder: 'Admin Username',
            inputType: 'text',
            sampleCredentials: 'Sample: admin / admin123'
        }
    };
    
    return roles[role];
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const identifier = formData.get('identifier');
    const password = formData.get('password');
    const activeRole = document.querySelector('.tab-trigger[data-role].active').dataset.role;
    
    // Mock authentication
    if (identifier && password) {
        currentUser = {
            identifier: identifier,
            role: activeRole
        };
        
        showToast('Login Successful', `Welcome to the ${activeRole} dashboard!`, 'success');
        
        // Navigate to appropriate dashboard
        setTimeout(() => {
            showPage(`${activeRole}-dashboard`);
        }, 1000);
    } else {
        showToast('Login Failed', 'Please enter valid credentials', 'error');
    }
}

// Logout
function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
}

function handleLogout() {
    currentUser = null;
    showToast('Logged Out', 'You have been successfully logged out', 'success');
    
    setTimeout(() => {
        showPage('login-page');
        // Reset login form
        document.getElementById('login-form').reset();
    }, 1000);
}

// Tabs Management
function setupTabs() {
    const tabTriggers = document.querySelectorAll('.tab-trigger[data-tab]');
    
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const tabId = trigger.dataset.tab;
            const parentTabs = trigger.closest('.tabs');
            
            // Update active trigger
            parentTabs.querySelectorAll('.tab-trigger[data-tab]').forEach(t => {
                t.classList.remove('active');
            });
            trigger.classList.add('active');
            
            // Update active content
            parentTabs.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            const targetContent = parentTabs.querySelector(`#${tabId}-tab`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
}

// Toast Notifications
function showToast(title, description, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Mock Data Loading
function loadMockData() {
    loadTimetableData();
    loadExamData();
    loadTeachingData();
    loadInvigilationData();
    loadSwapRequests();
    loadRoomData();
    loadFacultyWorkload();
}

// Student Dashboard Data
function loadTimetableData() {
    const timetableContainer = document.getElementById('timetable-container');
    
    const timetableData = [
        {
            day: "Monday",
            periods: [
                { time: "9:00-10:00", subject: "Data Structures", faculty: "Dr. Smith", room: "CS-101", type: "theory" },
                { time: "10:00-11:00", subject: "DBMS", faculty: "Prof. Johnson", room: "CS-102", type: "theory" },
                { time: "11:30-12:30", subject: "OS Lab", faculty: "Dr. Wilson", room: "LAB-3", type: "lab" },
                { time: "12:30-1:30", subject: "OS Lab", faculty: "Dr. Wilson", room: "LAB-3", type: "lab" },
                { time: "2:30-3:30", subject: "Software Engineering", faculty: "Prof. Davis", room: "CS-103", type: "theory" }
            ]
        },
        {
            day: "Tuesday",
            periods: [
                { time: "9:00-10:00", subject: "Computer Networks", faculty: "Dr. Brown", room: "CS-104", type: "theory" },
                { time: "10:00-11:00", subject: "AI/ML", faculty: "Prof. Lee", room: "CS-105", type: "theory" },
                { time: "11:30-12:30", subject: "DBMS Lab", faculty: "Prof. Johnson", room: "LAB-1", type: "lab" },
                { time: "12:30-1:30", subject: "DBMS Lab", faculty: "Prof. Johnson", room: "LAB-1", type: "lab" },
                { time: "2:30-3:30", subject: "FLAT", faculty: "Dr. Taylor", room: "CS-106", type: "theory" }
            ]
        }
    ];
    
    if (timetableContainer) {
        timetableContainer.innerHTML = timetableData.map(day => `
            <div class="academic-card">
                <div class="card-header">
                    <h2 class="card-title text-lg">${day.day}</h2>
                </div>
                <div class="card-content">
                    <div class="space-y-4">
                        ${day.periods.map(period => `
                            <div class="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                <div class="flex items-center gap-4">
                                    <span class="badge ${period.type === 'lab' ? 'status-lab' : 'bg-primary text-primary-foreground'}">
                                        ${period.time}
                                    </span>
                                    <div>
                                        <p class="font-semibold text-foreground">${period.subject}</p>
                                        <p class="text-sm text-muted-foreground">
                                            ${period.faculty} • <i data-lucide="map-pin" class="w-3 h-3 inline mr-1"></i>${period.room}
                                        </p>
                                    </div>
                                </div>
                                ${period.type === 'lab' ? '<span class="status-lab">LAB</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        lucide.createIcons();
    }
}

function loadExamData() {
    const examSchedule = document.getElementById('exam-schedule');
    
    const examData = [
        { subject: "Data Structures", date: "2024-05-15", time: "9:00 AM", room: "EXAM-101", seat: "A-15" },
        { subject: "DBMS", date: "2024-05-18", time: "2:00 PM", room: "EXAM-102", seat: "B-23" },
        { subject: "Operating Systems", date: "2024-05-22", time: "9:00 AM", room: "EXAM-103", seat: "C-07" }
    ];
    
    if (examSchedule) {
        examSchedule.innerHTML = examData.map(exam => `
            <div class="flex items-center justify-between p-4 border border-border rounded-lg">
                <div class="space-y-1">
                    <h4 class="font-semibold text-foreground">${exam.subject}</h4>
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                        <span class="flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3 h-3"></i>
                            ${exam.date}
                        </span>
                        <span class="flex items-center gap-1">
                            <i data-lucide="clock" class="w-3 h-3"></i>
                            ${exam.time}
                        </span>
                        <span class="flex items-center gap-1">
                            <i data-lucide="map-pin" class="w-3 h-3"></i>
                            ${exam.room}
                        </span>
                    </div>
                </div>
                <span class="bg-accent text-accent-foreground badge">
                    Seat: ${exam.seat}
                </span>
            </div>
        `).join('');
        
        lucide.createIcons();
    }
}

// Faculty Dashboard Data
function loadTeachingData() {
    const teachingSchedule = document.getElementById('teaching-schedule');
    
    const teachingData = [
        {
            day: "Monday",
            classes: [
                { time: "9:00-10:00", subject: "Data Structures", section: "CSE-2A", room: "CS-101", students: 45 },
                { time: "11:30-12:30", subject: "DBMS Lab", section: "CSE-2B", room: "LAB-1", students: 30 },
                { time: "2:30-3:30", subject: "Algorithm Design", section: "CSE-3A", room: "CS-103", students: 42 }
            ]
        },
        {
            day: "Tuesday",
            classes: [
                { time: "10:00-11:00", subject: "Data Structures", section: "CSE-2B", room: "CS-102", students: 48 },
                { time: "12:30-1:30", subject: "DBMS", section: "CSE-2A", room: "CS-104", students: 45 },
                { time: "3:30-4:30", subject: "Research Methodology", section: "CSE-4A", room: "CS-105", students: 35 }
            ]
        }
    ];
    
    if (teachingSchedule) {
        teachingSchedule.innerHTML = teachingData.map(day => `
            <div class="academic-card">
                <div class="card-header">
                    <h2 class="card-title text-lg">${day.day}</h2>
                </div>
                <div class="card-content">
                    <div class="space-y-4">
                        ${day.classes.map(classItem => `
                            <div class="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                <div class="flex items-center gap-4">
                                    <span class="bg-primary text-primary-foreground badge">
                                        ${classItem.time}
                                    </span>
                                    <div>
                                        <p class="font-semibold text-foreground">${classItem.subject}</p>
                                        <p class="text-sm text-muted-foreground">
                                            ${classItem.section} • <i data-lucide="map-pin" class="w-3 h-3 inline mr-1"></i>${classItem.room}
                                        </p>
                                    </div>
                                </div>
                                <span class="bg-accent text-accent-foreground badge">
                                    ${classItem.students} students
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        lucide.createIcons();
    }
}

function loadInvigilationData() {
    const invigilationDuties = document.getElementById('invigilation-duties');
    
    const dutyData = [
        { subject: "Mathematics", date: "2024-05-15", time: "9:00 AM - 12:00 PM", room: "EXAM-101", students: 60 },
        { subject: "Physics", date: "2024-05-18", time: "2:00 PM - 5:00 PM", room: "EXAM-102", students: 55 },
        { subject: "Chemistry", date: "2024-05-22", time: "9:00 AM - 12:00 PM", room: "EXAM-103", students: 58 }
    ];
    
    if (invigilationDuties) {
        invigilationDuties.innerHTML = dutyData.map(duty => `
            <div class="flex items-center justify-between p-4 border border-border rounded-lg">
                <div class="space-y-1">
                    <h4 class="font-semibold text-foreground">${duty.subject} Examination</h4>
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                        <span class="flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3 h-3"></i>
                            ${duty.date}
                        </span>
                        <span class="flex items-center gap-1">
                            <i data-lucide="clock" class="w-3 h-3"></i>
                            ${duty.time}
                        </span>
                        <span class="flex items-center gap-1">
                            <i data-lucide="map-pin" class="w-3 h-3"></i>
                            ${duty.room}
                        </span>
                    </div>
                </div>
                <span class="badge" style="background-color: hsl(var(--success)); color: hsl(var(--success-foreground));">
                    ${duty.students} Students
                </span>
            </div>
        `).join('');
        
        lucide.createIcons();
    }
}

function loadSwapRequests() {
    const swapRequests = document.getElementById('swap-requests');
    
    const requestData = [
        {
            id: 1,
            fromFaculty: "Dr. Sarah Wilson",
            subject: "Operating Systems",
            date: "2024-05-20",
            time: "2:00 PM",
            room: "EXAM-104",
            status: "pending"
        }
    ];
    
    if (swapRequests) {
        if (requestData.length > 0) {
            swapRequests.innerHTML = `
                <div class="space-y-4">
                    ${requestData.map(request => `
                        <div class="p-4 border border-border rounded-lg">
                            <div class="flex items-center justify-between mb-3">
                                <div>
                                    <h4 class="font-semibold text-foreground">
                                        Swap Request from ${request.fromFaculty}
                                    </h4>
                                    <p class="text-sm text-muted-foreground">
                                        ${request.subject} • ${request.date} • ${request.time} • ${request.room}
                                    </p>
                                </div>
                                <span class="badge" style="background-color: hsl(var(--warning)); color: hsl(var(--warning-foreground));">
                                    ${request.status}
                                </span>
                            </div>
                            <div class="flex gap-2">
                                <button class="btn-academic" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                                    Accept
                                </button>
                                <button class="btn-outline" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                                    Decline
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            swapRequests.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="refresh-cw" class="w-12 h-12 text-muted-foreground mx-auto mb-4"></i>
                    <p class="text-muted-foreground">No pending swap requests</p>
                </div>
            `;
        }
        
        lucide.createIcons();
    }
}

// Admin Dashboard Data
function loadRoomData() {
    const roomUtilization = document.getElementById('room-utilization');
    
    const roomData = [
        { room: "CS-101", block: "A Block", floor: "1st Floor", capacity: 60, current: 45, utilization: 75 },
        { room: "CS-102", block: "A Block", floor: "1st Floor", capacity: 55, current: 40, utilization: 73 },
        { room: "LAB-1", block: "B Block", floor: "2nd Floor", capacity: 30, current: 28, utilization: 93 },
        { room: "LAB-2", block: "B Block", floor: "2nd Floor", capacity: 30, current: 22, utilization: 73 }
    ];
    
    if (roomUtilization) {
        roomUtilization.innerHTML = `
            <div class="space-y-4">
                ${roomData.map(room => `
                    <div class="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                            <h4 class="font-semibold text-foreground">${room.room}</h4>
                            <p class="text-sm text-muted-foreground">
                                ${room.block} • ${room.floor} • Capacity: ${room.capacity}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium">${room.current}/${room.capacity} occupied</p>
                            <div class="w-24 h-2 bg-muted rounded-full mt-1">
                                <div class="h-full rounded-full ${room.utilization > 85 ? 'bg-destructive' : room.utilization > 70 ? 'bg-warning' : 'bg-success'}" 
                                     style="width: ${room.utilization}%"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function loadFacultyWorkload() {
    const facultyWorkload = document.getElementById('faculty-workload');
    
    const workloadData = [
        { name: "Dr. John Smith", department: "CSE", teaching: 18, invigilation: 6, total: 24 },
        { name: "Prof. Sarah Wilson", department: "CSE", teaching: 15, invigilation: 9, total: 24 },
        { name: "Dr. Mike Brown", department: "ECE", teaching: 12, invigilation: 8, total: 20 },
        { name: "Prof. Lisa Davis", department: "EEE", teaching: 16, invigilation: 4, total: 20 }
    ];
    
    if (facultyWorkload) {
        facultyWorkload.innerHTML = `
            <div class="space-y-4">
                ${workloadData.map(faculty => `
                    <div class="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                            <h4 class="font-semibold text-foreground">${faculty.name}</h4>
                            <p class="text-sm text-muted-foreground">${faculty.department} Department</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm">
                                Teaching: ${faculty.teaching}hrs • Invigilation: ${faculty.invigilation}hrs
                            </p>
                            <p class="text-sm font-medium">Total Workload: ${faculty.total} hours/week</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }