import React, { useState } from "react";
import { Box, Button, Typography, Grid, Paper, useTheme } from "@mui/material";

const CommunicationCalendar = ({ communications }) => {
  const [date, setDate] = useState(new Date());
  const theme = useTheme();

  // Custom calendar date generation
  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar = [];
    let week = Array(7).fill(null);

    // Fill in empty days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      week[i] = null;
    }

    // Generate days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();

      week[dayOfWeek] = {
        date: currentDate,
        day,
        hasCommunication: communications.some(
          (comm) =>
            new Date(comm.date).toDateString() === currentDate.toDateString()
        ),
      };

      // When the week is full or it's the last day of the month, add to the calendar
      if (dayOfWeek === 6 || day === daysInMonth) {
        calendar.push(week);
        week = Array(7).fill(null);
      }
    }

    return calendar;
  };

  const currentCalendar = generateCalendar(date.getFullYear(), date.getMonth());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const filteredCommunications = communications.filter(
    (comm) =>
      new Date(comm.date).toDateString() === date.toDateString()
  );

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Box
      sx={{
        maxWidth: "900px",
        mx: "auto",
        p: 3,
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 2,
        boxShadow: 3,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Communications on {date.toLocaleDateString()}
      </Typography>

      <Grid container spacing={3}>
        {/* Calendar */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Button
                onClick={() =>
                  handleDateChange(
                    new Date(date.getFullYear(), date.getMonth() - 1, 1)
                  )
                }
                sx={{ textTransform: "none" }}
              >
                {"<"}
              </Button>
              <Typography fontWeight="bold">
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
              <Button
                onClick={() =>
                  handleDateChange(
                    new Date(date.getFullYear(), date.getMonth() + 1, 1)
                  )
                }
                sx={{ textTransform: "none" }}
              >
                {">"}
              </Button>
            </Box>

            <Grid container spacing={1}>
              {daysOfWeek.map((day) => (
                <Grid
                  item
                  xs={1.7}
                  key={day}
                  sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                  {day}
                </Grid>
              ))}
              {currentCalendar.flat().map((dayObj, idx) => (
                <Grid
                  item
                  xs={1.7}
                  key={idx}
                  sx={{
                    p: 1,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor:
                      dayObj && dayObj.date.toDateString() === date.toDateString()
                        ? "primary.main"
                        : "divider",
                    bgcolor: dayObj
                      ? dayObj.hasCommunication
                        ? "primary.light"
                        : "background.default"
                      : "background.paper",
                    cursor: dayObj ? "pointer" : "default",
                    "&:hover": {
                      bgcolor: dayObj ? "action.hover" : "background.paper",
                    },
                  }}
                  onClick={() => dayObj && handleDateChange(dayObj.date)}
                >
                  {dayObj ? dayObj.day : ""}
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Communications List */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            {filteredCommunications.length > 0 ? (
              <Box>
                {filteredCommunications.map((comm, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography fontWeight="bold">
                      {idx + 1}. {comm.type.name} - {comm.company.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {comm.notes}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography
                textAlign="center"
                color="text.secondary"
                py={4}
              >
                No communications on this date
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommunicationCalendar;