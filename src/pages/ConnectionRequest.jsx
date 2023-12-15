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

const ConnectionRequest = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [cookieSessionDisplay, setCookieSessionDisplay] = useState(false);
  const [sessionCookie, setSessionCookie] = useState();
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
  const [messageData, setMessageData] = useState();
  const [characterCount, setCharacterCount] = useState(0);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

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
    setCookieSessionDisplay(true);
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

  const callConnectionMessage = async () => {
    setLoadingMessage("Fetching Connection Message...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(
        `/generate_connection_message`,
        {
          prod_statement: problemStatement,
          prod_description: productDes,
          changes: "No changes",
        }
      );
      setMessageData(data.result);
      setCharacterCount(data.result.length);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  const sendConnectionRqst = async () => {
    setLoadingMessage("Sending Connection Request...");
    const linkedin_url = csvData.map((item) => item.profileUrl);
    if (linkedin_url.length < 1) {
      toast.error("Profile Url not present");
      return;
    }
    setLoading(true);
    try {
      await ApiAxiosClient.post(`/send_connection`, {
        session_cookie: sessionCookie,
        message: messageData,
        linkedin_url,
      });
      toast.success("Connection Requests sent");
      setLoading(false);
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
    setSessionCookie();
    setproblemDisplay(false);
    setHaveProductDesAndStatement();
    setProblemStatement();
    setProductDes();
    setProductDesAndStatementGiven(false);
    setLoadingMessage();
    setProblemDataOutput();
    setProblemDataContent();
    setLoading(false);
    setMessageData();
    setCharacterCount(0);
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
        Send Connection Requests
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
            <label htmlFor="file-input">
              <Button variant="contained" component="span">
                Select CSV File
              </Button>
            </label>
            {selectedFile && (
              <Box>
                Selected File: {selectedFile.name}
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
                // getRowHeight={() => "auto"}
              />
            </Box>
          )}
        </div>
        {cookieSessionDisplay && (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography>Enter your session cookie</Typography>
              <TextField
                size="small"
                sx={{ mt: 1, width: "100%" }}
                value={sessionCookie}
                onChange={(e) => {
                  setSessionCookie(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setproblemDisplay(true);
                  }
                }}
                type="password"
              />
            </Box>
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
                        await callConnectionMessage();
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
                {messageData && (
                  <>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Auto Generated Connection Message
                    </Typography>
                    <textarea
                      value={messageData}
                      onChange={(e) => {
                        const text = e.target.value;
                        if (text.length <= 300) {
                          setMessageData(text);
                          setCharacterCount(text.length);
                        }
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
                      cols="30"
                      rows="10"
                    />
                    <Typography variant="body1">
                      Character Count: {characterCount}/300
                    </Typography>
                    <Typography variant="body1" sx={{ color: "red" }}>
                      {characterCount > 300 &&
                        "Please limit the characters under 300 characters"}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, px: 4 }}
                      onClick={sendConnectionRqst}
                      disabled={characterCount > 300}
                    >
                      Send
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ConnectionRequest;
