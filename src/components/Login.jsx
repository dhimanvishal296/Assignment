import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For routing
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate(); // To navigate to the dashboard

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      // API call to validate the username
      const response = await fetch(`http://hn.algolia.com/api/v1/users/${username}`);
      const data = await response.json();

      if (response.ok && data.username) {
        // Store user details in local storage
        localStorage.setItem('user', JSON.stringify({ username, karma: data.karma }));
        // Navigate to the dashboard
        navigate('/home');
      } else {
        setError('Server error !');
      }
    } catch (err) {
      console.log(err);
      setError('Invalid username or user does not exist.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 300,
        margin: 'auto',
        mt: 10,
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
      💻 Login now!
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          placeholder='belter'
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="text"
          placeholder='enter 12345'
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
