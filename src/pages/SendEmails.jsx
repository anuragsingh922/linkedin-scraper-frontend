import {
  Box,
  TextField,
  Typography,
  Button,
  Input,
  Paper,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import Papa from "papaparse";
import { DataGrid } from "@mui/x-data-grid";
import ApiAxiosClient from "../config/ScrapperClient";
import toast from "react-hot-toast";
import { useZustandStore } from "../store/store";

const SendEmails = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [cookieSessionDisplay, setCookieSessionDisplay] = useState(false);
  const [problemDisplay, setproblemDisplay] = useState(false);
  const [haveProductDesAndStatement, setHaveProductDesAndStatement] =
    useState();
  const [problemStatement, setProblemStatement] = useState();
  const [productDes, setProductDes] = useState();
  const [productDesAndStatementGiven, setProductDesAndStatementGiven] =
    useState(false);
  const [loadingMessage, setLoadingMessage] = useState();
  const [problemDataOutput, setProblemDataOutput] = useState();
  const [problemDataContent, setProblemDataContent] = useState();
  const [loading, setLoading] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const [generatedEmailSubject, setGeneratedEmailSubject] = useState();
  const [generatedEmailContent, setGeneratedEmailContent] = useState();
  const { user } = useZustandStore();

  const indexedCsvData = csvData.map((row, index) => ({
    ...row,
    id: index + 1,
  }));
  const handleParseCsv = () => {
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          const parsedData = result.data;
          if (parsedData.length > 0) {
            setCsvData(parsedData);
            setColumns(
              Object.keys(parsedData[0]).map((colName) => ({
                field: colName,
                headerName: colName,
                // flex: 1,
                width: colName === "profileUrl" ? 350 : 0,
              }))
            );
          }
        },
      });
    }
    setproblemDisplay(true);
  };

  const sendEmail = async () => {
    const emails = csvData.map((item) => item.email);
    try {
      await ApiAxiosClient.post(`/send_email`, {
        emails: emails,
        subject: generatedEmailSubject,
        content: generatedEmailContent,
        sender_name: user.name,
      });
      setLoading(false);
      toast.success("Email sent successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Error in sending email, Please try again");
    }
  };

  const callEmail = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Fetching Email Subject...");
      const response = await ApiAxiosClient.post(`/generate_email_subject`, {
        prod_statement: problemStatement,
        prod_description: productDes,
      });
      setGeneratedEmailSubject(response.data.subject);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    try {
      setLoading(true);
      setLoadingMessage("Fetching Email Content...");
      const response = await ApiAxiosClient.post(`/generate_email_content`, {
        prod_statement: problemStatement,
        prod_description: productDes,
      });
      setGeneratedEmailContent(response.data.content);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const callCompaniedInMind = async () => {
    setLoadingMessage("Fetching Data...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(`/option`, {
        message: problemDataContent,
      });
      setProblemDataOutput(data);
      setLoading(false);

      if (data.response.toLowerCase() === "yes") {
        setHaveProductDesAndStatement(true);
      } else if (data.response.toLowerCase() === "no") {
        setHaveProductDesAndStatement(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress color="primary" size={30} />
        <Typography>{loadingMessage || ""}</Typography>
      </Box>
    );
  }

  const reset = () => {
    setSelectedFile(null);
    // setCsvData([]);
    // setColumns([]);
    setCookieSessionDisplay(false);
    setproblemDisplay(false);
    setHaveProductDesAndStatement();
    setProblemStatement();
    setProductDes();
    setProductDesAndStatementGiven(false);
    setLoadingMessage();
    setProblemDataOutput();
    setProblemDataContent();
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        pl: [5, 5, 30],
        my: 10,
        mt: 5,
        width: 900,
      }}
    >
      {/* <Button
        variant="contained"
        sx={{ alignSelf: "baseline" }}
        onClick={reset}
      >
        RESET
      </Button> */}
      <Typography sx={{ fontWeight: "800", fontSize: "3rem" }}>
        Send Emails
      </Typography>
      <Box sx={{ mt: 2 }}>
        <div>
          <Paper
            elevation={3}
            style={{
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-input"
            />
            {!selectedFile ?<label htmlFor="file-input">
              <Button variant="contained" component="span">
                Select CSV File
              </Button>
            </label> : null}
            {selectedFile && (
              <Box>
                Selected File: <b>{selectedFile.name}</b>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleParseCsv}
                  sx={{ ml: 1 }}
                >
                  Parse CSV
                </Button>
              </Box>
            )}
          </Paper>

          {csvData.length > 0 && (
            <Box sx={{ height: 400, width: "100%", mt: 2 }}>
              <DataGrid
                rows={indexedCsvData}
                columns={columns}
                disableColumnFilter={true}
              />
            </Box>
          )}
        </div>
        <>
          {problemDisplay && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                Do you have a problem statement and product description?
              </Typography>
              <TextField
                size="small"
                sx={{ mt: 1, width: "100%" }}
                value={problemDataContent}
                onChange={(e) => {
                  setProblemDataContent(e.target.value);
                }}
                disabled={problemDataOutput ? true : false}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    callCompaniedInMind();
                  }
                }}
              />
            </Box>
          )}
          {haveProductDesAndStatement === true && (
            <>
              <Box sx={{ mt: 2 }}>
                <Typography>Enter your problem statement:</Typography>
                <TextField
                  size="small"
                  sx={{ mt: 1, width: "100%" }}
                  onChange={(e) => {
                    setProblemStatement(e.target.value);
                  }}
                  value={problemStatement}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography>Enter your product description:</Typography>
                <TextField
                  size="small"
                  sx={{ mt: 1, width: "100%" }}
                  onChange={(e) => {
                    setProductDes(e.target.value);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      if (!problemStatement || !productDes) {
                        toast.error(
                          "Please enter problem statement and description"
                        );
                        return;
                      }
                      await callEmail();
                      setProductDesAndStatementGiven(true);
                    }
                  }}
                />
              </Box>
            </>
          )}
          {(haveProductDesAndStatement === false ||
            productDesAndStatementGiven === true) && (
            <>
              {generatedEmailSubject && generatedEmailContent && (
                <>
                  <Box>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Auto Generated Email Subject
                    </Typography>
                    <textarea
                      value={generatedEmailSubject}
                      onChange={(e) => {
                        const text = e.target.value;
                        setGeneratedEmailSubject(text);
                      }}
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        background: "#121512",
                        color: "white",
                        padding: "11px",
                        borderRadius: "10px",
                        resize: "none",
                        fontSize: "0.8rem",
                        height: "44px",
                      }}
                      cols="2"
                      rows="10"
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Auto Generated Email Content
                    </Typography>
                    <textarea
                      value={generatedEmailContent}
                      onChange={(e) => {
                        const text = e.target.value;
                        setGeneratedEmailContent(text);
                      }}
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        background: "#121512",
                        color: "white",
                        padding: "11px",
                        borderRadius: "10px",
                        resize: "none",
                        fontSize: "0.8rem",
                      }}
                      cols="10"
                      rows="10"
                    />
                  </Box>

                  <Button
                    variant="contained"
                    sx={{ mt: 2, px: 4 }}
                    onClick={() => {
                      sendEmail();
                    }}
                  >
                    Send Email
                  </Button>
                </>
              )}
            </>
          )}
        </>
      </Box>
    </Box>
  );
};

export default SendEmails;
