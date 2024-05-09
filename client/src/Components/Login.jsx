import React, { useState } from "react";
import { Button, Container, Grid, Typography, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import cloudImage from "./cloudLogo.svg";
import leftImage from "./Assets/18760.jpg";
import yadukaLogo from "./Assets/yadukaLogoImage.png";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const mobileNumber = Number(phoneNumber);
      const response = await fetch(
        "https://www.keepitcool.app/api/v1/users/login/for/all/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobileNumber }),
        }
      );

      if (response.ok) {
        navigate(`/Otp/${phoneNumber}`);
        toast.success("OTP sent successfully");
      } else {
        toast.error("Failed to send OTP. Please enter a valid number.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed to login. Please try again.");
    }
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
                  style={{
                    width: "100%",
                    mixBlendMode: "multiply", // applying mix-blend-mode directly in the style attribute
                  }}
                  alt="Left Image"
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={6} className="mb-5">
            <div className="d-flex flex-column ms-5">
              <div className="text-center">
                <img
                  src={yadukaLogo}
                  style={{ width: "40vh" }}
                  alt="Cloud Logo"
                />
                <Typography className="mt-2 mb-3 pb-2" variant="h5">
                  Login to Your Account
                </Typography>
              </div>
              <Typography className="mb-3">Enter your phone number</Typography>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Enter your phone number"
                id="phoneNumberInput"
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
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
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Login;
