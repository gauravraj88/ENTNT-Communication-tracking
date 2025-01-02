// src/components/Register.jsx
import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  useTheme
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  EmailOutlined, 
  LockOutlined,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from '../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useThemeContext();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/register`,
        formData
      );
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert("Error registering user: " + error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Paper 
        elevation={10}
        sx={{ 
          width: '100%',
          maxWidth: 450,
          p: 4,
          borderRadius: 3,
          bgcolor: 'background.paper',
          position: 'relative'
        }}
      >
        <IconButton
          onClick={colorMode.toggleColorMode}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>

        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 1
            }}
          >
            Create Account
          </Typography>
          <Typography color="text.secondary">
            Join our platform today
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleInputChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleRegister}
          sx={{ mb: 3 }}
        >
          Register
        </Button>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button
              onClick={() => navigate("/")}
              sx={{ textTransform: 'none' }}
            >
              Login here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;