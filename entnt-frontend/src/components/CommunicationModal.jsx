import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, FormControl, InputLabel, useTheme } from '@mui/material';

const CommunicationModal = ({ open, onClose, onSubmit, company }) => {
  const [type, setType] = useState('');
  const [date, setCommunicationDate] = useState('');
  const [notes, setNotes] = useState('');
  const theme = useTheme();

  const handleSubmit = () => {
    const communicationData = {
      company,
      type,
      date,
      notes
    };
    onSubmit(communicationData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: theme.palette.mode === 'dark' ? 2 : 1,
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: 1,
        borderColor: 'divider',
        px: 3,
        py: 2
      }}>
        Log Communication
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Communication Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Communication Type"
          >
            <MenuItem value="LinkedIn Post">LinkedIn Post</MenuItem>
            <MenuItem value="LinkedIn Message">LinkedIn Message</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="Phone Call">Phone Call</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setCommunicationDate(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommunicationModal;
