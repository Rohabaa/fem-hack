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

  Swal.fire("Success", "Account created!", "success");

  document.getElementById("toggle").checked = false;
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
  document.getElementById("dashboardCards").classList.add("d-none");
  document.getElementById("headingArea").classList.add("d-none");
  document.getElementById("formSteps").classList.remove("d-none");
}

/* STEP 1 */
function saveStep1() {

  let contact = {
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    city: document.getElementById("city").value,
    country: document.getElementById("country").value,
    address: document.getElementById("address").value
  };

  localStorage.setItem("contactInfo", JSON.stringify(contact));

  document.getElementById("step1").classList.add("d-none");
  document.getElementById("step2").classList.remove("d-none");
}

/* STEP 2 */
function saveStep2() {

  let education = {
    degree: document.getElementById("degree").value,
    institute: document.getElementById("institute").value,
    year: document.getElementById("year").value
  };

  localStorage.setItem("educationInfo", JSON.stringify(education));

  alert("Education saved ✅\nNext step coming...");
}

