function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("open");
}


const handleHomeTextAnimation = () => {
    // Parent text animation
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
}

const passwordValidation = () => {
    // Password validation
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (e) {
            const password = document.getElementById("password")?.value;
            const confirmPassword = document.getElementById("confirmPassword")?.value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                e.preventDefault(); // Stop form submission
            }
        });
    }
}

const profilePictureReview = () => {
    // Profile picture preview
    const fileInput = document.getElementById("profilePic");
    const preview = document.getElementById("preview");

    if (fileInput && preview) {
        fileInput.addEventListener("change", function () {
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();
                reader.addEventListener("load", function () {
                    preview.setAttribute("src", this.result);
                    preview.style.display = "block";
                });
                reader.readAsDataURL(file);
            } else {
                preview.style.display = "none";
            }
        });
    }
}

// Role-based redirect for register link
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get("role");
    const registerLink = document.querySelector(".register-link a");

    if (registerLink && role) {
        if (role === "parent") {
            registerLink.href = "register.html";
        } else if (role === "sitter") {
            registerLink.href = "signup.html";
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    //highlight active navbar link
    const navlinks = document.querySelectorAll('.navbar a');
    const currentPage = window.location.pathname.split("/").pop(); // e.g., "about.html"

    navlinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    handleHomeTextAnimation();
    passwordValidation();
    profilePictureReview()
});