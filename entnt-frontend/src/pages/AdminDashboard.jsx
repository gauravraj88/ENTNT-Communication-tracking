import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  Grid,
  Card,
  styled
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Business as BusinessIcon,
  Forum as ForumIcon
} from '@mui/icons-material';
import ThemeToggle from '../components/ThemeToggle';
import CompanyManagement from '../components/CompanyManagement';
import CommunicationMethodManagement from '../components/CommunicationManagement';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  background: theme.palette.background.paper,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[8],
  },
}));

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const statsData = [
    { title: 'Total Companies', value: '150+', icon: <BusinessIcon sx={{ fontSize: 40 }} /> },
    { title: 'Communication Methods', value: '10', icon: <ForumIcon sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      transition: 'all 0.3s ease',
      pt: 2
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        {/* <StyledPaper
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 2,
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box display="flex" alignItems="center">
            <DashboardIcon
              sx={{
                mr: 2,
                color: 'primary.main',
                fontSize: 40,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 },
                }
              }}
            />
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>


          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/analytical-dashboard')}
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              View Analytics
            </Button>
            <ThemeToggle />
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </StyledPaper> */}

        {/* Header */}
        <StyledPaper
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 2,
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 2, sm: 0 } // Add gap when stacked
          }}
        >
          <Box display="flex" alignItems="center">
            <DashboardIcon
              sx={{
                mr: 2,
                color: 'primary.main',
                fontSize: { xs: 30, sm: 40 }, // Smaller icon on mobile
              }}
            />
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem' }, // Smaller text on mobile
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexWrap="wrap" // Allow wrapping on very small screens
            justifyContent={{ xs: 'center', sm: 'flex-end' }}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/analytical-dashboard')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              View Analytics
            </Button>
            <ThemeToggle />
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Logout
            </Button>
          </Box>
        </StyledPaper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <StyledCard>
                <Box
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: 'primary.main',
                      opacity: 0.8
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Company Management Section */}
        <StyledPaper
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 3,
            mb: 4,
          }}
        >
          <Box
            mb={3}
            display="flex"
            alignItems="center"
          >
            <BusinessIcon
              sx={{
                mr: 2,
                color: 'primary.main',
                fontSize: 30
              }}
            />
            <Typography
              variant="h5"
              fontWeight="bold"
              color="text.primary"
            >
              Company Management
            </Typography>
          </Box>
          <CompanyManagement />
        </StyledPaper>

        {/* Communication Method Management Section */}
        <StyledPaper
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 3,
          }}
        >
          <Box
            mb={3}
            display="flex"
            alignItems="center"
          >
            <ForumIcon
              sx={{
                mr: 2,
                color: 'primary.main',
                fontSize: 30
              }}
            />
            <Typography
              variant="h5"
              fontWeight="bold"
              color="text.primary"
            >
              Communication Methods
            </Typography>
          </Box>
          <CommunicationMethodManagement />
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;