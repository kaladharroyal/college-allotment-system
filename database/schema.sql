-- schema.sql
-- Database schema for the Classroom & Exam Allotment System

-- Table for students
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table for faculty members
CREATE TABLE faculty (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table for rooms
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_code VARCHAR(20) UNIQUE NOT NULL,
    building VARCHAR(50) NOT NULL,
    floor INT NOT NULL,
    capacity INT NOT NULL
);

-- Table to manage sections and assign class teachers
CREATE TABLE sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department VARCHAR(50) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    type ENUM('Static', 'Floating') NOT NULL,
    class_teacher_id INT,
    FOREIGN KEY (class_teacher_id) REFERENCES faculty(id),
    UNIQUE (branch, year, section)
);

-- Table for the class timetable
CREATE TABLE timetable (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course VARCHAR(100) NOT NULL,
    faculty_id INT NOT NULL,
    department VARCHAR(50) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    room_id INT NOT NULL,
    day VARCHAR(10) NOT NULL,
    period INT NOT NULL,
    timeslot VARCHAR(50) NOT NULL,
    is_lab BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    UNIQUE (room_id, day, period),
    UNIQUE (faculty_id, day, period)
);

-- Table for exam schedules
CREATE TABLE exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    timeslot VARCHAR(50) NOT NULL,
    room_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Table for exam seating allotment
CREATE TABLE exam_allotment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT NOT NULL,
    student_id INT NOT NULL,
    room_id INT NOT NULL,
    seat_number INT NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    UNIQUE (exam_id, student_id)
);

-- Table for invigilation duties
CREATE TABLE invigilation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT NOT NULL,
    faculty_id INT NOT NULL,
    room_id INT NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    UNIQUE (exam_id, faculty_id),
    UNIQUE (exam_id, room_id)
);

-- Table for faculty duty swap requests
CREATE TABLE swap_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_faculty_id INT NOT NULL,
    to_faculty_id INT NOT NULL,
    exam_id INT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (from_faculty_id) REFERENCES faculty(id),
    FOREIGN KEY (to_faculty_id) REFERENCES faculty(id),
    FOREIGN KEY (exam_id) REFERENCES exams(id)
);

-- Table for student leave applications
CREATE TABLE leave_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Sample Data (for testing)

INSERT INTO students (roll_no, name, department, branch, year, section, password) VALUES
('23CSE001', 'John Doe', 'CSE', 'CSE', 3, 'A', '1234'),
('23ECE015', 'Jane Smith', 'ECE', 'ECE', 2, 'B', '1234');

INSERT INTO faculty (name, email, department, password) VALUES
('Dr. A. Ram', 'ram@college.com', 'CSE', '1234'),
('Prof. S. Jane', 'jane@college.com', 'ECE', '1234'),
('Dr. B. Kevin', 'kevin@college.com', 'AIML', '1234');

INSERT INTO rooms (room_code, building, floor, capacity) VALUES
('LLF-3', 'Lara Block', 4, 60),
('LLF-4', 'Lara Block', 4, 60),
('L-10', 'Lara Block', 1, 30);

-- Admin credentials for the login page
-- Username: admin
-- Password: admin123
