import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Tooltip,
  Box,
  Card,
  Paper,
  Container,
  Chip,
  IconButton,
  useTheme
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/Event';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';

import CommunicationModal from "../components/CommunicationModal";
import CommunicationCalendar from "../components/CommunicationCalendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const UserDashboard = () => {
  const [communications, setCommunications] = useState([]);
  const [over, setOver] = useState([]);
  const [today, setToday] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState([]);
  const [selected, setSelected] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useThemeContext();

  const columns = [
    {
      field: "name",
      headerName: "Company Name",
      width: 250,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">{params.row.company.name}</Typography>
      ),
    },
    {
      field: "lastCommunications",
      headerName: "Last 5 Communications",
      width: 350,
      renderCell: (params) => (
        <Tooltip key={params.row._id} title={params.row.notes}>
          <Typography variant="body2" color="text.secondary">{`${params.row.type.name} - ${new Date(
            params.row.date
          ).toLocaleDateString()}`}</Typography>
        </Tooltip>
      ),
    },
    {
      field: "nextCommunication",
      headerName: "Next Scheduled Communication",
      width: 350,
      renderCell: (params) => {
        const date = new Date(params.row.date);
        date.setDate(date.getDate() + 5);
        const updatedDateString = date.toLocaleDateString();
        return (
          <Typography variant="body2" color="text.secondary">{`${params.row.type.name} - ${updatedDateString}`}</Typography>
        );
      },
    },
  ];

  const handleCommunicationPerformed = () => {
    const x = rowSelectionModel;
    let mySet = new Set();
    let arr = [];

    for (let i = 0; i < x.length; i++) {
      mySet.add(x[i].slice(24, x[i].length));
    }

    mySet.forEach((el) => arr.push({ name: el }));

    setSelectedCompanyId(arr);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLogCommunication = (data) => {
    data.company.forEach((el) => {
      setCommunications((prev) => [
        ...prev,
        {
          company: { name: el.name },
          date: data.date,
          type: { name: data.type },
          notes: data.notes,
        },
      ]);
    });
    handleCloseModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const fetchCommsFromAPI = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/communications-user`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching communications:", error);
      return [];
    }
  };

  const fetchNotificationsFromAPI = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/notifications`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const communicationsData = await fetchCommsFromAPI();
      setCommunications(communicationsData);
      const ndata = await fetchNotificationsFromAPI();
      const over = ndata.filter((el) => el.type === "overdue");
      const today = ndata.filter((el) => el.type === "due today");
      setOver(over);
      setToday(today);
    };
    fetchData();
  }, []);

  // Rest of the previous component render method remains the same...
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        <Box py={4}>
          {/* Header */}
          {/* <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              position: 'relative'
            }}
          >
            <Box display="flex" alignItems="center">
              <DashboardIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                User Dashboard
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/analytical-dashboard')}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none"
                }}
              >
                View Analytics
              </Button>
              <IconButton
                onClick={colorMode.toggleColorMode}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
              <Button
                startIcon={<LogoutIcon />}
                variant="contained"
                color="error"
                onClick={handleLogout}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Logout
              </Button>
            </Box>
          </Paper> */}

          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 2, sm: 0 }, // Add gap when stacked
              mb: 4,
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              position: 'relative'
            }}
          >
            <Box display="flex" alignItems="center">
              <DashboardIcon
                sx={{
                  mr: 2,
                  color: "primary.main",
                  fontSize: { xs: 30, sm: 40 } // Smaller icon on mobile
                }}
              />
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary.main"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2rem' } // Smaller text on mobile
                }}
              >
                User Dashboard
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
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                View Analytics
              </Button>
              <IconButton
                onClick={colorMode.toggleColorMode}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
              <Button
                startIcon={<LogoutIcon />}
                variant="contained"
                color="error"
                onClick={handleLogout}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Logout
              </Button>
            </Box>
          </Paper>

          {/* Notification Section */}
          <Box mb={4}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              display="flex"
              alignItems="center"
              color="text.primary"
            >
              <NotificationsActiveIcon sx={{ mr: 2, color: "warning.main" }} />
              Notifications
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <Box p={3}>
                    <Typography variant="h6" fontWeight="bold" color="error.main" gutterBottom>
                      Overdue Communications
                      <Chip
                        label={over.length}
                        color="error"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Typography>
                    {over.length > 0 ? (
                      over.map((x, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {x.company.name} - {x.message}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No overdue communications
                      </Typography>
                    )}
                  </Box>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <Box p={3}>
                    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                      Today's Communications
                      <Chip
                        label={today.length}
                        color="primary"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Typography>
                    {today.length > 0 ? (
                      today.map((x, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {x.company.name} - {x.message}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No communications due today
                      </Typography>
                    )}
                  </Box>
                </StyledCard>
              </Grid>
            </Grid>
          </Box>

          {/* Data Grid */}
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: 'background.paper'
            }}
          >
            <Box
              p={2}
              display="flex"
              alignItems="center"
              borderBottom={1}
              borderColor="divider"
            >
              <EventIcon sx={{ mr: 2, color: "success.main" }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Communication History
              </Typography>
            </Box>
            <DataGrid
              rows={communications}
              getRowId={(row) => row._id + row.company.name}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
                setSelected(newRowSelectionModel.length > 0);
              }}
              rowSelectionModel={rowSelectionModel}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderColor: theme.palette.divider,
                },
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-row:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                }
              }}
            />
          </Paper>

          {/* Communication Button */}
          <Box display="flex" justifyContent="flex-end" mb={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommunicationPerformed}
              disabled={!selected}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                py: 1.5,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              Log Communication
            </Button>
          </Box>

          {/* Communication Modal and Calendar */}
          <CommunicationModal
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={handleLogCommunication}
            company={selectedCompanyId}
          />

          <CommunicationCalendar communications={communications} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDashboard;