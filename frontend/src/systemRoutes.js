function isStrong(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

function checkPasswordStrength(password) {
  const strengthIndicator = document.getElementById("passwordStrength");
  if (!strengthIndicator) return;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  let text = "Weak";
  let cls = "weak";

  if (strength >= 4) {
    text = "Strong";
    cls = "strong";
  } else if (strength >= 2) {
    text = "Medium";
    cls = "medium";
  }

  strengthIndicator.textContent = `Password strength: ${text}`;
  strengthIndicator.className = "password-strength " + cls;
}

function checkPasswordMatch() {
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirmPassword")?.value;
  const matchIndicator = document.getElementById("passwordMatch");

  if (!matchIndicator) return;

  if (!confirmPassword) {
    matchIndicator.textContent = "";
    return;
  }

  if (password === confirmPassword) {
    matchIndicator.textContent = "✓ Passwords match";
    matchIndicator.className = "password-match match";
  } else {
    matchIndicator.textContent = "✗ Passwords do not match";
    matchIndicator.className = "password-match no-match";
  }
}


/* ================= FORM VALIDATION ================= */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateSignupForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms")?.checked;

  if (!name || !email || !password || !confirmPassword) {
    alert("All fields are required");
    return false;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address");
    return false;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return false;
  }

  if (!isStrong(password)) {
    alert("Password must be strong (Uppercase, lowercase, number, special char)");
    return false;
  }

  if (terms === false) {
    alert("Please accept Terms & Conditions");
    return false;
  }

  return true;
}

function validateLoginForm() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("All fields are required");
    return false;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address");
    return false;
  }

  return true;
}


/* ================= LOGIN ================= */
function login(email, password) {
  const remember = document.getElementById("remember")?.checked;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = "/dashboard";
      } else {
        alert(data.message);
      }
    })
    .catch(() => alert("Login failed"));
}


/* ================= SIGNUP ================= */
function signup(name, email, password) {
  fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    })
    .catch(() => alert("Signup failed"));
}


/* ================= LOGOUT ================= */
function logout() {
  fetch("/logout", { method: "POST" })
    .then(() => {
      window.location.href = "/login";
    });
}


/* ================= EVENT LISTENERS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirmPassword");

  if (passwordField) {
    passwordField.addEventListener("input", () => {
      checkPasswordStrength(passwordField.value);
      checkPasswordMatch();
    });
  }

  if (confirmPasswordField) {
    confirmPasswordField.addEventListener("input", checkPasswordMatch);
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!validateLoginForm()) return;
      
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      login(email, password);
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!validateSignupForm()) return;

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      signup(name, email, password);
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});
