// gemini-chatgpt-frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://chatgpt-1tmy.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify({
          _id: data.user._id,
          username: data.user.username,
        }));

        // Redirect to chat page
        navigate('/chat');
      } else {
        // Handle login failure
        console.error('Login failed:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>
        New user?{' '}
        <a href="/signup" style={styles.link}>
          Register here
        </a>
      </p>
    </div>
  );
};

// Basic styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '1rem',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    padding: '0.7rem',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default Login;
