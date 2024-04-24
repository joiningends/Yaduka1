import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams } from "react-router-dom";

// Use Poppins font
const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
});

const SetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { number, otp, id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleSnackbarOpen = errorMessage => {
    setError(errorMessage);
    setSnackbarOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validation
    if (!password || !reenteredPassword) {
      handleSnackbarOpen("Please fill in both password fields.");
      return;
    }

    if (password !== reenteredPassword) {
      handleSnackbarOpen("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      handleSnackbarOpen("Password should be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(
        `http://3.6.248.144/api/v1/users/${id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: password,
          }),
        }
      );

      if (response.ok) {
        // If successful, navigate to the Password component
        window.location.href = `/Login`;
      } else {
        // Handle error response
        handleSnackbarOpen(`Error setting password: ${response.status}`);
      }
    } catch (error) {
      handleSnackbarOpen("An error occurred while setting the password.");
      console.error("An error occurred while setting the password:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="xs"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ fontFamily: "Poppins", marginBottom: "20px" }}
        >
          Please Set Your Password
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              style: { fontFamily: "Poppins" },
            }}
          />
          <TextField
            label="Re-enter Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            variant="outlined"
            value={reenteredPassword}
            onChange={e => setReenteredPassword(e.target.value)}
            InputProps={{
              style: { fontFamily: "Poppins" },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={handleShowPasswordToggle}
                color="primary"
              />
            }
            label="View Password"
            style={{ fontFamily: "Poppins", marginTop: "10px" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            style={{
              marginTop: "20px",
              fontFamily: "Poppins",
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
            }}
          >
            Set Password
          </Button>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="error"
            onClose={handleCloseSnackbar}
          >
            {error}
          </MuiAlert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default SetPasswordPage;
