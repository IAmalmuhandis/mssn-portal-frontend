import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

import QRCode from 'qrcode'
import html2pdf from "html2pdf.js";
import { useReactToPrint } from 'react-to-print';
import aukLogo from "./../../assets/auk-logo.png";
import mssnLogo from "./../../assets/mssn-auk.png";
import './Reciept.css'

const Reciept = () => {
  const [qrCode, setQrCode] = useState('')
  const [studentInfo, setStudentInfo] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const contentRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference')

  // console.log(searchParams.get('reference'))
  const generateQR = async (reference) => {
    try {
      const redirectLink = `https://master--kaleidoscopic-arithmetic-c4d519.netlify.app/payment/${reference}`;
      const text = `Reference: ${reference}\nRedirect Link: ${redirectLink}`;
      const qr = await QRCode.toDataURL(text);
      setQrCode(qr);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentInfo = async (reference) => {
    try {
      const response = await axios.get(`https://mssn-portal-backend.herokuapp.com/api/payment/${reference}`);
      setStudentInfo(response.data);
    } catch (err) {
      console.error("this " + err);
    }
  };
  
  
  useEffect(() => {
    fetchStudentInfo(reference)
  }, []);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);
  
  useEffect(() => {

    
    generateQR(reference);
    
    fetchStudentInfo(reference);
  }, [location.search]);

  const downloadPdf = () => {
    const content = contentRef.current;

    // Configuration for html2pdf
    const options = {
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 2 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(content).set(options).save();
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  const redirectToPaymentPage = () => {
    alert("Verify Payment by scanning your QR Code");
    navigate(`/payment/${searchParams.get('reference')}`);
  }

  return (
    <div className="reciept">

      <Box width='100%' sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingTop: 20 }}>
        <Paper elevation={4} sx={{width: 595}}>
          <Box ref={contentRef} width='100%' sx={{ mt: 5, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div className="header" style={{position: 'relative', paddingTop: 110, width: '100%'}}>
              <Typography variant="h6" align="center" fontWeight='bold' >
                MSSN Payment Receipt
              </Typography>
              <img style={{position: 'absolute', width: 100, right: 25, top: -10}}  src={mssnLogo} alt="mssnLogo" />
            </div>
            <hr style={{ width: '70%' }} />

            <img src={aukLogo} style={{position: 'absolute', top: 200, left: 130, opacity: .2}} alt="auk-logo" width={200} />
            <img src={mssnLogo} style={{position: 'absolute',  bottom: 200, right: 130, opacity: .2}} alt="auk-logo" width={200} />
            <div className="details" style={{ width: '70%' }}>
              <div className="info name">
                <p className="key">Name:</p>
                <p className="value">{studentInfo?.full_name}</p>
              </div>
              <div className="info regNo">
                <p className="key">Registration Number:</p>
                <p className="value">{studentInfo?.regno}</p>
              </div>
              <div className="info department">
                <p className="key">Department:</p>
                <p className="value">{studentInfo?.course}</p>
              </div>
              <div className="info level">
                <p className="key">Level:</p>
                <p className="value">{studentInfo?.level}</p>
              </div>
              <div className="info phone">
                <p className="key">Phone:</p>
                <p className="value">{studentInfo?.phone}</p>
              </div>
              <div className="info refNo">
                <p className="key">Reference Number:</p>
                <p className="value">{studentInfo?.reference}</p>
              </div>
              <div className="info date">
                <p className="key">Date:</p>
                <p className="value">{format(currentDate, 'dd MMM yyyy')}</p>
              </div>
            </div>

            <div className="qrcode" style={{marginTop: 35, marginBottom: 35}}>
              <img src={qrCode} width={200} alt="qrcode" onClick={redirectToPaymentPage} />
            </div>
          </Box>
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap:2 }}>
          <Button
            onClick={downloadPdf}
            sx={{
              background:
              "linear-gradient(43deg, rgba(34,186,50,1) 0%, rgba(240,202,143,1) 100%)", fontWeight: 'bold', marginTop: 2, marginBottom: 10
            }}
            variant="contained">
            Download as PDF
          </Button>
          <Button
            onClick={handlePrint}
            sx={{
              background:
              "linear-gradient(43deg, rgba(34,186,50,1) 0%, rgba(240,202,143,1) 100%)", fontWeight: 'bold', marginTop: 2, marginBottom: 10
            }}
            variant="contained">
            Print Receipt
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Reciept;
