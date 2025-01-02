// src/components/Login.jsx
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
  AdminPanelSettings,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useThemeContext();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        formData
      );
      
      // Debug logs
      console.log('Login response:', response.data);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      
      console.log('Stored values:', {
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role")
      });

      // Role-based navigation
      if (response.data.role === "admin") {
        // Redirect admin users to admin login
        alert("Please use admin login for administrator access");
        navigate("/admin-login");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      alert("Error logging in: " + error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: 450,
          padding: 4,
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

        <Box textAlign="center" mb={3}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              marginBottom: 2
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Login to your account
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'text.disabled',
              },
            },
          }}
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
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'text.disabled',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            marginTop: 2,
            color: 'white',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          Login
        </Button>

        <Box
          display="flex"
          justifyContent="space-between"
          mt={3}
        >
          <Button
            startIcon={<AdminPanelSettings />}
            onClick={() => navigate("/admin-login")}
            sx={{ textTransform: 'none' }}
          >
            Admin Login
          </Button>

          <Button
            onClick={() => navigate("/register")}
            sx={{ textTransform: 'none' }}
          >
            Create Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;