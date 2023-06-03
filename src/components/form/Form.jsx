import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

// const apiKey = process.env.TEST_PUBLIC_KEY;
const secretKey ='Bearer sk_live_f169be3d3e2a074033cb34c6c9c92a1f64b0117d';

const Form = () => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [paymentState, setPaymentState] = useState("");
  const [pendingPayment, setPendingPayment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setPendingPayment(50000);
    if (!validateForm()) {
      return;
    }
    initializePayment();
  };

  const initializePayment = async (paymentData) => {
    try {
      const options = {
        method: "post",
        url: "https://api.paystack.co/transaction/initialize",
        headers: {
          Authorization: secretKey,
          "Content-Type": "application/json",
        },
        'subaccount' : 'ACCT_3org68z257h2yhu',
        'transaction_charge': 15000,
        
        // sk_test_a0854fa4e328cbc8e54b86176cdfad5de24787c5
        data: {
          email: email,
          amount: 50000,
          label: `${email}`,
          callback_url: `https://master--kaleidoscopic-arithmetic-c4d519.netlify.app/reciept/`,
        },
      };
  
      const res = await axios(options);
      console.log(res.data.data.reference);
      if (res.data.status) {
        console.log(res.data)
        
        await saveStudent({
          reference: res.data.data.reference,
          amount: 500,
          email: email,
          full_name: name,
          regno: regNo,
          phone: phone,
          course: department,
          level: level,
          status: paymentState,
        })
        window.location.href = `${res.data.data.authorization_url}`;
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const saveStudent = async (data) => {
    const saveStudentOptions = {
      method: "post",
      url: `https://mssn-portal-backend.herokuapp.com/api/students`,
      headers: {
        "Content-Type": "application/json",
      },
      
      data: data
    };
    
    await axios(saveStudentOptions);
    
  }
  const updateStudent = async (reference, status) => {

    
    try {
      const updateStudentOptions = {
        method: "patch",
        url: `https://mssn-portal-backend.herokuapp.com/api/students/${reference}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { status: status },
        
      };
  
      await axios(updateStudentOptions);
      console.log("Student updated successfully");
    } catch (error) {
      console.log("An error occurred while updating the student:", error);
    }
  };
  
  const verifyPayment = async (ref) => {
    setPaymentState("verifying");
    await updateStudent(ref, paymentState);

    const options = {
      method: "get",
      url: `https://api.paystack.co/transaction/verify/${ref}`,
      headers: {
        Authorization: secretKey,
        "Content-Type": "application/json",
      },
      
    };

    try {
      const res = await axios(options);

      if (
        res.data?.status &&
        res?.data?.data?.status === "success" &&
        res?.data?.data?.gateway_response === "Successful"
      ) {
        if (res.data.data.amount === pendingPayment) {
          setPaymentState("paid");
          await updateStudent(ref, paymentState);
          console.log(paymentState);
          // Call save student or anything
        } else {
          alert("Wrong payment");
          setPaymentState("verify");
          await updateStudent(ref, paymentState);
        }
      }
    } catch (error) {
      console.log("this : " + error);
    }
  };

  const validateForm = () => {
    setError(null);

    if (!name) {
      setError("Name field is required");
      return false;
    }
    if (!regNo) {
      setError("Registration number field is required");
      return false;
    }
    if (!department) {
      setError("Department field is required");
      return false;
    }
    if (!level) {
      setError("Level field is required");
      return false;
    }
    if (!phone) {
      setError("Phone field is required");
      return false;
    }
    if (!email) {
      setError("Email field is required");
      return false;
    }

    return true;
  };

  return (
    <Paper
      sx={{ maxWidth: 500, borderRadius: 2, marginTop: 30, marginBottom: 10 }}
      elevation={5}
    >
      <Grid container gap={2} p={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Typography variant="h4" sx={{ m: 1, p: 1 }}>
            <b>Student Details</b>
          </Typography>
          {error && (
            <Typography sx={{ fontSize: 16, color: "red" }}>{error}</Typography>
          )}
        </Box>
        <Grid item xs={12}>
          <TextField
            required
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={5.78}>
          <TextField
            required
            label="Registration Number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={5.78}>
          <TextField
            required
            label="Course of Study"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            sx={{ width: "100%" }}
          >
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} md={5.78}>
          <TextField
            required
            select
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            sx={{ width: "100%" }}
          >
            <MenuItem value="Level 1">Level 1</MenuItem>
            <MenuItem value="Level 2">Level 2</MenuItem>
            <MenuItem value="Level 3">Level 3</MenuItem>
            <MenuItem value="Level 4">Level 4</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} md={5.78}>
          <TextField
            required
            label="Phone number"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={5.78}>
          <TextField
            required
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Typography variant="body2" component="h4">
          Amount: <b>₦ 500</b>
        </Typography>
        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{
              width: "100%",
              background:
                "linear-gradient(43deg, rgba(34,186,50,1) 0%, rgba(240,202,143,1) 100%)",
              fontWeight: "bold",
              color: "black",
            }}
            onClick={handleSubmit}
          >
            Pay
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Form;
