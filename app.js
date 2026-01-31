function register(event) {
  event.preventDefault();

  let name = document.getElementById("logname").value;
  let email = document.getElementById("logemail").value;
  let pass = document.getElementById("logpass").value;
  let cpass = document.getElementById("logCpass").value;

  if (pass !== cpass) {
    Swal.fire("Error", "Passwords do not match", "error");
    return;
  }

  let user = {
    name,
    email,
    pass
  };

  localStorage.setItem("user", JSON.stringify(user));

  Swal.fire("Success", "Account created!", "success").then(() => {
    // Switch to Sign In view
    const container = document.getElementById("container");
    if (container) container.classList.remove("right-panel-active");
  });
}

function login(event) {
  event.preventDefault();

  let email = document.getElementById("loginemail").value;
  let pass = document.getElementById("loginpass").value;

  let user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No account found"
    });
    return;
  }

  if (user.email !== email) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Invalid email"
    });
  }
  else if (user.pass !== pass) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Wrong password"
    });
  }
  else {
    Swal.fire({
      icon: "success",
      title: "Login successful",
      text: "Welcome back!",
      confirmButtonText: "OK"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "dashboard.html";
      }
    });
  }
}


function logout() {
  window.location.href = "index.html";
}


function showTemplates() {
  // Clear previous session data to ensure isolation
  clearSession();

  // UI visibility updates
  document.getElementById("dashboardCards").classList.add("d-none");
  document.getElementById("headingArea").classList.add("d-none");
  document.getElementById("formSteps").classList.remove("d-none");

  // Ensure known overlaps are hidden
  if (document.getElementById("templateArea")) document.getElementById("templateArea").classList.add("d-none");
  if (document.getElementById("cv-preview-container")) document.getElementById("cv-preview-container").classList.add("d-none");

  // Reset form inputs (clean slate)
  resetFormFields();

  // Ensure we initialize step 1
  resetSteps();
}

function clearSession() {
  const keys = ['contactInfo', 'educationInfo', 'experienceInfo', 'skillInfo', 'languageInfo', 'selectedTemplate'];
  keys.forEach(k => localStorage.removeItem(k));

  // Reset in-memory arrays
  experienceArr = [];
  skillArr = [];

  // Clear lists in DOM
  if (document.getElementById("experienceList")) document.getElementById("experienceList").innerHTML = "";
  if (document.getElementById("skillList")) document.getElementById("skillList").innerHTML = "";
}

function resetFormFields() {
  const ids = [
    "phone", "email", "city", "country", "address",
    "degree", "institute", "year",
    "experienceInput", "skillInput",
    "lang1", "lang2", "lang3"
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // Reset Image Preview
  const imgPreview = document.getElementById('profilePreview');
  if (imgPreview) {
    imgPreview.src = "https://via.placeholder.com/100?text=Photo";
  }
}

/* STEP 1 */
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('profilePreview').src = e.target.result;
      document.getElementById('profilePreview').style.borderRadius = "50%";
      document.getElementById('profilePreview').style.objectFit = "cover";
      // We will save to localStorage here or on saveStep1. 
      // Saving on change is safer if they don't click next right away, but Step button logic is fine.
    }
    reader.readAsDataURL(file);
  }
}

function saveStep1() {

  let phone = document.getElementById("phone").value.trim();
  let email = document.getElementById("email").value.trim();
  let city = document.getElementById("city").value.trim();
  let country = document.getElementById("country").value.trim();
  let address = document.getElementById("address").value.trim();

  // Image handling
  const imgSrc = document.getElementById('profilePreview').src;
  // Check if it's the placeholder or a real image
  let finalImage = "";
  if (!imgSrc.includes("via.placeholder")) {
    finalImage = imgSrc;
  }

  if (!phone || !email || !city || !country || !address) {
    Swal.fire({
      icon: "error",
      title: "Required Fields",
      text: "Please fill all contact information fields"
    });
    return;
  }

  let contact = { phone, email, city, country, address, image: finalImage };
  localStorage.setItem("contactInfo", JSON.stringify(contact));

  goNext(1);
}


/* STEP 2 */
function saveStep2() {

  let degree = document.getElementById("degree").value.trim();
  let institute = document.getElementById("institute").value.trim();
  let year = document.getElementById("year").value.trim();

  if (!degree || !institute || !year) {
    Swal.fire({
      icon: "error",
      title: "Required Fields",
      text: "Please fill all education details"
    });
    return;
  }

  let education = { degree, institute, year };
  localStorage.setItem("educationInfo", JSON.stringify(education));

  goNext(2);
}
// end of education

let experienceArr = [];

// Safely attach listener
const expInput = document.getElementById("experienceInput");
if (expInput) {
  expInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();

      let value = this.value.trim();
      if (value === "") return;

      experienceArr.push(value);

      let li = document.createElement("li");
      li.className = "list-group-item";
      li.innerText = value;
      document.getElementById("experienceList").appendChild(li);

      this.value = "";
    }
  });
}

