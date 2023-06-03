import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import Navbar from "./navbar/Navbar";
import mssnLogo from "./../assets/paid.png";
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';

import './verifyPayment.css';

const VerifyPayment = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const ref = params.get("reference");
  const [reference, setReference] = useState("");
  const [studentInfo, setStudentInfo] = useState("");


  const fetchStudentInfo = async (reference) => {
    try {
      const response = await axios.get(`https://git.heroku.com/mssn-portal-backend.git/api/payment/${reference}`);
      setStudentInfo(response.data);
    } catch (err) {
      console.error("this " + err);
    }
  };
  console.log(studentInfo);
  
  useEffect(() => {
    fetchStudentInfo(reference)
  }, []);

  return (
    <div className="payment-page">
      <Navbar />
      <Box
        width='100%'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          paddingTop: 20
        }}
      >
        <Paper elevation={4} sx={{ width: 595 , height: 350}}>
          <Box
            width='100%'
            sx={{
              mt: 5,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <div className="header" style={{ paddingTop: 110, width: '100%' }}>
              <Typography variant="h6" align="center" fontWeight='bold' >
                Payment Verification
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'absolute',
                  width: '100%',
                  top: -10
                }}
              >
                <img style={{ width: 150 }} src={mssnLogo} alt="mssnLogo" />
              </Box>
            </div>
            <hr style={{ width: '70%' }} />

            <div className="message" style={{ width: '70%' }}>
              <Typography variant="h6" align="center">
                Payment Successful!
              </Typography>
              <Typography variant="body1" align="center">
                Student with Registration number {studentInfo?.regno} has made the payment. 
              </Typography>
            </div>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default VerifyPayment;
