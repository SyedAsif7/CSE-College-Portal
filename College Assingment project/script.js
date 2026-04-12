// ==================== DATABASE ====================
let db = JSON.parse(localStorage.getItem("assignDB") || "[]");
let currentStudent = ""; // store logged-in student PRN

// ==================== SUBJECT LIST ====================
let subjects = {
    "FY": ["EM", "Physics", "Chemistry", "Mechanics", "Graphics", "CPP", "EEE", "BEEE"],
    "SY": ["DSA", "OOP", "M3", "DM", "COA", "DLDM", "OS", "PS", "BHR", "DAA"],
    "TY": ["TOC", "DBMS", "ML", "CN", "BC", "HCI", "SE", "CD"],
    "BE": ["CC", "AI", "IoT", "Blockchain", "DL"]
};

// ==================== LOAD SUBJECTS ====================
function loadSubjects(cls) {
    let sub = document.getElementById("subject");
    if (!sub) return; // if there's no subject select on page
    sub.innerHTML = "";

    if (!cls || !subjects[cls]) return;

    subjects[cls].forEach(s => {
        let option = document.createElement("option");
        option.textContent = s;
        sub.appendChild(option);
    });
}

// Attach event to class select so subject dropdown populates
document.addEventListener("DOMContentLoaded", () => {
    const classSelect = document.getElementById("class");
    if (classSelect) {
        classSelect.addEventListener("change", function () {
            loadSubjects(this.value);
        });
    }

    // For teacher filter select, if teacher subject exists in teacher area
    const filterSelect = document.getElementById("filterSelect");
    if (filterSelect) {
        filterSelect.addEventListener("change", function () {
            const teacherSubject = document.querySelectorAll("#teacherArea #subject")[0];
            if (teacherSubject) {
                teacherSubject.style.display = "inline-block";
                teacherSubject.innerHTML = "";
                if (subjects[this.value]) {
                    subjects[this.value].forEach(s => {
                        let op = document.createElement("option");
                        op.textContent = s;
                        teacherSubject.appendChild(op);
                    });
                }
            }
        });
    }
});

// ==================== STUDENT LOGIN ====================
function studentLogin() {
    let prn = document.getElementById("loginPrn").value;
    let pass = document.getElementById("spass").value;

    if (prn.length > 0 && pass === "123") {
        alert("Login Successful!");
        currentStudent = prn;

        document.getElementById("uploadBox").style.display = "block";
        document.getElementById("studentTableBox").style.display = "block";

        // Prefill upload PRN so student doesn't need to type again
        const up = document.getElementById("uploadPrn");
        if (up) up.value = prn;

        loadStudentTable(prn);
    } else {
        alert("Invalid PRN or Password");
    }
}

// ==================== TEACHER LOGIN ====================
function teacherLogin() {
    let email = document.getElementById("temail").value;
    let pass = document.getElementById("tpass").value;

    if (email === "teacher@gmail.com" && pass === "123") {
        alert("Welcome Teacher!");
        document.getElementById("reviewBox").style.display = "block";
        loadTable();
    } else {
        alert("Invalid Teacher Credentials!");
    }
}

// ==================== FORGOT PASSWORD ====================
function forgotPassword() {
    let id = prompt("Enter your PRN / Email:");
    let data = JSON.parse(localStorage.getItem("assignDB") || "[]");

    let user = data.find(x => x.prn === id);

    if (user) {
        alert("Your password is 123 (Default)");
    } else if (id === "teacher@gmail.com") {
        alert("Teacher Password: 123");
    } else {
        alert("No account found!");
    }
}