function saveExperience() {
  if (experienceArr.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Experience Required",
      text: "Please add at least one experience point"
    });
    return;
  }

  localStorage.setItem("experienceInfo", JSON.stringify(experienceArr));
  goNext(3);
}
let skillArr = [];

// Safely attach listener
const skiInput = document.getElementById("skillInput");
if (skiInput) {
  skiInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();

      let value = this.value.trim();
      if (value === "") return;

      skillArr.push(value);

      let li = document.createElement("li");
      li.className = "list-group-item";
      li.innerText = value;
      document.getElementById("skillList").appendChild(li);

      this.value = "";
    }
  });
}

function saveSkills() {
  if (skillArr.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Skills Required",
      text: "Please add at least one skill"
    });
    return;
  }
  localStorage.setItem("skillInfo", JSON.stringify(skillArr));
  goNext(4);
}
function saveLanguages() {

  let languages = [
    document.getElementById("lang1").value.trim(),
    document.getElementById("lang2").value.trim(),
    document.getElementById("lang3").value.trim()
  ].filter(l => l !== "");

  if (languages.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Languages Required",
      text: "Please add at least one language"
    });
    return;
  }

  localStorage.setItem("languageInfo", JSON.stringify(languages));

  Swal.fire({
    icon: "success",
    title: "Resume Saved",
    text: "Please select a template to generate your CV."
  }).then(() => {
    showTemplatesArea();
  });
}

function showTemplatesArea() {
  document.getElementById("formSteps").classList.add("d-none");
  document.getElementById("templateArea").classList.remove("d-none");
}

/* ================= NAVIGATION LOGIC ================= */

function goNext(current) {
  // Hide current
  document.getElementById("step" + current).classList.remove("step-active");

  // Show next
  const nextStep = document.getElementById("step" + (current + 1));
  if (nextStep) {
    nextStep.classList.add("step-active");
    updateProgress(current + 1);
  }
}

function goBack(current) { // current is the step index we are ON (e.g., 1 (education) means going back to 0 (contact)? No, current is passed as '1' from step 2 button?)
  // Logic in HTML: step 2 back button calls goBack(1). So we go back TO step 1.
  // Current active is step "current + 1".

  document.getElementById("step" + (current + 1)).classList.remove("step-active");
  document.getElementById("step" + current).classList.add("step-active");
  updateProgress(current);
}

function backToDashboard() {
  document.getElementById("formSteps").classList.add("d-none");
  document.getElementById("dashboardCards").classList.remove("d-none");
  document.getElementById("headingArea").classList.remove("d-none");
}

function updateProgress(stepIndex) {
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    let width = stepIndex * 20; // 5 steps approx
    progressBar.style.width = width + "%";
  }
}

// Duplicate showTemplates removed


function resetSteps() {
  document.querySelectorAll(".form-card").forEach(el => el.classList.remove("step-active"));
  document.getElementById("step1").classList.add("step-active");
  updateProgress(1);
}

/* ================= ACTIONS ================= */

function editCV() {
  Swal.fire({
    title: "Edit Resume?",
    text: "This will take you back to step 1 with your current data.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Edit"
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById("cv-preview-container").classList.add("d-none");
      document.getElementById("templateArea").classList.add("d-none");
      document.getElementById("formSteps").classList.remove("d-none");

      resetSteps();
      loadFormData(); // NEW: Restore data
    }
  });
}

function loadFormData() {
  const contact = JSON.parse(localStorage.getItem("contactInfo"));
  if (contact) {
    document.getElementById("phone").value = contact.phone || "";
    document.getElementById("email").value = contact.email || "";
    document.getElementById("city").value = contact.city || "";
    document.getElementById("country").value = contact.country || "";
    document.getElementById("address").value = contact.address || "";
    if (contact.image) {
      document.getElementById('profilePreview').src = contact.image;
      document.getElementById('profilePreview').style.borderRadius = "50%";
    }
  }

  const education = JSON.parse(localStorage.getItem("educationInfo"));
  if (education) {
    document.getElementById("degree").value = education.degree || "";
    document.getElementById("institute").value = education.institute || "";
    document.getElementById("year").value = education.year || "";
  }

  // Experience, Skills, Langs are tricky because they are lists. 
  // For simplicity in this edit flow, users might need to re-add them or we just keep the array as is 
  // but the UI currently pushes to a list. 
  // Restoring list items to the UI:

  const experience = JSON.parse(localStorage.getItem("experienceInfo")) || [];
  const expList = document.getElementById("experienceList");
  expList.innerHTML = "";
  experienceArr = experience; // Update global array
  experience.forEach(e => {
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.innerText = e;
    expList.appendChild(li);
  });

  const skills = JSON.parse(localStorage.getItem("skillInfo")) || [];
  const skillList = document.getElementById("skillList");
  skillList.innerHTML = "";
  skillArr = skills; // Update global array
  skills.forEach(s => {
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.innerText = s;
    skillList.appendChild(li);
  });

  const languages = JSON.parse(localStorage.getItem("languageInfo")) || [];
  if (languages[0]) document.getElementById("lang1").value = languages[0];
  if (languages[1]) document.getElementById("lang2").value = languages[1];
  if (languages[2]) document.getElementById("lang3").value = languages[2];
}

