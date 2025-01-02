import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  useTheme,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  Business as BusinessIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [timeframe, setTimeframe] = useState('month');
  const [communicationData, setCommunicationData] = useState([]);
  const [methodStats, setMethodStats] = useState([]);
  const [overdueData, setOverdueData] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    overdueCompanies: 0,
    averageCommunicationsPerCompany: 0
  });
  const [methodPerformance, setMethodPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];

  const handleBack = () => {
    navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/analytics/communication-stats`,
          {
            params: { timeframe },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setCommunicationData(response.data.communicationData);
        setMethodStats(response.data.methodStats);
        setOverdueData(response.data.overdueData);
        setEngagementMetrics(response.data.engagementMetrics);
        setMethodPerformance(response.data.methodPerformance);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching analytics data');
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeframe]);

  const downloadReport = async (format) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/analytics/download-report`,
        {
          params: { format },
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report');
    }
  };

  const MetricCard = ({ title, value, icon: Icon, color = 'primary.main' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color, mr: 1 }} />
          <Typography color="text.secondary" variant="subtitle2">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AssessmentIcon />
          Analytics Dashboard
        </Typography>
        {/* <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button> */}

        <Button
          variant="outlined"
          onClick={() => navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard')}
          sx={{
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              bgcolor: 'background.paper',
              borderRadius: 1
            }}
          >
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="quarter">Quarter</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => downloadReport('csv')}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => downloadReport('pdf')}
          >
            PDF
          </Button>
        </Box>
      </Box>

      {/* Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Companies"
            value={engagementMetrics.totalCompanies}
            icon={BusinessIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Companies"
            value={engagementMetrics.activeCompanies}
            icon={SpeedIcon}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Overdue Companies"
            value={engagementMetrics.overdueCompanies}
            icon={AssessmentIcon}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Communications"
            value={engagementMetrics.averageCommunicationsPerCompany}
            icon={TimelineIcon}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary'
              }}
            >
              <PieChartIcon color="primary" />
              Communication Methods Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {methodStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary'
              }}
            >
              <TimelineIcon color="primary" />
              Communication Frequency Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={communicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary'
              }}
            >
              <AssessmentIcon color="primary" />
              Overdue Communications by Company
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overdueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="overdueCount"
                  fill={theme.palette.error.main}
                />
                <Bar
                  dataKey="daysOverdue"
                  fill={theme.palette.warning.main}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;