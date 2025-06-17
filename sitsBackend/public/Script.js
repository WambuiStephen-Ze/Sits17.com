const BASE_URL = "https://localhost:3000/api";

// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  if (navLinks) {
    navLinks.classList.toggle("open");
  }
}

// Animate parent text (e.g., "Parents", "Moms", etc.)
const handleHomeTextAnimation = () => {
  const words = ['Parents', 'Moms', 'Dads', 'Guardians'];
  const parentText = document.getElementById('parents-text');
  if (!parentText) return;

  let currentIndex = 0;
  setInterval(() => {
    parentText.style.opacity = 0;
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      parentText.textContent = words[currentIndex];
      parentText.style.opacity = 1;
    }, 500);
  }, 3000);
};

// Preview profile picture
const profilePictureReview = () => {
  const fileInput = document.getElementById("profilePic");
  const preview = document.getElementById("preview");

  if (fileInput && preview) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          preview.src = reader.result;
          preview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        preview.style.display = "none";
      }
    });
  }
};

// Password validation before form submission
const passwordValidation = () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      const password = document.getElementById("password")?.value;
      const confirmPassword = document.getElementById("confirmPassword")?.value;

      if (password !== confirmPassword) {
        e.preventDefault();
        alert("Passwords do not match.");
      }
    });
  }
};

// Register user
const registerUser = () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullName = `${document.getElementById("firstname").value} ${document.getElementById("lastname").value}`;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const location = document.getElementById("location")?.value;
    const numberOfChildren = document.getElementById("numKids")?.value;
    const role = window.location.href.includes("signup") ? "sitter" : "parent";

    const userData = {
      name: fullName,
      email,
      password,
      role,
      location,
      numberOfChildren,
    };

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong.");
    }
  });
};

// Login user
const loginUser = () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const role = window.location.search.includes("sitter") ? "sitter" : "parent";
    const endpoint = role === "sitter" ? "/sitters/login" : "/auth/login";

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "index.html"; // Update if needed
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong.");
    }
  });
};

// Highlight active navbar link
const highlightActiveNavLink = () => {
  const navlinks = document.querySelectorAll(".navbar a");
  const currentPage = window.location.pathname.split("/").pop();

  navlinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
};

// Role-based redirect for register link
const updateRegisterLink = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role");
  const registerLink = document.querySelector(".register-link a");

  if (registerLink && role) {
    registerLink.href = role === "parent" ? "register.html" : "signup.html";
  }
};

// Initialize functions on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const isRegisterPage = window.location.pathname.includes("register") || window.location.pathname.includes("signup");
  const isLoginPage = window.location.pathname.includes("login");

  handleHomeTextAnimation();
  profilePictureReview();
  passwordValidation();
  highlightActiveNavLink();
  updateRegisterLink();

  if (isRegisterPage) registerUser();
  if (isLoginPage) loginUser();
});
