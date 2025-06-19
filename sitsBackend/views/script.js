// document.addEventListener('DOMContentLoaded', function() {
//   const toggle = document.getElementById('nav.toggle');
//   const navLinks = document.getElementById('nav-links');

//   toggle.addEventListener('click', () => {
//     navLinks.classList.toggle('show');
//   });
// });

// document.addEventListener('DOMContentLoaded', function () {
//   const links = document.querySelectorAll('.navbar a');
//   const currentPage = window.location.pathname.split("/").pop(); // e.g., "about.html"

//   links.forEach(link => {
//     const linkPage = link.getAttribute('href');
//     if (linkPage === currentPage) {
//       link.classList.add('active');
//     }
//   });
// });

// /*document.addEventListener('DOMContentLoaded', function() {
    
//     const navToggle = document.createElement('button');
//     navToggle.className = 'nav-toggle';
//     navToggle.innerHTML = '☰';
//     document.querySelector('header').prepend(navToggle);
    
//     navToggle.addEventListener('click', () => {
//         document.querySelector('nav').style.display = 
//             document.querySelector('nav').style.display === 'block' ? 'none' : 'block';
//     });*/

    
//     const words = ['Parents', 'Moms', 'Dads', 'Guardians'];
//     let currentIndex = 0;
//     setInterval(() => {
//         const parentText = document.getElementById('parents-text');
//         parentText.style.opacity = 0;
//         setTimeout(() => {
//             parentText.textContent = words[currentIndex = (currentIndex + 1) % words.length];
//             parentText.style.opacity = 1;
//         }, 500);
//     }, 3000);

    
//    document.querySelectorAll('.sitter-box a').forEach(box => {
//     box.addEventListener('click', () => {
//         window.location.href = 'sitters.html';
//     });
// });


//     document.querySelector('.filter-buttons').addEventListener('click', (e) => {
//         if (e.target.classList.contains('filter-btn')) {
//             document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             const location = e.target.dataset.location;
//             document.querySelectorAll('.sitter').forEach(sitter => {
//                 sitter.style.display = (location === 'all' || sitter.dataset.location === location) ? 'block' : 'none';
//             });
//         }
//     });

    
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', (e) => {
//             e.preventDefault();
//             const target = document.querySelector(anchor.getAttribute('href'));
//             if (target) target.scrollIntoView({ behavior: 'smooth' });
//         });
//     });

    
                          
//     document.querySelector('form[action="subscribe"]')?.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const email = e.target.querySelector('input[type="email"]').value;
//         alert(email.includes('@') ? `Thanks for subscribing with ${email}!` : 'Please enter a valid email');
//         e.target.reset();
//     });
