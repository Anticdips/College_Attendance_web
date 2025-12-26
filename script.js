const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyKlP3lI0FlZcQsYEsXPPc4YFB2qgmD1oNS7LYfxCet3NNzon5YoKYPz8nCtDGgqlaS/exec";

// Nepali date/time
async function getNepaliDateTime() {
  try {
    const res = await fetch("https://nepalidatetimeapi.onrender.com/api/now");
    return await res.json();
  } catch {
    const now = new Date();
    return { nepali_date: now.toLocaleDateString(), nepali_time: now.toLocaleTimeString() };
  }
}

// Auto-fill student name
async function fetchStudentName() {
  const roll = document.getElementById("roll").value.trim();
  const nameField = document.getElementById("name");
  if(!roll){ nameField.value=""; return; }

  try {
    const res = await fetch(`${WEB_APP_URL}?roll=${encodeURIComponent(roll)}`);
    const data = await res.json();
    nameField.value = data.name || "";
  } catch(err){ console.error(err); nameField.value=""; }
}

// Submit attendance
async function submitAttendance() {
  const roll = document.getElementById("roll").value.trim();
  const name = document.getElementById("name").value.trim();
  const subject = document.getElementById("subject").value;
  const status = document.getElementById("status").value;
  const msg = document.getElementById("msg");

  if(!roll || !name || !subject){
    msg.innerText = "⚠️ Please fill all fields!";
    msg.style.color="yellow";
    return;
  }

  msg.innerText="Submitting... ⏳";
  msg.style.color="white";

  try {
    const nepali = await getNepaliDateTime();

    const url = `${WEB_APP_URL}?roll=${encodeURIComponent(roll)}&name=${encodeURIComponent(name)}&subject=${encodeURIComponent(subject)}&status=${encodeURIComponent(status)}&nepaliDate=${encodeURIComponent(nepali.nepali_date)}&nepaliTime=${encodeURIComponent(nepali.nepali_time)}`;

    const res = await fetch(url); // GET request avoids CORS
    const result = await res.json();

    if(result.status==="success"){
      msg.innerText="✅ Attendance Marked!";
      msg.style.color="#00ffcc";
      document.getElementById("roll").value="";
      document.getElementById("name").value="";
      document.getElementById("subject").value="";
      document.getElementById("status").value="Present";
    } else {
      msg.innerText="❌ Server error!";
      msg.style.color="red";
    }

  } catch(err){
    console.error(err);
    msg.innerText="❌ Network error!";
    msg.style.color="red";
  }
}


async function loadSubjects() {
  try {
    const res = await fetch(WEB_APP_URL + "?getSubjects=1");
    const data = await res.json();
    const select = document.getElementById("subject");
    select.innerHTML = '<option value="">Select Subject</option>';
    data.subjects.forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      select.appendChild(opt);
    });
  } catch(err){
    console.error("Error loading subjects:", err);
  }
}

// Call this function when page loads
window.onload = loadSubjects;
