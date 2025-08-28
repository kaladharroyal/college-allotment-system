# app.py
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

# --- Mock Database (In-Memory Data) ---
# In a real application, this would be a connection to a MySQL database.
# This data structure simulates the tables defined in schema.sql.

# Global state to represent the database
db_state = {
    "students": [
        {"id": 1, "roll_no": "23CSE001", "name": "John Doe", "branch": "CSE", "section": "A"},
        {"id": 2, "roll_no": "23ECE015", "name": "Jane Smith", "branch": "ECE", "section": "B"}
    ],
    "faculty": [
        {"id": 101, "email": "ram@college.com", "name": "Dr. A. Ram"},
        {"id": 102, "email": "jane@college.com", "name": "Prof. S. Jane"}
    ],
    "timetables": [
        {"day": "Mon", "period": 1, "subject": "Data Structures", "room": "L-3", "section_type": "Static"},
        {"day": "Mon", "period": 2, "subject": "DBMS", "room": "L-3", "section_type": "Static"},
        {"day": "Mon", "period": 3, "subject": "OS", "room": "L-3", "section_type": "Static"},
        {"day": "Mon", "period": 4, "subject": "CN", "room": "L-3", "section_type": "Static"},
        {"day": "Mon", "period": 5, "subject": "AI Lab", "room": "L-10", "is_lab": True, "section_type": "Static"},
    ],
    "exam_schedules": [
        {"subject": "Data Structures", "date": "2025-09-01", "timeslot": "10:00 AM", "room": "LLF-3", "seat_no": 15},
        {"subject": "DBMS", "date": "2025-09-03", "timeslot": "2:00 PM", "room": "LLF-4", "seat_no": 22}
    ],
    "invigilations": [
        {"faculty_name": "Dr. A. Ram", "subject": "Data Structures", "date": "2025-09-01", "room": "LLF-3"},
        {"faculty_name": "Dr. A. Ram", "subject": "Thermodynamics", "date": "2025-09-03", "room": "L-5"}
    ],
    "leave_requests": [
        {"student_id": "23ECE015", "reason": "Family function", "date": "2025-08-26", "status": "Pending"},
        {"student_id": "23CSE001", "reason": "Fever", "date": "2025-08-25", "status": "Approved"}
    ],
    "sections": [
        {"branch": "CSE", "section": "A", "year": "3rd", "type": "Static", "class_teacher": "Dr. A. Ram"},
        {"branch": "ECE", "section": "B", "year": "2nd", "type": "Floating", "class_teacher": "Prof. S. Jane"}
    ]
}

# --- API Endpoints ---
# These endpoints will serve the dynamic data to the frontend.

@app.route('/api/student/data', methods=['GET'])
def get_student_data():
    """Serves timetable, exam schedule, and leave data for a student."""
    # In a real app, you would use the student's ID to fetch specific data
    return jsonify({
        "timetable": db_state["timetables"],
        "exams": db_state["exam_schedules"]
    })

@app.route('/api/faculty/data', methods=['GET'])
def get_faculty_data():
    """Serves teaching, invigilation, and leave request data for a faculty member."""
    # In a real app, you would use the faculty's ID to fetch specific data
    return jsonify({
        "timetable": db_state["timetables"],
        "invigilations": db_state["invigilations"],
        "leave_requests": db_state["leave_requests"]
    })

@app.route('/api/admin/data', methods=['GET'])
def get_admin_data():
    """Serves all data for the admin dashboard."""
    return jsonify({
        "sections": db_state["sections"],
        "leave_requests": db_state["leave_requests"]
    })

@app.route('/api/admin/update_section', methods=['POST'])
def update_section():
    """Endpoint for admin to update section details."""
    data = request.json
    # Find the section and update it.
    for section in db_state["sections"]:
        if section["branch"] == data["branch"] and section["section"] == data["section"]:
            section["type"] = data["type"]
            section["class_teacher"] = data["class_teacher"]
            # After updating, notify other parts of the system if needed.
            return jsonify({"status": "success", "message": "Section updated successfully."})
    return jsonify({"status": "error", "message": "Section not found."})

@app.route('/api/faculty/swap', methods=['POST'])
def swap_invigilation():
    """Endpoint for faculty to request an invigilation swap."""
    data = request.json
    # Here you would implement the swap request logic, checking for clashes.
    db_state["invigilations"].append({
        "faculty_name": "Request from " + data["from_faculty"],
        "subject": data["subject"],
        "date": data["date"],
        "room": data["room"],
        "status": "Pending"
    })
    return jsonify({"status": "success", "message": "Swap request submitted."})

@app.route('/api/student/leave', methods=['POST'])
def apply_leave():
    """Endpoint for a student to apply for leave."""
    data = request.json
    db_state["leave_requests"].append({
        "student_id": "23CSE001",
        "reason": data["reason"],
        "date": data["date"],
        "status": "Pending"
    })
    return jsonify({"status": "success", "message": "Leave request submitted."})

@app.route('/api/admin/approve_leave', methods=['POST'])
def approve_leave():
    """Endpoint for admin to approve/reject a leave request."""
    data = request.json
    for leave in db_state["leave_requests"]:
        if leave["student_id"] == data["student_id"] and leave["date"] == data["date"]:
            leave["status"] = data["status"]
            return jsonify({"status": "success", "message": "Leave request updated."})
    return jsonify({"status": "error", "message": "Leave request not found."})

# If running locally for testing, uncomment the following line
if __name__ == '__main__':
    app.run(debug=True)
