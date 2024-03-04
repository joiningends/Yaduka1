import React, { useState } from "react";
import { Button, Container, Grid, Typography, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import cloudImage from "./cloudLogo.svg";
import leftImage from "./Assets/draw2Image.svg";

function Otp() {
  const { number } = useParams();
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      const enteredOtp = otp;
      const mobileNumber = Number(number);

      const response = await fetch(
        "http://13.233.231.174/users/login/for/all/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobileNumber, enteredOtp }),
        }
      );

      if (response.ok) {
        toast.success("Verification successful!");
        window.location.href = `/Password/${number}/${otp}`;
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const mobileNumber = Number(number);

      const response = await fetch(
        "http://13.233.231.174/users/login/for/all/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobileNumber }),
        }
      );

      if (response.ok) {
        toast.success("OTP resent successfully");
      } else {
        toast.error("Failed to resend OTP. Please enter a valid number.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
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
              <Typography className="mb-3">Enter your OTP here</Typography>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Enter your OTP"
                id="otpInput"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
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
                  onClick={handleVerify}
                >
                  Verify Now
                </Button>
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
                  onClick={handleResendOtp}
                >
                  Resend OTP
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

export default Otp;
