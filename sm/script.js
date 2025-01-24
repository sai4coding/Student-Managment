document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const resultsTable = document.querySelector("#resultsTable tbody");
  const exportPdfButton = document.getElementById("exportPdf");
  const exportExcelButton = document.getElementById("exportExcel");

  let students = JSON.parse(localStorage.getItem("students")) || [];

  function renderStudents() {
      resultsTable.innerHTML = "";
      students.forEach((student) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${student.name}</td>
              <td>${student.roll}</td>
              <td>${student.total}</td>
              <td>${student.percentage}%</td>
              <td>${student.grade}</td>
          `;
          resultsTable.appendChild(row);
      });
  }

  document.getElementById("addStudent").addEventListener("click", () => {
      const name = document.getElementById("name").value.trim();
      const roll = document.getElementById("rollno").value.trim();
      const marks1 = parseFloat(document.getElementById("subject1").value);
      const marks2 = parseFloat(document.getElementById("subject2").value);
      const marks3 = parseFloat(document.getElementById("subject3").value);

      if (!name || !roll || isNaN(marks1) || isNaN(marks2) || isNaN(marks3)) {
          alert("Please fill in all fields correctly!");
          return;
      }

      if (students.some((student) => student.roll === roll)) {
          alert("A student with this roll number already exists!");
          return;
      }

      const total = marks1 + marks2 + marks3;
      const percentage = (total / 300) * 100;
      let grade = percentage >= 90
          ? "A+"
          : percentage >= 80
          ? "A"
          : percentage >= 70
          ? "B+"
          : percentage >= 60
          ? "B"
          : percentage >= 50
          ? "C"
          : "F";

      const student = { name, roll, total, percentage: percentage.toFixed(2), grade };
      students.push(student);
      localStorage.setItem("students", JSON.stringify(students));

      renderStudents();
      studentForm.reset();
      alert("Student added successfully!");
  });

  exportPdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf; // Access jsPDF from the namespace
    const doc = new jsPDF(); // Create a new instance
    
      doc.text("Student Results", 14, 16);
      const headers = [["Name", "Roll Number", "Total Marks", "Percentage", "Grade"]];
      const data = students.map((s) => [s.name, s.roll, s.total, `${s.percentage}%`, s.grade]);
      doc.autoTable({ head: headers, body: data });
      doc.save("Student_Results.pdf");
  });

  exportExcelButton.addEventListener("click", () => {
      let csvContent = "data:text/csv;charset=utf-8,Name,Roll Number,Total Marks,Percentage,Grade\n";
      students.forEach((student) => {
          csvContent += `${student.name},${student.roll},${student.total},${student.percentage}%,${student.grade}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Student_Results.csv");
      link.click();
  });

  renderStudents();
});
