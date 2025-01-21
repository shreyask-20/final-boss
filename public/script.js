// Signup Validation
document.getElementById('signup-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const image = document.getElementById('image-upload').files[0];

  // Mobile Number Limiter (10 digits)
  if (mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
  }

  // Password and Confirm Password match validation
  if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
  }

  // Prepare the form data to send
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('mobile', mobile);
  formData.append('password', password);
  formData.append('image', image);

  try {
      const response = await fetch('/signup', {
          method: 'POST',
          body: formData
      });

      const result = await response.json();
      if (result.success) {
          alert('Signup successful! Please login.');
          window.location.href = 'login.html';
      } else {
          alert('Error: ' + result.message);
      }
  } catch (error) {
      console.error('Error during signup:', error);
  }
});

// Login Validation
document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
      const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (result.success) {
          alert('Login successful!');
          window.location.href = 'dashboard.html'; // Redirect to a dashboard or home page
      } else {
          alert('Error: ' + result.message);
      }
  } catch (error) {
      console.error('Error during login:', error);
  }
});
