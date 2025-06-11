// public/register.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    const formData = new FormData(form);  // FormData allows us to work with file inputs as well

    // Collect data to send to the backend366

    const data = {
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      username: formData.get('username'),
      contact: formData.get('contact'),
      email: formData.get('email'),
      password: formData.get('password'),
      location: formData.get('location'),
      numberOfChildren: formData.get('numberOfChildren'),
      profilePic: formData.get('profilePic') // File input
    };

    try {
      // Make the POST request to the backend API for registration
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Registration successful!');
        console.log('User registered:', result);
        // Redirect to login or another page after success (optional)
        window.location.href = '/login'; // Redirect to login page
      } else {
        alert('Registration failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed.');
    }
  });
});

// 

document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();  // Prevent the default form submission

  const form = e.target;  // Get the form element
  const formData = new FormData(form);  // Create FormData from the form element

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      body: formData  // Send FormData as the body of the request
    });

    const result = await response.json();  // Parse the response from the backend

    if (response.ok) {
      alert('Registration successful!');
      window.location.href = '/login';  // Redirect to login page after successful registration
    } else {
      alert('Error: ' + result.message);  // Display error if registration fails
    }
  } catch (err) {
    console.error('Registration error:', err);
    alert('Something went wrong.');
  }
});
