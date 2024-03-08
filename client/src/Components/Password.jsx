import React, { useState, useEffect } from "react";
import {
  Button,
  InputAdornment,
  TextField,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cloudImage from "./cloudLogo.svg";
import leftImage from "./Assets/draw2Image.svg";
import { useParams } from "react-router-dom";
import axios from "axios";

function Password() {
  const [password, setPassword] = useState("");
  const { number, otp } = useParams();
  const [userData, setUserData] = useState(null);
  console.log(userData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://3.6.248.144/api/v1/users/${number}/getf/by/id/user`
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          toast.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      }
    };

    fetchData();
  }, [number]);

  const handleLogin = async () => {
    try {
      if (!password) {
        toast.error("Password cannot be empty.");
        return;
      }

      const requestBody = {
        mobileNumber: number,
        Otp: otp,
        password: password,
      };

      const response = await axios.post(
        "http://3.6.248.144/api/v1/users/login/for/all",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);

        console.log(response.data);

        if (response.data.role === "coldstorageadmin") {
          window.location.href = "/employee";
        } else if (response.data.role === "manufectureemployee") {
          window.location.href = "/Requisition";
        } else if (response.data.role === "manufectureadmin") {
          window.location.href = "/Requisition";
        } else if (response.data.role === "coldstorageemployee") {
          window.location.href = "/Party";
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to log in. Please try again.");
    }
  };

  const handleSetPassword = () => {
    window.location.href = `/setPassword/${userData.id}/${number}/${otp}`;
  };

  const handleForgotPassword = () => {
    window.location.href = `/forgotPassword/${userData.id}/${number}/${otp}`;
  };

  return (
    <>
      <style>
        {`
          .gradient-custom-2 {
            background: #fccb90;
            background: -webkit-linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);
            background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);
          }
  
          @media (min-width: 768px) {
            .gradient-form {
              height: 100vh !important;
            }
          }
  
          @media (min-width: 769px) {
            .gradient-custom-2 {
              border-top-right-radius: .3rem;
              border-bottom-right-radius: .3rem;
            }
          }
  
          button:focus {
            outline: none;
          }
        `}
      </style>

      <Container className="my-5 gradient-form">
        <Grid container>
          <Grid item xs={6} className="mb-5">
            <div className="d-flex flex-column ms-5">
              <div className="text-center">
                <img
                  src={leftImage}
                  style={{ width: "100%" }}
                  alt="Left Image"
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={6} className="mb-5">
            <div className="d-flex flex-column ms-5">
              <div className="text-center">
                <img
                  src={cloudImage}
                  style={{ width: "185px" }}
                  alt="Cloud Logo"
                />
                <Typography className="mt-2 mb-3 pb-2" variant="h5">
                  Verify Yourself To Proceed
                </Typography>
              </div>

              {userData && userData.password ? (
                <>
                  <Typography className="mb-3">
                    Enter your password here
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Enter your password"
                    id="passwordInput"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <div className="text-center pt-1 mb-3 pb-1">
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        background: "linear-gradient(263deg,#34b6df,#34d0be)",
                        borderRadius: "10px",
                        minHeight: "2rem",
                        maxHeight: "2rem",
                        maxWidth: "95%",
                      }}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  </div>
                  <div className="text-center pt-1 mb-3 pb-1">
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        background: "linear-gradient(263deg,#34b6df,#34d0be)",
                        borderRadius: "10px",
                        minHeight: "2rem",
                        maxHeight: "2rem",
                        maxWidth: "95%",
                      }}
                      onClick={handleForgotPassword}
                    >
                      Forgot Password
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center pt-1 mb-5 pb-1">
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      background: "linear-gradient(263deg,#34b6df,#34d0be)",
                      borderRadius: "10px",
                      minHeight: "2rem",
                      maxHeight: "2rem",
                      maxWidth: "95%",
                    }}
                    onClick={handleSetPassword}
                  >
                    Set Your Password
                  </Button>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Password;