function deleteCV() {
  Swal.fire({
    title: "Delete Resume?",
    text: "This will clear all your saved data. Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    confirmButtonColor: "#d33"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("contactInfo");
      localStorage.removeItem("educationInfo");
      localStorage.removeItem("experienceInfo");
      localStorage.removeItem("skillInfo");
      localStorage.removeItem("languageInfo");
      localStorage.removeItem("selectedTemplate");

      Swal.fire("Deleted!", "Your resume data has been cleared.", "success").then(() => {
        location.reload();
      });
    }
  });
}

function changeTemplate() {
  document.getElementById("cv-preview-container").classList.add("d-none");
  showTemplatesArea();
}

/* ================= TEMPLATE SELECT ================= */
function selectTemplate(id) {
  // localStorage.setItem("selectedTemplate", id); // Done inside next func or here?
  // Let's do it here
  localStorage.setItem("selectedTemplate", id);

  document.getElementById("templateArea").classList.add("d-none");
  document.getElementById("cv-preview-container").classList.remove("d-none");

  document.querySelectorAll(".cv-template").forEach(t => t.classList.add("d-none"));
  const template = document.getElementById("cv-template-" + id);
  if (template) template.classList.remove("d-none");

  loadCVData(id);
}

/* ================= LOAD DATA INTO TEMPLATE ================= */
function loadCVData(id) {
  const contact = JSON.parse(localStorage.getItem("contactInfo")) || {};
  const education = JSON.parse(localStorage.getItem("educationInfo")) || {};
  const experience = JSON.parse(localStorage.getItem("experienceInfo")) || [];
  const skills = JSON.parse(localStorage.getItem("skillInfo")) || [];
  const languages = JSON.parse(localStorage.getItem("languageInfo")) || [];

  // Update Text Fields (Generic)
  const fields = ['name', 'email', 'phone', 'address'];
  fields.forEach(field => {
    const el = document.getElementById(`t${id}_${field}`);
    if (el) {
      if (field === 'name') el.innerText = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : "Your Name";
      else if (field === 'address') el.innerText = `${contact.city || ""}, ${contact.country || ""}`;
      else el.innerText = contact[field] || "";
    }
  });

  // IMAGE HANDLING
  const imgElement = document.getElementById(`t${id}_img`);
  if (imgElement) {
    if (contact.image) {
      imgElement.src = contact.image;
      imgElement.classList.remove("d-none");
    } else {
      // Placeholder if no image
      imgElement.src = "https://via.placeholder.com/150?text=No+Photo";
    }
  }

  // LIST GENERATORS
  const fillList = (ulId, dataArray) => {
    const ul = document.getElementById(ulId);
    if (!ul) return;
    ul.innerHTML = "";
    dataArray.forEach(item => {
      let li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
  };

  fillList(`t${id}_experience`, experience);
  fillList(`t${id}_skills`, skills);
  fillList(`t${id}_languages`, languages);

  // EDUCATION (Rich HTML)
  const eduBox = document.getElementById(`t${id}_education`);
  if (eduBox) {
    eduBox.innerHTML = `
      <div class="edu-item">
        <h5 style="margin-bottom:0; font-weight:bold;">${education.degree || "Degree Name"}</h5>
        <p style="margin:0; color:var(--text-muted); font-size:0.9em;">
            ${education.institute || "University Name"}
        </p>
        <span class="badge bg-secondary mt-1">${education.year || "Year"}</span>
      </div>
    `;
  }
}
/* ================= THEME & ANIMATION LOGIC ================= */

// Theme Handling
function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    // Change icon
    const btn = document.getElementById("themeToggle");
    if (btn) btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }
}

function toggleTheme() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  const btn = document.getElementById("themeToggle");

  if (isDark) {
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    if (btn) btn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    if (btn) btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }
}

// Window Load
window.onload = () => {
  loadTheme();

  // Template Preview
  const savedTemplate = localStorage.getItem("selectedTemplate");
  if (savedTemplate && document.getElementById("cv-preview-container")) {
    selectTemplate(savedTemplate);
  } else if (document.getElementById("cv-preview-container")) {
    // If on dashboard but no template selected, maybe show template area? 
    // Logic exists in showTemplates()
  }

  // Sliding Form Logic (Index page)
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  const container = document.getElementById('container');

  if (signUpButton && signInButton && container) {
    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
  }

  // Theme Button Listener
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }
};

function downloadPDF() {
  const element = document.querySelector(".cv-template:not(.d-none)");
  // Options for better rendering
  const opt = {
    margin: 0,
    filename: 'my_resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}