// ==================== UPLOAD ASSIGNMENT ====================
function uploadAssignment() {
    db = JSON.parse(localStorage.getItem("assignDB") || "[]");

    let prn = currentStudent; // use login PRN automatically
    let cls = document.getElementById("class").value;
    let subject = document.getElementById("subject").value;
    let file = document.getElementById("filePDF").files[0];

    if (!cls || cls === "Select Class") {
        alert("Please select a class");
        return;
    }

    if (!subject) {
        alert("Please select a subject");
        return;
    }

    if (!file || file.type !== "application/pdf") {
        alert("Only PDF allowed!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        let base64 = e.target.result;

        db.push({
            prn: prn,
            class: cls,
            subject: subject,
            fileName: file.name,
            fileData: base64,
            grade: "",
            remark: ""
        });

        localStorage.setItem("assignDB", JSON.stringify(db));
        alert("Assignment Submitted!");

        loadStudentTable(prn);
    };

    reader.readAsDataURL(file);
}

// ==================== STUDENT TABLE ====================
function loadStudentTable(prn) {
    db = JSON.parse(localStorage.getItem("assignDB") || "[]");

    let table = document.getElementById("studentSubmissionTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Subject</th>
            <th>File</th>
            <th>Action</th>
        </tr>
    `;

    db.forEach((item, index) => {
        if (item.prn === prn) {
            let row = table.insertRow();
            row.insertCell(0).innerHTML = item.subject;
            row.insertCell(1).innerHTML = item.fileName;
            row.insertCell(2).innerHTML =
                `<button onclick="deleteSubmission(${index})">Delete</button> 
                 <button onclick="viewPDF(${index})">View</button>`;
        }
    });
}

// ==================== DELETE ASSIGNMENT ====================
function deleteSubmission(index) {
    if (confirm("Are you sure?")) {
        db = JSON.parse(localStorage.getItem("assignDB") || "[]");
        if (index < 0 || index >= db.length) {
            alert("Invalid index");
            return;
        }
        db.splice(index, 1);
        localStorage.setItem("assignDB", JSON.stringify(db));
        loadStudentTable(currentStudent); // reload student's table
    }
}

// ==================== VIEW PDF ====================
function viewPDF(index) {
    db = JSON.parse(localStorage.getItem("assignDB") || "[]");
    if (index < 0 || index >= db.length) {
        alert("Invalid index");
        return;
    }
    let file = db[index].fileData;
    let newTab = window.open();
    newTab.document.write(`<embed src="${file}" width="100%" height="100%">`);
}

// ==================== UPDATE GRADE ====================
function updateGrade(i, v) {
    db = JSON.parse(localStorage.getItem("assignDB") || "[]");
    if (db[i]) db[i].grade = v;
    localStorage.setItem("assignDB", JSON.stringify(db));
}

// ==================== UPDATE REMARK ====================
function updateRemark(i, v) {
    db = JSON.parse(localStorage.getItem("assignDB") || "[]");
    if (db[i]) db[i].remark = v;
    localStorage.setItem("assignDB", JSON.stringify(db));
}

// ==================== TEACHER TABLE (ALL) ====================
function loadTable() {
    db = JSON.parse(localStorage.getItem("assignDB") || "[]");

    let table = document.getElementById("submissionTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>PRN</th>
            <th>Class</th>
            <th>Subject</th>
            <th>File</th>
            <th>Grade</th>
            <th>Remark</th>
        </tr>
    `;

    db.forEach((item, index) => {
        let row = table.insertRow();
        row.insertCell(0).innerHTML = item.prn;
        row.insertCell(1).innerHTML = item.class;
        row.insertCell(2).innerHTML = item.subject;
        row.insertCell(3).innerHTML =
            `<button onclick="viewPDF(${index})">View PDF</button>`;
        row.insertCell(4).innerHTML =
            `<input value="${item.grade}" onchange="updateGrade(${index}, this.value)">`;
        row.insertCell(5).innerHTML =
            `<input value="${item.remark}" onchange="updateRemark(${index}, this.value)">`;
    });
}

// ==================== TEACHER FILTER BY CLASS ====================
function filterClass() {
    let cls = document.getElementById("filterSelect").value;

    loadSubjects(cls); // load teacher's subject dropdown if present

    let table = document.getElementById("submissionTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>PRN</th>
            <th>Class</th>
            <th>Subject</th>
            <th>File</th>
            <th>Grade</th>
            <th>Remark</th>
        </tr>
    `;

    db.forEach((item, i) => {
        if (item.class === cls) {
            let r = table.insertRow();
            r.insertCell(0).innerText = item.prn;
            r.insertCell(1).innerText = item.class;
            r.insertCell(2).innerText = item.subject;
            r.insertCell(3).innerHTML = `<button onclick="viewPDF(${i})">PDF</button>`;
            r.insertCell(4).innerHTML =
                `<input value="${item.grade}" onchange="updateGrade(${i},this.value)">`;
            r.insertCell(5).innerHTML =
                `<input value="${item.remark}" onchange="updateRemark(${i},this.value)">`;
        }
    });
}

// ==================== DOWNLOAD EXCEL ====================
function downloadExcel() {
    db = JSON.parse(localStorage.getItem("assignDB") || "[]");

    if (db.length === 0) {
        alert("No submissions available!");
        return;
    }

    if (typeof XLSX === "undefined") {
        alert("XLSX library not loaded. Include SheetJS (xlsx.full.min.js) to use this.");
        return;
    }

    let grouped = {};

    db.forEach(item => {
        if (!grouped[item.subject]) grouped[item.subject] = [];
        grouped[item.subject].push({
            PRN: item.prn,
            Class: item.class,
            File_Name: item.fileName,
            Grade: item.grade,
            Remark: item.remark
        });
    });

    let wb = XLSX.utils.book_new();

    for (let sub in grouped) {
        let sheetName = sub.substring(0, 30);
        let ws = XLSX.utils.json_to_sheet(grouped[sub]);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    XLSX.writeFile(wb, "class.xlsx");
}

// ==================== LOGOUT ====================
function logout() {
    location.reload();
}
