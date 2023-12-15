import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ApiAxiosClient from "../config/ScrapperClient";
import ReactJson from "react-json-view";
import AxiosClient from "../config/AxiosClient";
import { useZustandStore } from "../store/store";

const Home = () => {
  const [problemStatement, setProblemStatement] = useState();
  const [productDes, setProductDes] = useState();
  const [loading, setLoading] = useState(false);
  const [profileDeciderData, setProfileDeciderData] = useState();
  const [targetPresonaDisplay, setTargetPresonaDisplay] = useState(false);
  const [targetPresonaContent, settargetPresonaContent] = useState();
  const [targetPersonaOutput, setTargetPersonaOutput] = useState();
  const [peopleToTargetDisplay, setPeopleToTargetDisplay] = useState(false);
  const [peopleToTargetContent, setPeopleToTargetContent] = useState();
  const [outReachMethodsDisplay, setOutReachMethodsDisplay] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("None");
  const [cookieDisplay, setcookieDisplay] = useState(false);
  const [cookieContent, setcookieContent] = useState();
  const [industriesDisplay, setIndustriesDisplay] = useState(false);
  const [noIndustriesSelectedResult, setNoIndustriesSelectedResult] =
    useState();
  const [industriesChoosingDisplay, setIndustriesChoosingDisplay] =
    useState(false);
  const [industriesChoosingData, setIndustriesChoosingData] = useState();
  const [yesIndustriesSelectedContent, setYesIndustriesSelectedContent] =
    useState();
  const [userChoiceIndustries, setUserChoiceIndustries] = useState();
  const [industriesButtonClicked, setIndustriesButtonClicked] = useState(false);
  const [companySize, setCompanySize] = useState("None");
  const [locationDisplay, setLocationDisplay] = useState(false);
  const [locationContent, setLocationContent] = useState();
  const [scrappingData, setScrappingData] = useState();
  const [loadingMessage, setLoadingMessage] = useState();
  const [messageData, setMessageData] = useState();
  const [characterCount, setCharacterCount] = useState(0);
  const [companiedInMindData, setCompaniedInMindData] = useState();
  const [noIndustriesSelectedUserOutput, setnoIndustriesSelectedUserOutput] =
    useState();
  const [companiedInMindOutput, setCompaniedInMindOutput] = useState();
  const [profileWithEmail, setProfileWithEmail] = useState();
  const [generatedEmailSubject, setGeneratedEmailSubject] = useState();
  const [generatedEmailContent, setGeneratedEmailContent] = useState();
  const [outputIndustriesDisplay, setOutputIndustriesDisplay] = useState(false);
  const [connectPeopleContent, setConnectPeopleContent] = useState();
  const [yesNoContent, setYesNoContent] = useState();
  const [
    connectionMessageDecisionContent,
    setConnectionMessageDecisionContent,
  ] = useState();

  const { user } = useZustandStore();

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
    // setcookieDisplay(false);
    if (event.target.value !== "None") {
      setcookieDisplay(true);
    } else {
      setcookieDisplay(false);
    }
  };
  const callTargetProfileDecider = async () => {
    setLoadingMessage("Fetching Positions...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(`/target_profile_decider`, {
        prod_statement: problemStatement,
        prod_description: productDes,
      });
      setProfileDeciderData(data.result);
      setTargetPresonaDisplay(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  const callTargetPersonaDecider = async () => {
    setLoading(true);
    setLoadingMessage("Fetching target persona...");

    try {
      const { data } = await ApiAxiosClient.post(`/target_persona_decider`, {
        user_response: targetPresonaContent,
      });
      setTargetPersonaOutput(data.result);
      setPeopleToTargetDisplay(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  const callNumberOfPeopleToTarget = async () => {
    setOutReachMethodsDisplay(true);
    // setPeopleToTargetDisplay(true);
  };

  const callNoIndustriesSelected = async () => {
    setLoadingMessage("Fetching Industries...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(`/industries`, {
        user_choice: "No",
        prod_statement: problemStatement,
        prod_description: productDes,
      });
      setNoIndustriesSelectedResult(data.result);
      setIndustriesButtonClicked(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  const callEmail = async (data) => {
    if (!selectedMethod.toLowerCase().includes("email")) {
      return;
    }
    try {
      setLoading(true);
      setLoadingMessage("Fetching Emails...");
      const response = await ApiAxiosClient.post(`/get_emails`, {
        profiles: data,
      });
      setProfileWithEmail(response.data.emails);
      setLoading(false);
      if (response.data.status === "No emails found") {
        toast.error("No emails Found");
        return;
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
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

  const callScrapingCompanies = async () => {
    setLoadingMessage("Fetching Profiles...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(`/company_scraper`, {
        session_cookie: cookieContent,
        industries:
          userChoiceIndustries === true
            ? yesIndustriesSelectedContent
            : noIndustriesSelectedUserOutput,
        country: locationContent,
        company_size: companySize.toLowerCase(),
        target_persona: targetPersonaOutput,
        no_of_profiles: peopleToTargetContent,
      });
      if (data.error) {
        setLoading(false);
        toast.error(data.error);
        return;
      }
      setScrappingData(data);
      setLoading(false);
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
      await callEmail(scrappingData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  const sendConnectionRqst = async () => {
    setLoadingMessage("Sending Connection Request...");
    const linkedin_url = scrappingData.map((item) => item.profileUrl);
    setLoading(true);
    try {
      await ApiAxiosClient.post(`/send_connection`, {
        session_cookie: cookieContent,
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

  const callCompaniedInMind = async () => {
    setLoadingMessage("Fetching Data...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(`/option`, {
        message: companiedInMindData,
      });
      setCompaniedInMindOutput(data);
      setLoading(false);

      if (data.response.toLowerCase() === "yes") {
        setNoIndustriesSelectedResult();
        setIndustriesChoosingDisplay(true);
        setUserChoiceIndustries(true);
      } else if (data.response.toLowerCase() === "no") {
        setNoIndustriesSelectedResult();
        await callNoIndustriesSelected();
        setIndustriesChoosingDisplay(true);
        setUserChoiceIndustries(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  const callIndustriesSelected = async () => {
    setLoadingMessage("Fetching Industries...");
    setLoading(true);

    if (userChoiceIndustries) {
      try {
        const { data } = await ApiAxiosClient.post(`/industries`, {
          user_choice: "Yes",
          industries: industriesChoosingData,
        });
        setYesIndustriesSelectedContent(data.result);
        setIndustriesButtonClicked(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error, Please try again");
      }
    } else {
      try {
        const { data } = await ApiAxiosClient.post(`/industries_choices`, {
          industries: noIndustriesSelectedResult,
          choices: industriesChoosingData,
        });
        setnoIndustriesSelectedUserOutput(data.result);
        setOutputIndustriesDisplay(true);
        setIndustriesButtonClicked(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error, Please try again");
      }
    }
  };

  const sendEmail = async () => {
    try {
      const { data } = await ApiAxiosClient.post(`/send_email`, {
        emails: profileWithEmail,
        subject: generatedEmailSubject,
        content: generatedEmailContent,
        sender_name: user.name,
      });
      setLoading(false);
      toast.success("Email sent successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  const convertJSONToCSV = () => {
    // Create a CSV content string
    let csvContent = "data:text/csv;charset=utf-8,";

    // Create headers from the keys of the first object
    const headers = Object.keys(scrappingData[0]);
    csvContent += headers.join(",") + "\n";

    // Create rows of data
    scrappingData.forEach((item) => {
      const row = headers.map((header) => item[header]);
      csvContent += row.join(",") + "\n";
    });

    // Create a data URI
    const encodedUri = encodeURI(csvContent);

    // Create a temporary anchor element for download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "profiles.csv");
    document.body.appendChild(link);

    // Simulate a click on the anchor element to trigger the download
    link.click();

    // Remove the temporary anchor element
    document.body.removeChild(link);
  };

  const convertJSONToCSVProfile = () => {
    // Create a CSV content string
    let csvContent = "data:text/csv;charset=utf-8,";

    // Create headers from the keys of the first object
    const headers = Object.keys(profileWithEmail[0]);
    csvContent += headers.join(",") + "\n";

    // Create rows of data
    profileWithEmail.forEach((item) => {
      const row = headers.map((header) => item[header]);
      csvContent += row.join(",") + "\n";
    });

    // Create a data URI
    const encodedUri = encodeURI(csvContent);

    // Create a temporary anchor element for download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "profilesWithEmail.csv");
    document.body.appendChild(link);

    // Simulate a click on the anchor element to trigger the download
    link.click();

    // Remove the temporary anchor element
    document.body.removeChild(link);
  };

  const data = [
    "LinkedIn Only: Send a connection request on LinkedIn, either with or without a personalized message.",
    "LinkedIn + Email: Send LinkedIn connection requests and obtain/send emails, which will be provided in a .csv file.",
    "LinkedIn + Email + Phone: Send LinkedIn connection requests, obtain/send emails, and collect phone numbers, all of which will be provided in a .csv file.",
    "Email Only: Send emails exclusively or request a .csv file containing email addresses.",
    "Email + Phone: Collect and send emails, as well as gather phone numbers, with all data being provided in a .csv file.",
  ];

  const reset = () => {
    setProblemStatement("");
    setProductDes("");
    setLoading(false);
    setProfileDeciderData(undefined);
    setTargetPresonaDisplay(false);
    settargetPresonaContent(undefined);
    setTargetPersonaOutput(undefined);
    setPeopleToTargetDisplay(false);
    setPeopleToTargetContent(undefined);
    setOutReachMethodsDisplay(false);
    setSelectedMethod("None");
    setcookieDisplay(false);
    setcookieContent(undefined);
    setIndustriesDisplay(false);
    setNoIndustriesSelectedResult(undefined);
    setIndustriesChoosingDisplay(false);
    setIndustriesChoosingData(undefined);
    setYesIndustriesSelectedContent(undefined);
    setUserChoiceIndustries(undefined);
    setIndustriesButtonClicked(false);
    setCompanySize("None");
    setLocationDisplay(false);
    setLocationContent(undefined);
    setScrappingData(undefined);
    setLoadingMessage(undefined);
    setMessageData(undefined);
    setCharacterCount(0);
    setCompaniedInMindData(undefined);
    setnoIndustriesSelectedUserOutput(undefined);
    setCompaniedInMindOutput(undefined);
    setProfileWithEmail(undefined);
    setGeneratedEmailSubject(undefined);
    setGeneratedEmailContent(undefined);
    setOutputIndustriesDisplay(false);
    setConnectPeopleContent(undefined);
    setYesNoContent(undefined);
    setConnectionMessageDecisionContent(undefined);
  };

  const callYesNo = async () => {
    setLoadingMessage("Fetching Data...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(`/option`, {
        message: connectPeopleContent,
      });
      setYesNoContent(data.response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };
  const [yesNoMessageConnectionContent, setYesNoMessageConnectionContent] =
    useState();
  const callYesNoMessage = async () => {
    setLoadingMessage("Fetching Data...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(`/option`, {
        message: connectPeopleContent,
      });
      setYesNoMessageConnectionContent(data.response);
      setLoading(false);

      if (data.response.toLowerCase() === "yes") {
        await callConnectionMessage();
      } else if (data.response.toLowerCase() === "no") {
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

  return (
    <Box
      sx={{
        m: "auto",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        px: [5, 5, 30],
        mt: 5,
        mb: 40,
      }}
    >
      <Button
        variant="contained"
        sx={{ alignSelf: "baseline" }}
        onClick={reset}
      >
        RESET
      </Button>
      <Typography variant="h6" sx={{ fontWeight: "800", fontSize: "3rem" }}>
        Linkedin Agent
      </Typography>
      <Box>
        <Typography variant="h6">Enter your problem statement</Typography>
        <TextField
          size="small"
          sx={{ mt: 1, width: "100%" }}
          onChange={(e) => {
            setProblemStatement(e.target.value);
          }}
          value={problemStatement}
          disabled={profileDeciderData ? true : false}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Enter your product description{" "}
        </Typography>
        <TextField
          size="small"
          sx={{ mt: 1, width: "100%" }}
          value={productDes}
          onChange={(e) => {
            setProductDes(e.target.value);
          }}
          disabled={profileDeciderData ? true : false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!problemStatement || !productDes) {
                toast.error("Please enter problem statement and description");
                return;
              }
              callTargetProfileDecider();
            }
          }}
        />
        {profileDeciderData && (
          <Box sx={{ mt: 2 }}>
            <ReactJson
              src={profileDeciderData}
              displayDataTypes={false}
              theme="monokai"
            />
          </Box>
        )}

        {targetPresonaDisplay && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Choose target persona or enter your own:
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={targetPresonaContent}
              onChange={(e) => {
                settargetPresonaContent(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!problemStatement || !productDes || !profileDeciderData) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callTargetPersonaDecider();
                }
              }}
              disabled={targetPersonaOutput ? true : false}
            />
            {targetPersonaOutput && (
              <Typography variant="h6" sx={{ mt: 1 }}>
                {targetPersonaOutput}
              </Typography>
            )}
          </>
        )}
        {peopleToTargetDisplay && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Got it! How many people would you like to target?
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={peopleToTargetContent}
              onChange={(e) => {
                setPeopleToTargetContent(e.target.value);
              }}
              type="number"
              disabled={outReachMethodsDisplay}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !profileDeciderData ||
                    !targetPersonaOutput
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callNumberOfPeopleToTarget();
                }
              }}
            />
          </>
        )}
        {outReachMethodsDisplay && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Please choose one of the following outreach methods:
            </Typography>
            <List component="ol">
              {data.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText primary={`${i + 1}. ${item}`} />
                </ListItem>
              ))}
            </List>
            <FormControl sx={{ mt: 2 }}>
              <Typography variant="h6">Select Outreach Method:</Typography>
              <Select
                labelId="outreach-method-label"
                id="outreach-method-select"
                value={selectedMethod}
                onChange={handleMethodChange}
                size="small"
                sx={{ mt: 1 }}
                disabled={selectedMethod !== "None" ? true : false}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="LinkedIn Only">LinkedIn Only</MenuItem>
                <MenuItem value="LinkedIn + Email">LinkedIn + Email</MenuItem>
                <MenuItem value="LinkedIn + Email + Phone">
                  LinkedIn + Email + Phone
                </MenuItem>
                <MenuItem value="Email Only">Email Only</MenuItem>
                <MenuItem value="Email + Phone">Email + Phone</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
        {cookieDisplay && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Enter your session cookie
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={cookieContent}
              onChange={(e) => {
                setcookieContent(e.target.value);
              }}
              disabled={industriesDisplay}
              type="password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !profileDeciderData ||
                    !peopleToTargetContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  setIndustriesDisplay(true);
                }
              }}
            />
          </>
        )}
        {industriesDisplay && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Do you have any industries or companies in mind?
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={companiedInMindData}
              onChange={(e) => {
                setCompaniedInMindData(e.target.value);
              }}
              disabled={companiedInMindOutput ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !profileDeciderData ||
                    !peopleToTargetContent ||
                    !cookieContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callCompaniedInMind();
                }
              }}
            />
          </>
        )}
        {noIndustriesSelectedResult && (
          <Box sx={{ mt: 2 }}>
            <ReactJson
              src={noIndustriesSelectedResult}
              displayDataTypes={false}
              theme="monokai"
            />
          </Box>
        )}
        {industriesChoosingDisplay && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Which industries do you choose?
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={industriesChoosingData}
              onChange={(e) => {
                setIndustriesChoosingData(e.target.value);
              }}
              disabled={
                yesIndustriesSelectedContent || noIndustriesSelectedUserOutput
                  ? true
                  : false
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !profileDeciderData ||
                    !peopleToTargetContent ||
                    !cookieContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callIndustriesSelected();
                }
              }}
            />
          </>
        )}
        {yesIndustriesSelectedContent && (
          <Box sx={{ mt: 2 }}>
            <ReactJson
              src={yesIndustriesSelectedContent}
              displayDataTypes={false}
              theme="monokai"
            />
          </Box>
        )}
        {outputIndustriesDisplay && (
          <Box sx={{ mt: 2 }}>
            <ReactJson
              src={noIndustriesSelectedUserOutput}
              displayDataTypes={false}
              theme="monokai"
            />
          </Box>
        )}
        {industriesButtonClicked && (
          <FormControl sx={{ mt: 2 }}>
            <Typography variant="h6">Select Company Size</Typography>
            <Select
              value={companySize}
              onChange={(e) => {
                setCompanySize(e.target.value);
                setLocationDisplay(true);
              }}
              size="small"
              sx={{ mt: 1 }}
              disabled={companySize !== "None" ? true : false}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
            </Select>
          </FormControl>
        )}

        {locationDisplay && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Enter Location
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={locationContent}
              onChange={(e) => {
                setLocationContent(e.target.value);
              }}
              disabled={scrappingData ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !profileDeciderData ||
                    !peopleToTargetContent ||
                    !cookieContent ||
                    !locationContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callScrapingCompanies();
                }
              }}
            />
          </>
        )}

        {scrappingData && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Profiles
              </Typography>
            </Box>
            {scrappingData.map((item, i) => {
              return (
                <Typography key={i}>
                  {item.name} -{" "}
                  <a href={item.profileUrl} target="_blank" rel="noreferrer">
                    {item.profileUrl}
                  </a>
                </Typography>
              );
            })}
          </Box>
        )}
        {scrappingData && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={convertJSONToCSV}>
              Download (Profiles)
            </Button>
          </Box>
        )}
        {profileWithEmail?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={convertJSONToCSVProfile}>
              Download (Profiles with emails)
            </Button>
          </Box>
        )}

        {scrappingData && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Would you like to connect with these people
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={connectPeopleContent}
              onChange={(e) => {
                setConnectPeopleContent(e.target.value);
              }}
              disabled={yesNoContent ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !profileDeciderData ||
                    !peopleToTargetContent ||
                    !cookieContent ||
                    !locationContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callYesNo();
                }
              }}
            />
          </>
        )}
        {yesNoContent?.toLowerCase() === "yes" && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Would you like to send a connection message
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={connectionMessageDecisionContent}
              onChange={(e) => {
                setConnectionMessageDecisionContent(e.target.value);
              }}
              disabled={yesNoMessageConnectionContent ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !profileDeciderData ||
                    !peopleToTargetContent ||
                    !cookieContent ||
                    !locationContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callYesNoMessage();
                }
              }}
            />
          </>
        )}

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
      </Box>
    </Box>
  );
};

export default Home;
