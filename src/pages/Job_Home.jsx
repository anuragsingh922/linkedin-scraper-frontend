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

const Job = () => {
  const [problemStatement, setProblemStatement] = useState();
  const [productDes, setProductDes] = useState();
  const [jobtitle, setjobtitle] = useState();
  const [jobposition, setjobposition] = useState();
  const [joblisting, setjoblisting] = useState();
  const [loading, setLoading] = useState(false);
  const [emailsfound, setEmailsfound] = useState(false);
  const [profileDeciderData, setProfileDeciderData] = useState();
  const [targetPresonaDisplay, setTargetPresonaDisplay] = useState(false);
  const [targetPresonaContent, settargetPresonaContent] = useState();
  const [targetPersonaOutput, setTargetPersonaOutput] = useState();
  const [peopleToTargetDisplay, setPeopleToTargetDisplay] = useState(false);
  const [peopleToTargetContent, setPeopleToTargetContent] = useState();
  const [no_of_companies, setno_of_companies] = useState();
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
  const [jobsData, setjobsData] = useState();
  const [profiles, setprofiles] = useState();
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
      const { data } = await ApiAxiosClient.post(`/v1/target_profile_decider`, {
        prod_statement: problemStatement,
        problemdec: productDes,
        jobtitle: jobtitle,
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
      const { data } = await ApiAxiosClient.post(`/v1/target_persona_decider`, {
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
      const { data } = await ApiAxiosClient.post(`/v1/industries`, {
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
      const response = await ApiAxiosClient.post(`/v1/get_emails`, {
        profiles: data,
      });
      if (response.status !== "No emails found") {
        setEmailsfound(true);
      }
      if (response.data.status === "No emails found") {
        toast.error("No emails Found");
        return;
      }
      setProfileWithEmail(response.data.emails);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    try {
      setLoading(true);
      setLoadingMessage("Fetching Email Subject...");
      const response = await ApiAxiosClient.post(`/v1/generate_email_subject`, {
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
      const response = await ApiAxiosClient.post(`/v1/generate_email_content`, {
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

  const callScrapingJobs = async () => {
    setLoadingMessage("Fetching Jobs Openings...");
    setLoading(true);
    try {
      console.log(joblisting);
      const data = await ApiAxiosClient.post(`/v1/jobs`, {
        location: locationContent,
        job_title: jobtitle,
        joblisting: joblisting,
        jobposition: jobposition,
      });
      if (data.error) {
        setLoading(false);
        toast.error(data.error);
        return;
      }
      if (typeof data == "object") {
        setjobsData(data.data.companies);
        console.log("Found");
      } //Type
      else {
        setjobsData([
          {
            error: "No Profile Found",
          },
        ]);
      }
      console.log(typeof data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };
  const callscrapcompany = async () => {
    setLoadingMessage("Fetching Jobs Openings...");
    setLoading(true);
    try {
      console.log(joblisting);
      const data = await ApiAxiosClient.post(`/v1/company`, {
        session_cookie: cookieContent,
        location: locationContent,
        job_title: jobtitle,
        joblisting: joblisting,
        jobposition: jobposition,
        job_array : jobsData,
        target_persona : targetPresonaContent,
        companysize : companySize
      });
      if (data.error) {
        setLoading(false);
        toast.error(data.error);
        return;
      }
      if (typeof data == "object") {
        setprofiles(data.data);
        console.log("Found");
      } //Type
      else {
        setjobsData([
          {
            error: "No Profile Found",
          },
        ]);
      }
      console.log(typeof data);
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
        `/v1/generate_connection_message`,
        {
          prod_statement: problemStatement,
          prod_description: productDes,
          changes: "No changes",
        }
      );
      setMessageData(data.result);
      setCharacterCount(data.result.length);
      await callEmail(jobsData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };


const callConnection = async () => {
    setLoadingMessage("Sending Connection Request...");
    // const linkedin_url = jobsData.map((item) => item.profileUrl);
    let linkedin_url = [];
    for (let i = 0; i < profiles.length; i++) {
      console.log("Includes  :  " + profiles[i]["ProfileUrl"].includes("null"));
      if (profiles[i]["ProfileUrl"]) {
        linkedin_url.push(
          profiles[i]["ProfileUrl"]
            .replace(`"`, ``)
            .replace(`"`, ``)
            .replace(`"`, ``)
            .replace(`"`, ``)
            .replace("\\", ``)
        );
        console.log("Ele  :  " + linkedin_url[i]);
      }
    }
    console.log(linkedin_url);
    setLoading(true);
    try {
      await ApiAxiosClient.post(`/v1/send_connection`, {
        session_cookie: cookieContent,
        message: messageData ? messageData : null,
        linkedin_url,
      });
      toast.success("Connection Requests sent");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };

  const sendConnectionRqst = async () => {
    setLoadingMessage("Sending Connection Request...");
    // const linkedin_url = jobsData.map((item) => item.profileUrl);
    let linkedin_url = [];
    for (let i = 0; i < profiles.length; i++) {
      console.log("Includes  :  " + profiles[i]["ProfileUrl"].includes("null"));
      if (profiles[i]["ProfileUrl"]) {
        linkedin_url.push(
          profiles[i]["ProfileUrl"]
            .replace(`"`, ``)
            .replace(`"`, ``)
            .replace(`"`, ``)
            .replace(`"`, ``)
            .replace("\\", ``)
        );
        console.log("Ele  :  " + linkedin_url[i]);
      }
    }
    console.log(linkedin_url);
    setLoading(true);
    try {
      await ApiAxiosClient.post(`/v1/send_connection`, {
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


  const sendConnectionRqstJob = async () => {
    setLoadingMessage("Sending Connection Request...");
    setLoading(true);
    try {
      await ApiAxiosClient.post(`/v1/send_connection_with_message`, {
        session_cookie: cookieContent,
        profiles : profiles,
        problemStatement : problemStatement,
        productDes : productDes,
        changes: "No changes",
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
      const { data } = await ApiAxiosClient.post(`/v1/option`, {
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
        const { data } = await ApiAxiosClient.post(`/v1/industries`, {
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
        const { data } = await ApiAxiosClient.post(`/v1/industries_choices`, {
          industries: noIndustriesSelectedResult,
          choices: industriesChoosingData,
        });

        // setnoIndustriesSelectedUserOutput(data.result);

        const result = data.result[0].split(",");
        let newresult_arr = [];
        // let result = data.result.replace(/\s+/g, '_').replace('.' , '');

        console.log("Array  :  " + JSON.stringify(result));

        for (let i = 0; i < result.length; i++) {
          console.log("I  :  " + result[i]);
          let n = result[i]
            .replace(".", "")
            .replace("1", "")
            .replace("2", "")
            .replace("3", "")
            .replace("4", "")
            .replace("5", "")
            .replace("6", "")
            .replace("7", "")
            .replace("8", "")
            .replace("9", "")
            .replace("10", "");
          newresult_arr.push(n);
        }

        for (let i = 0; i < newresult_arr.length; i++) {
          console.log(`Result ${i}  :  ` + newresult_arr[i]);
        }

        setnoIndustriesSelectedUserOutput(newresult_arr);
        setOutputIndustriesDisplay(true);
        setIndustriesButtonClicked(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error, Please try again");
      }
    }
  };

  // const emails = [];
  const sendEmail = async () => {
    try {
      console.log(profileWithEmail);
      const { data } = await ApiAxiosClient.post(`/v1/send_email`, {
        // emails: emails,
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
    const headers = Object.keys(jobsData[0]);
    csvContent += headers.join(",") + "\n";

    // Create rows of data
    jobsData.forEach((item) => {
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
    setjobsData(undefined);
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
      const { data } = await ApiAxiosClient.post(`/v1/option`, {
        message: connectPeopleContent,
      });
      console.log(data);
      if(data.response==="Yes" || data.response==="yes"){
        setYesNoContent(data.response);
      }
      else{
        setYesNoContent();
      }
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
      const { data } = await ApiAxiosClient.post(`/v1/option`, {
        message: connectionMessageDecisionContent? connectionMessageDecisionContent: connectPeopleContent,
      });

      console.log(data.response);
      
      if (data.response.toLowerCase() === "yes") {
        setLoading(false);
        setYesNoMessageConnectionContent();
        await sendConnectionRqstJob();
      } else if (data.response.toLowerCase() === "no") {
        setLoading(false);
        setYesNoMessageConnectionContent();
        console.log("Calling Connection");
        await callConnection();
        console.log("Called Connection");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error, Please try again");
    }
  };


  const callYesNoMessageForemail = async () => {
    setLoadingMessage("Fetching Data...");
    setLoading(true);
    try {
      const { data } = await ApiAxiosClient.post(`/v1/option`, {
        message: connectionMessageDecisionContent? connectionMessageDecisionContent: connectPeopleContent,
      });

      console.log(data.response);
      
      if (data.response.toLowerCase() === "yes") {
        setLoading(false);
        setYesNoMessageConnectionContent();
        await callEmail(jobsData);
        // await sendEmail();
      } else if (data.response.toLowerCase() === "no") {
        setLoading(false);
        setYesNoMessageConnectionContent();
        console.log("Calling Connection");
        await callConnection();
        console.log("Called Connection");
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
        <Typography variant="h6">Problem Statement</Typography>
        <TextField
          size="small"
          sx={{ mt: 1, width: "100%" }}
          onChange={(e) => {
            setProblemStatement(e.target.value);
          }}
          value={problemStatement}
          // disabled={profileDeciderData ? true : false}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Product Description
        </Typography>
        <TextField
          size="small"
          sx={{ mt: 1, width: "100%" }}
          value={productDes}
          onChange={(e) => {
            setProductDes(e.target.value);
          }}
          // disabled={profileDeciderData ? true : false}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Job Title
        </Typography>
        <TextField
          size="small"
          sx={{ mt: 1, width: "100%" }}
          value={jobtitle}
          onChange={(e) => {
            setjobtitle(e.target.value);
          }}
          // disabled={profileDeciderData ? true : false}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Job Positions
        </Typography>
        <TextField
          size="small"
          sx={{ mt: 1, width: "100%" }}
          value={jobposition}
          onChange={(e) => {
            setjobposition(e.target.value);
          }}
          // disabled={profileDeciderData ? true : false}
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
            // disabled={jobsData ? true : false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (
                  !problemStatement ||
                  !productDes ||
                  !jobtitle ||
                  !jobposition
                ) {
                  toast.error("Please enter all the details and retry");
                  return;
                }
                setPeopleToTargetDisplay(true);
              }
            }}
          />
        </>

        {peopleToTargetDisplay && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Got it! How many job listing?
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={joblisting}
              onChange={(e) => {
                setjoblisting(e.target.value);
              }}
              type="number"
              // disabled={outReachMethodsDisplay}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !jobtitle ||
                    !jobposition ||
                    !locationContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callScrapingJobs();
                }
              }}
            />
          </>
        )}

        {jobsData && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Jobs
              </Typography>
            </Box>
            {!jobsData &&
              jobsData.map((item, i) => {
                const cleanedData = Object.fromEntries(
                  Object.entries(item).map(([key, value]) => [
                    key,
                    value
                      .replace(/['"]+/g, "")
                      .replace(`"`, ``)
                      .replace(`\\`, ``)
                      .replace(`\\`, ``)
                      .replace(`\\`, ``)
                      .replace(`\\`, ``)
                      .replace(`]`, ``),
                  ])
                );

                return (
                  <Typography key={i}>
                    {Object.entries(cleanedData).map(([key, value]) =>
                      key !== "query" &&
                      key !== "connectionDegree" &&
                      key !== "timestamp" &&
                      key !== "lastName" &&
                      key !== "firstName" ? (
                        <>
                          <React.Fragment key={key}>
                            <>
                              {key === "Name" ? (
                                <>
                                  <hr />
                                  <br />
                                </>
                              ) : null}
                              {key.charAt(0).toUpperCase() +
                                key.slice(1, key.length)}{" "}
                              -{" "}
                              {key === "ProfileUrl" ? (
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    background: "#121512",
                                    color: "white",
                                    textDecoration: "none",
                                    padding: "5px 10px",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                >
                                  {value.replace("?", "")}
                                </a>
                              ) : (
                                value
                              )}
                              <br />
                            </>
                          </React.Fragment>
                          {key === "location" ? (
                            <>
                              <br />
                            </>
                          ) : null}
                          {/* <hr /> */}
                        </>
                      ) : null
                    )}
                  </Typography>
                );
              })}
            {jobsData ? (
              <ReactJson
                src={jobsData}
                displayDataTypes={false}
                theme="monokai"
              />
            ) : null}
          </Box>
        )}
        {jobsData && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={convertJSONToCSV}>
              Download (Jobs)
            </Button>
          </Box>
        )}

        {jobsData && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Profiles to Target
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={targetPresonaContent}
              onChange={(e) => {
                settargetPresonaContent(e.target.value);
              }}
              // disabled={yesNoContent ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !locationContent ||
                    !jobtitle ||
                    !targetPresonaContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callTargetPersonaDecider();
                }
              }}
            />
          </>
        )}

        {jobsData && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Profiles to Target - {targetPersonaOutput ? targetPersonaOutput : "Please fill the detail and press enter."}
            </Typography>
          </>
        )}

        {jobsData && (
          <FormControl sx={{ mt: 2 }}>
            <Typography variant="h6">Select Company Size</Typography>
            <Select
              value={companySize}
              onChange={(e) => {
                setCompanySize(e.target.value);
                setLocationDisplay(true);
                if (e.target.value === "None") {
                  setcookieDisplay(false);
                } else {
                  setcookieDisplay(true);
                }
              }}
              size="small"
              sx={{ mt: 1 }}
              // disabled={companySize !== "None" ? true : false}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
            </Select>
          </FormControl>
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
              // disabled={industriesDisplay}
              type="password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !jobtitle ||
                    !jobposition ||
                    !cookieContent
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callscrapcompany();
                }
              }}
            />
          </>
        )}

        {profiles && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Profiles
              </Typography>
            </Box>
            {!profiles &&
              profiles.map((item, i) => {
                const cleanedData = Object.fromEntries(
                  Object.entries(item).map(([key, value]) => [
                    key,
                    value
                      .replace(/['"]+/g, "")
                      .replace(`"`, ``)
                      .replace(`\\`, ``)
                      .replace(`\\`, ``)
                      .replace(`\\`, ``)
                      .replace(`\\`, ``)
                      .replace(`]`, ``),
                  ])
                );

                return (
                  <Typography key={i}>
                    {Object.entries(cleanedData).map(([key, value]) =>
                      key !== "query" &&
                      key !== "connectionDegree" &&
                      key !== "timestamp" &&
                      key !== "lastName" &&
                      key !== "firstName" ? (
                        <>
                          <React.Fragment key={key}>
                            <>
                              {key === "Name" ? (
                                <>
                                  <hr />
                                  <br />
                                </>
                              ) : null}
                              {key.charAt(0).toUpperCase() +
                                key.slice(1, key.length)}{" "}
                              -{" "}
                              {key === "ProfileUrl" ? (
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    background: "#121512",
                                    color: "white",
                                    textDecoration: "none",
                                    padding: "5px 10px",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                >
                                  {value.replace("?", "")}
                                </a>
                              ) : (
                                value
                              )}
                              <br />
                            </>
                          </React.Fragment>
                          {key === "location" ? (
                            <>
                              <br />
                            </>
                          ) : null}
                          {/* <hr /> */}
                        </>
                      ) : null
                    )}
                  </Typography>
                );
              })}
            {profiles ? (
              <>
              <ReactJson
                src={profiles.map(({ commpanyUrl, companysize, description, ...rest }) => rest)}
                displayDataTypes={false}
                theme="monokai"
              />
              </>
            ) : null}
          </Box>
        )}

        {profiles && (
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

        {profiles && (
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
              // disabled={yesNoContent ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !targetPresonaContent ||
                    !cookieContent ||
                    !locationContent ||
                    !jobtitle
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
              // disabled={yesNoMessageConnectionContent ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !targetPresonaContent ||
                    !cookieContent ||
                    !locationContent ||
                    !jobtitle
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

      {yesNoContent?.toLowerCase() === "yes" && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Would you like to send an email
            </Typography>
            <TextField
              size="small"
              sx={{ mt: 1, width: "100%" }}
              value={connectionMessageDecisionContent}
              onChange={(e) => {
                setConnectionMessageDecisionContent(e.target.value);
              }}
              // disabled={yesNoMessageConnectionContent ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (
                    !problemStatement ||
                    !productDes ||
                    !targetPresonaContent ||
                    !cookieContent ||
                    !locationContent ||
                    !jobtitle
                  ) {
                    toast.error("Please enter all the details and retry");
                    return;
                  }
                  callYesNoMessageForemail();
                }
              }}
            />
          </>
        )}

        {emailsfound  && 1>2 && yesNoContent?.toLowerCase() === "yes" && (
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
              onClick={sendConnectionRqstJob}
              disabled={characterCount > 300}
            >
              Send
            </Button>
          </>
        )}
        {generatedEmailSubject && 1>2  && generatedEmailContent && emailsfound && (
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

export default Job;
