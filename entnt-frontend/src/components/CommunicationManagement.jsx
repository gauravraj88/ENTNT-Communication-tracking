import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Checkbox,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
  Paper,
  Box,
  Typography,
  useTheme
} from "@mui/material";

const CommunicationMethodManagement = () => {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    sequence: "",
    mandatory: false,
  });
  const [editId, setEditId] = useState(null);

  const theme = useTheme();

  const fetchMethods = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/communications`
      );
      setMethods(response.data);
    } catch (error) {
      console.error("Failed to fetch communication methods", error);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/communications/${editId}`,
          form
        );
        setEditId(null);
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/communications`, form);
      }
      setForm({ name: "", description: "", sequence: "", mandatory: false });
      fetchMethods();
    } catch (error) {
      console.error("Failed to save communication method", error);
    }
  };

  const handleEdit = (method) => {
    setForm(method);
    setEditId(method._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/communications/${id}`);
      fetchMethods();
    } catch (error) {
      console.error("Failed to delete communication method", error);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary"
        sx={{ mb: 3 }}
      >
        Communication Method Management
      </Typography>

      {/* Form Section */}
      <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Sequence"
              name="sequence"
              value={form.sequence}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              type="number"
            />
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              control={
                <Checkbox
                  name="mandatory"
                  checked={form.mandatory}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label="Mandatory"
            />
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              sx={{
                height: '100%',
                minHeight: '40px'
              }}
            >
              {editId ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Section */}
      <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sequence</TableCell>
              <TableCell>Mandatory</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {methods.map((method) => (
              <TableRow
                key={method._id}
                sx={{
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                <TableCell>{method.name}</TableCell>
                <TableCell>{method.description}</TableCell>
                <TableCell>{method.sequence}</TableCell>
                <TableCell>{method.mandatory ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleEdit(method)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(method._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>);
};

export default CommunicationMethodManagement;
