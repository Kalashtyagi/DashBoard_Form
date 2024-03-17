import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import indianStates from "./state.json";
import { makeStyles } from "@material-ui/core/styles";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import handleApprove from "../Service/patch";



import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormGroup,
  Checkbox,
  FormControlLabel,
  FormLabel,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Signature from "./Signature";
import { mId, fId } from "./const";
import { EditCalendarRounded } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  accordionHeader: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    fontWeight: "bold",
  },

  submitButton: {
    backgroundColor: "#4caf50",
    color: "white",
    "&:hover": {
      backgroundColor: "#388e3c",
    },
  },
  menu: {
    height: "250px",
  },
  // Additional custom styles...
}));

const apiUrl = process.env.REACT_APP_API_URL;

const Tabsection1 = ({ onNext }) => { 
  
  const [merchantExpanded, setMerchantExpanded] = useState(true); // State for Merchant Organization Information
  const [qsaExpanded, setQsaExpanded] = useState(true); // State for Qualified Security Assessor Information
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [parentAccordionExpanded, setParentAccordionExpanded] = useState(true);
  const [isFormEditable, setIsFormEditable] = useState(false);
  const classes = useStyles();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [erpName, setErpName] = useState("");
  const [paymentGateway, setPaymentGateway] = useState("");
  const [thirdPartyService, setThirdPartyService] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [executiveName, setExecutiveName] = useState("");
  const [executiveTitle, setExecutiveTitle] = useState("");
  const [activeSubmit, setActiveSubmit] = useState(false);
  const [formData, setFormData] = useState(null);

  // const [isFormEditable, setIsFormEditable] = useState(false);
  const [isReadyForUpdate, setIsReadyForUpdate] = useState(false);

  //  ................................part 2 code states........................................

  const [businessExpanded, setBusinessExpanded] = useState(true);
  const [applications, setApplications] = useState([
    { name: "", version: "", vendor: "", isListed: null, expiryDate: "" },
  ]);
  const [rows, setRows] = useState([
    // Start with one empty row
    { type: "", number: "", location: "" },
  ]);
  const [serviceProviders, setServiceProviders] = useState([
    { name: "", description: "" },
  ]);
  const [expandedPanel, setExpandedPanel] = useState(null);

  // patch change states
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editDba, setEditDba] = useState("");
  const [editContactName, setEditContactName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editTelephone, setEditTelephone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editState, setEditState] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editBusinessAddress, setEditBusinessAddress] = useState("");
  const [editTransactionHandler, setEditTransactionHandler] = useState("");
  const [editCardDetails, setEditCardDetails] = useState("");
  const [editFacilityData, setEditFacilityData] = useState({
    type: "",
    number: "",
    location: "",
  });
  const [editPaymentApplication, setEditPaymentApplication] = useState({
    name: "",
    version: "",
    vendor: "",
    isListed: true,
    expiryDate: "",
  });
  const [editMerchantUrl, setEditMerchantUrl] = useState(null);
  const [editErpName, setEditErpName] = useState(null);
  const [editPaymentGateway, setEditPaymentGateway] = useState(null);
  const [editThirdServiceProvider, setEditThirdServiceProvider] =
    useState(null);
  const [editServiceProvider, setEditServiceProvider] = useState({
    name: "",
    description: "",
  });
  const [editExecutiveInformation, setEditExecutiveInformation] = useState({
    executiveName: "",
    executiveTitle: "",
  });
  
  console.log("executive", editExecutiveInformation)

  useEffect(() => {
    if (formData && formData.length > 0) {
      const partNameToSetterMap = {
        "Company Name": setEditCompanyName,
        DBA: setEditDba,
        "Contact Name": setEditContactName,
        Title: setEditTitle,
        Telephone: setEditTelephone,
        "E-mail": setEditEmail,
        Country: setEditCountry,
        "State/Province": setEditState,
        City: setEditCity,
        URL: setEditUrl,
        Pincode: setEditPincode,
        "Business Address": setEditBusinessAddress,
        "Transaction Handler": setEditTransactionHandler,
        "Card Details Entry": setEditCardDetails,
        "Facility 1": setEditFacilityData.type,
        "Facility 1": setEditFacilityData.number,
        "Facility 1": setEditFacilityData.location,
        "Payment Application 1": setEditPaymentApplication.name,
        "Payment Application 1": setEditPaymentApplication.expiryDate,
        "Payment Application 1": setEditPaymentApplication.isListed,
        "Payment Application 1": setEditPaymentApplication.vendor,
        "Payment Application 1": setEditPaymentApplication.version,
        "Merchant's Website URL": setEditMerchantUrl,
        "ERP Name": setEditErpName,
        "Payment Gateway": setEditPaymentGateway,
        "Third Party Service Provider": setEditThirdServiceProvider,
        "Service Provider 1": setEditServiceProvider.name,
        "Service Provider 1": setEditServiceProvider.description,
        "Executive Information": setEditExecutiveInformation.executiveName,
        "Executive Information": setEditExecutiveInformation.executiveTitle,
      };

      formData.forEach((item) => {
        const { partName, partResponse } = item;
        const setter = partNameToSetterMap[partName];
        if (setter) {
          setter(partResponse);
        }
      });
    }

    if (formData && Array.isArray(formData) && formData.length > 0) {
      const facilityItem =
        formData.find((item) => item.partName === "Facility 1");
      if (facilityItem) {
        const facilityObject = JSON.parse(facilityItem.partResponse);
        setEditFacilityData(facilityObject);
      }
    }
    console.log("editfacility", editFacilityData);
    if (formData && Array.isArray(formData) && formData.length > 0) {
      const paymentApplication =

        formData.find((item) => item.partName === "Payment Application 1");
      if (paymentApplication) {
        const paymentApplicationObject = JSON.parse(
          paymentApplication.partResponse
        );
        // Set the parsed object to state
        setEditPaymentApplication(paymentApplicationObject);
      }
    }
    if (formData && Array.isArray(formData) && formData.length > 0) {
      const serviceProvider =

        formData.find((item) => item.partName === "Service Provider 1");
      if (serviceProvider) {
        // Parse the JSON string from partResponse to an object
        const serviceProviderObject = JSON.parse(serviceProvider.partResponse);
        // Set the parsed object to state
        setEditServiceProvider(serviceProviderObject);
      }
    }
    if (formData && Array.isArray(formData) && formData.length > 0) {
      const executiveInformation =
        formData.find((item) => item.partName === "Executive Information");
      if (executiveInformation) {
        // Parse the JSON string from partResponse to an object
        const executiveInformationObject = JSON.parse(
          executiveInformation.partResponse
        );
        // Set the parsed object to state
        setEditExecutiveInformation(executiveInformationObject);
      }
    }
  }, [formData]);


  console.log("edIT", editServiceProvider);

  // ..............................................part 3...................................

  const handleInputChange2 = (e, index, fieldName) => {
    console.log("Selected Date for Application:", e.target.value); // Debugging: Log selected date
    const newApplications = applications.map((app, appIndex) => {
      if (appIndex === index) {
        return { ...app, [fieldName]: e.target.value };
      }
      return app;
    });
    setApplications(newApplications);
  };

  // fetchingMerchantData
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}GetFormDataByFormIdAndMerchantId?formId=${fId}&merchantId=${mId}`
        );
        setFormData(response.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log(formData, "fm");
  

  const handleSubmitPost = async (e) => {
    if(activeSubmit){
           handleApprove(e);
           return;
    }

    try {
      const payload = {
        formID: fId,
        merchantID: mId,
        // submissionDate: new Date().toISOString(),
        isFinalSubmission: true,
      };

      const response = await axios.post(
        `${apiUrl}CreateMerchantFormSubmissions`,
        payload,
        {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        }
      );

      const result = await response.data;

      console.log("API Response:", response.data.message);
      toast.success(result.message);
      window.location.reload();

      // Additional logic or state updates after successful submission
    } catch (error) {
      console.error("Error:", error);
      // Handle error scenarios
    }
  };
  const patchModifiedFields = async () => {
    const patchData = [];

    if (editCompanyName !== formData[0]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editCompanyName,
        partName: formData[0].partName,

      });
    }

    if (editDba !== formData[1]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editDba,
        partName: formData[1].partName,
      });
    }

    if (editContactName !== formData[2]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editContactName,
        partName: formData[2].partName,
      });
    }

    if (editTitle !== formData[3]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editTitle,
        partName: formData[3].partName,
      });
    }

    if (editTelephone !== formData[4]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editTelephone,
        partName: formData[4].partName,
      });
    }

    if (editEmail !== formData[5]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editEmail,
        partName: formData[5].partName,
      });
    }

    if (editCountry !== formData[6]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editCountry,
        partName: formData[6].partName,
      });
    }
    if (editState !== formData[7]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editState,
        partName: formData[7].partName,
      });
    }
    if (editCity !== formData[8]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editCity,
        partName: formData[8].partName,
      });
    }
    if (editUrl !== formData[9]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editUrl,
        partName: formData[9].partName,
      });
    }
    if (editPincode !== formData[10]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editPincode,
        partName: formData[10].partName,
      });
    }
    if (editBusinessAddress !== formData[11]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editBusinessAddress,
        partName: formData[11].partName,
      });
    }
    if (editTransactionHandler !== formData[12]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editTransactionHandler,
        partName: formData[12].partName,
      });
    }
    if (editCardDetails !== formData[13]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editCardDetails,
        partName: formData[13].partName,
      });
    }
    if (editFacilityData !== formData[14]?.partResponse) {
      const st = JSON.stringify(editFacilityData);
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: st,
        partName: formData[14].partName
      })
    }
    if (editPaymentApplication !== formData[15]?.partResponse) {
      const st = JSON.stringify(editPaymentApplication);
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: st,
        partName: formData[15].partName
      })
    }


    if (editMerchantUrl !== formData[16]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editMerchantUrl,
        partName: formData[16].partName,
      });
    }
    if (editErpName !== formData[17]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editErpName,
        partName: formData[17].partName,
      });
    }
    if (editPaymentGateway !== formData[18]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editPaymentGateway,
        partName: formData[18].partName,
      });
    }
    if (editThirdServiceProvider !== formData[19]?.partResponse) {
      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: editThirdServiceProvider,
        partName: formData[19].partName,
      });
    }
    if (editServiceProvider !== formData[20]?.partResponse) {
      const st = JSON.stringify(editServiceProvider);

      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: st,
        partName: formData[20].partName,
      });
    }
    if (editExecutiveInformation !== formData[21]?.partResponse) {
      const st = JSON.stringify(editExecutiveInformation);

      patchData.push({
        path: "/partResponse",
        op: "replace",
        value: st,
        partName: formData[21].partName,
      });
    }


    if (patchData.length > 0) {
      try {
        // Create an array of promises for each patch request
        const patchRequests = patchData.map(async patch => {
          const partName = patch.partName
          const response = await axios.patch(
            `${apiUrl}PatchMerchantFormParts?formId=${fId}&merchantId=${mId}&partName=${partName}`,
            [patch], // Pass each patch separately
            {
              headers: {
                "Content-Type": "application/json-patch+json",
              },
            }
          );
          return response.data; // Return the data from each request
        });

        // Execute all patch requests concurrently
        const patchResponses = await Promise.all(patchRequests);

        // Log all patch responses
        patchResponses.forEach((responseData, index) => {
          console.log(`Patch response ${index + 1}:`, responseData);
        });

        // Update formData state with new values if needed
        // if (patchResponses.length > 0) {
        //   const updatedFormData = { ...formData };
        //   patchResponses.forEach((responseData, index) => {
        //     const updatedIndex = index === 0 ? 0 : 1;
        //     updatedFormData[updatedIndex] = {
        //       ...responseData[updatedIndex],
        //       partResponse: index === 0 ? editCompanyName : editDba,
        //     };
        //   });
        //   setFormData(updatedFormData);
        // }

        toast.success("Update Successfully please submit your form");
        // window.location.reload();
        setActiveSubmit(true);
      } catch (error) {
        console.error("Error patching data:", error);
        toast.error("Failed to update form.");
      }
    }
  };


console.log("dit",editPaymentApplication)
  const handleEditUpdateToggle = () => {
    if (isFormEditable && isReadyForUpdate) {
      patchModifiedFields(); // PATCH changes and update the UI state
      setIsReadyForUpdate(false); // Reset ready for update state
    } else {
      setIsFormEditable(!isFormEditable); // Just toggle edit mode
      if (!isFormEditable) {
        setIsReadyForUpdate(true); // The user is about to make changes
      }
    }
  };
  const handleExecutiveNameChange = (event) => {
    setExecutiveName(event.target.value);
  };

  const handleExecutiveTitleChange = (event) => {
    setExecutiveTitle(event.target.value);
  };

  const handleParentAccordionToggle = () => {
    setParentAccordionExpanded(!parentAccordionExpanded);
  };

  const handleMerchantAccordionToggle = () => {
    setMerchantExpanded(!merchantExpanded);
  };

  const accordionStyle = {
    width: "100%", // Ensure full width
    marginTop: "15px",
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    // Reset state when country changes
    setState("");
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  console.log("state", state);

  //   ..................................part 2 code (function and styles)...................................

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleAddRow = () => {
    const newRow = { type: "", number: "", location: "" };
    setRows([...rows, newRow]);
  };

  const handleInputChange = (e, index, field) => {
    const newRows = [...rows];
    newRows[index][field] = e.target.value;
    setRows(newRows);
  };
  const setEditFacilityData1 = (e, index, field) => {
    const newRows = { ...editFacilityData };
    newRows[index][field] = e.target.value;
    setEditFacilityData(newRows);
  }

  const handleAccordionToggle = () => {
    setBusinessExpanded(!businessExpanded);
  };

  const handleCheckboxChange = (index, value) => {
    // Set the selected checkbox and make sure the other one is unchecked
    setApplications(
      applications.map((app, i) => {
        if (i === index) {
          return { ...app, isListed: value };
        }
        return app;
      })
    );
  };

  const handleInputChange1 = (e, index, field) => {
    const newApplications = [...applications];
    newApplications[index][field] = e.target.value;
    setApplications(newApplications);
  };
  const setEditPaymentApplication1 = (e, index, field) => {
    const newApplications = [...editPaymentApplication];
    newApplications[index][field] = e.target.value;
    setEditPaymentApplication(newApplications);
  }

  const addApplicationRow = () => {
    setApplications([
      ...applications,
      { name: "", version: "", vendor: "", isListed: null, expiryDate: "" },
    ]);
  };

  const handleAddServiceProvider = () => {
    setServiceProviders([...serviceProviders, { name: "", description: "" }]);
  };

  const handleServiceProviderChange = (index, field, value) => {
    const updatedProviders = [...serviceProviders];
    updatedProviders[index][field] = value;
    setServiceProviders(updatedProviders);
  };
  const handleServiceProviderChange1 = (index, field, value) => {
    const updatedProviders = [...editServiceProvider];
    updatedProviders[index, field] = value;
    setEditServiceProvider(updatedProviders);

  }

  const handleRemoveRow = (index) => {
    if (index > 0) {
      const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
      setRows(newRows);
    }
  };

  const handleRemoveApplication = (index) => {
    if (index > 0) {
      const newApplications = applications.filter(
        (_, appIndex) => appIndex !== index
      );
      setApplications(newApplications);
    }
  };

  // styles .................................................................................................................

  const formStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    // backgroundColor: '#f2f2f2',
    border: "1px solid #ccc",
    marginBottom: "10px",
  };

  const checkboxGroupStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  };

  const checkboxStyle = {
    display: "flex",
    flexDirection: "column",
    // backgroundColor: '#fff',
    padding: "10px",
    // border: '1px solid #ccc',
    borderRadius: "4px",
  };
  const formSectionStyle = {
    // backgroundColor: '#f2f2f2',
    padding: "20px",
    marginBottom: "10px",
  };

  const checkboxContainerStyle = {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  };

  const checkboxLabelStyle = {
    display: "block",
    fontWeight: "bold",
    margin: "0 0 10px 0",
  };

  const noteStyle = {
    backgroundColor: "lightyellow",
    borderLeft: "5px solid #ffeb3b",
    padding: "10px",
    marginTop: "20px",
  };
  const inputTextStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box", // So padding doesn't add to the width
  };

  // Style object for the accordion details
  const detailsStyle = {
    padding: "20px",
    borderTop: "1px solid #000", // This creates the black border line seen in the image
  };

  const handleSavepost = async (event) => {
    event.preventDefault();

    // Define an array to hold all parts of the form
    const staticParts = [
      {
        partName: "Company Name",
        partResponse: document.getElementById("company-name").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },

      {
        partName: "DBA",
        partResponse: document.getElementById("dba").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Contact Name",
        partResponse: document.getElementById("contact-name").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Title",
        partResponse: document.getElementById("title").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Telephone",
        partResponse: document.getElementById("telephone").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "E-mail",
        partResponse: document.getElementById("email").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Country",
        partResponse: document.getElementById("country").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "State/Province",
        partResponse: state,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "City",
        partResponse: document.getElementById("city").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },

      {
        partName: "URL",
        partResponse: document.getElementById("url").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Pincode",
        partResponse: document.getElementById("Pincode").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Business Address",
        partResponse: document.getElementById("business-address").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Transaction Handler",
        partResponse: document.getElementById("transaction-handler").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Card Details Entry",
        partResponse: document.getElementById("card-details-entry").value,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
    ];

    const constructPayload = () => {
      // Assuming 'rows' is your state that holds the table data
      return rows.map((row, index) => ({
        partName: `Facility ${index + 1}`, // Unique name for each facility part
        partResponse: JSON.stringify({
          type: row.type, // Facility type from the row
          number: row.number, // Number of facilities of this type from the row
          location: row.location, // Location(s) of the facility from the row
        }),
        formId: fId,
        merchantId: mId,
        status: "submitted", // Status of the part
      }));
    };

    const constructApplicationsPayload = () => {
      return applications.map((app, index) => ({
        partName: `Payment Application ${index + 1}`, // Unique name for each payment application part
        partResponse: JSON.stringify({
          name: app.name, // Application name from the row
          version: app.version, // Version number from the row
          vendor: app.vendor, // Application vendor from the row
          isListed: app.isListed, // PA-DSS Listed status from the row
          expiryDate: app.expiryDate, // PA-DSS Listing Expiry date from the row
        }),
        formId: fId,
        merchantId: mId,
        status: "submitted", // Status of the part
      }));
    };

    const newFieldParts = [
      {
        partName: "Merchant's Website URL",
        partResponse: websiteUrl,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "ERP Name",
        partResponse: erpName,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Payment Gateway",
        partResponse: paymentGateway,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
      {
        partName: "Third Party Service Provider",
        partResponse: thirdPartyService,
        formId: fId,
        merchantId: mId,
        status: "submitted",
      },
    ];

    const constructServiceProvidersPayload = () => {
      return serviceProviders.map((provider, index) => ({
        partName: `Service Provider ${index + 1}`,
        partResponse: JSON.stringify({
          name: provider.name,
          description: provider.description,
        }),
        formId: fId,
        merchantId: mId,
        status: "submitted",
      }));
    };

    const executivePart = {
      partName: "Executive Information",
      partResponse: JSON.stringify({
        submissionDate,
        executiveName,
        executiveTitle,
        // For signature, you might need to handle file upload differently based on your backend
        // signature: [You may need to convert the image to a suitable format or handle file uploads separately]
      }),
      formId: fId,
      merchantId: mId,
      status: "submitted",
    };

    const dynamicFacilityParts = constructPayload();

    // Generate dynamic parts from the payment applications table
    const dynamicApplicationParts = constructApplicationsPayload();
    const serviceProvidersPayload = constructServiceProvidersPayload();

    const combinedParts = [
      ...staticParts,
      ...dynamicFacilityParts,
      ...dynamicApplicationParts,
      ...newFieldParts,
      ...serviceProvidersPayload,
      executivePart,
    ];

    // API endpoint and posting logic
    const apiurl = `${apiUrl}CreateMerchantFormParts`;

    for (const part of combinedParts) {
      try {
        const response = await axios.post(apiurl, part);
        console.log(`Response for ${part.partName}:`, response.data);
        setActiveSubmit(true);
      } catch (error) {
        console.error(`Error posting ${part.partName}:`, error);
      }
    }
    setIsFormEditable(false); // Disable form editing after save
    setActiveSubmit(true);
  };

  return (
    <>
      <form onSubmit={handleSavepost}>
        <Box
          sx={{ 
            display: "flex",
            flexDirection: "column",
            "& > :not(style)": { m: 1 },
          }}
        >
          {/* Parent Accordion */}
          <Accordion
            expanded={parentAccordionExpanded}
            onChange={handleParentAccordionToggle}
            sx={{ width: "100%", marginTop: "15px" }}
          >
            <AccordionSummary
              className={classes.accordionHeader}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="parent-panel-content"
              id="parent-panel-header"
            >
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{ color: "text.secondary", my: 2 }}
              >
                Part 1: Merchant and Qualified Security Assessor Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: 'center',
                  "& > :not(style)": { m: 1 },
                }}
              >
                <Accordion
                  expanded={merchantExpanded}
                  onChange={handleMerchantAccordionToggle}
                  sx={accordionStyle}
                >
                  <AccordionSummary
                    className={classes.accordionHeader}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="merchant-panel-content"
                    id="merchant-panel-header"
                  >
                    <Typography
                      variant="h5" // Adjust the variant as needed
                      component="h1" // The semantic element to be used
                      gutterBottom // Adds a bottom margin to the Typography
                      sx={{
                        color: "text.secondary", // Attractive light black color
                        my: 2, // Margin top and bottom, adjust as needed
                      }}
                    >
                      1.A: Merchant Organization Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          className={classes.formField}
                          fullWidth
                          id="company-name"
                          value={editCompanyName}
                          onChange={(e) => setEditCompanyName(e.target.value)}
                          label="Company Name"
                          inputlabelprops={{
                            shrink: true,
                          }}
                          helperText=" " // Blank helper text to align fields
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="dba"
                          label="DBA (doing business as)"
                          value={editDba}
                          onChange={(e) => setEditDba(e.target.value)}
                          helperText=" "
                          inputlabelprops={{
                            shrink: true,
                          }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="contact-name"
                          label="Contact Name"
                          value={editContactName}
                          onChange={(e) => setEditContactName(e.target.value)}
                          helperText=" "
                          inputlabelprops={{
                            shrink: true,
                          }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="title"
                          value={editTitle}
                          label="Title"
                          onChange={(e) => setEditTitle(e.target.value)}
                          inputlabelprops={{
                            shrink: true,
                          }}
                          helperText=" "
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          id="telephone"
                          value={editTelephone}
                          onChange={(e) => setEditTelephone(e.target.value)}
                          inputlabelprops={{
                            shrink: true,
                          }}
                          label="Telephone"
                          helperText=" "
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="email"
                          label="E-mail"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          inputlabelprops={{
                            shrink: true,
                          }}
                          helperText=" "
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="country"
                          label="Country"
                          helperText=" "
                          value={
                            formData && formData.length > 0
                              ? editCountry
                              : country
                          }
                          
                          inputlabelprops={{
                            shrink: true,
                          }}
                          onChange={
                            formData && formData.length > 0
                              ? (e) => setEditCountry(e.target.value)
                              : handleCountryChange
                          }
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                          <InputLabel id="state-province-label">
                            State/Province
                          </InputLabel>
                          <Select
                            labelId="state-province-label"
                            id="state-province"
                            value={
                              formData && formData.length > 0
                                ? editState
                                : state
                            }
                            inputlabelprops={{
                              shrink: true,
                            }}
                            required
                            label="State/Province"
                            
                            onChange={
                              formData && formData.length > 0
                                ? (e) => setEditState(e.target.value)
                                : handleStateChange
                            }
                            // disabled={country !== "India" && !isFormEditable} 
                            MenuProps={{
                              classes: { paper: classes.menu },
                            }}
                          >
                            {indianStates.India.states.map(
                              (indianState, index) => (
                                <MenuItem key={index} value={indianState.name}>
                                  {indianState.name}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="city"
                          label="City"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          inputlabelprops={{
                            shrink: true,
                          }}
                          helperText=" "
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="url"
                          label="URL"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          inputlabelprops={{
                            shrink: true,
                          }}
                          helperText=" "
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="Pincode"
                          label="Pincode"
                          value={editPincode}
                          onChange={(e) => setEditPincode(e.target.value)}
                          inputlabelprops={{
                            shrink: true,
                          }}
                          helperText=" "
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          disabled={
                            formData && formData.length > 0
                              ? !isFormEditable
                              : isFormEditable
                          }
                          fullWidth
                          id="business-address"
                          label="Business Address"
                          value={editBusinessAddress}
                          onChange={(e) =>
                            setEditBusinessAddress(e.target.value)
                          }
                          inputlabelprops={{
                            shrink: true,
                          }}
                          helperText=" "
                          required
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: 'center',
                  "& > :not(style)": { m: 1 },
                }}
              ></Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* .........................................../* part 2 jsx code ................................................  */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            "& > :not(style)": { m: 1 },
          }}
        >
          <Accordion sx={{ width: "100%", marginTop: "15px" }}>
            <AccordionSummary
              className={classes.accordionHeader}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="executive-summary-content"
              id="executive-summary-header"
            >
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{ color: "text.secondary", my: 2 }}
              >
                Part 2: Executive Summary
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="form-container">
                <Accordion
                  expanded={expandedPanel === "panelDescription"}
                  onChange={handleAccordionChange("panelDescription")}
                >
                  <AccordionSummary
                    className={classes.accordionHeader}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2b-content"
                    id="panel2b-header"
                  >
                    <h2
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        marginLeft: "7px",
                      }}
                    >
                      Description of Payment Card Business
                    </h2>
                  </AccordionSummary>
                  <AccordionDetails style={detailsStyle}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      style={{ fontSize: "1rem", fontWeight: "bold" }}
                    >
                      How and in what capacity does your business store, process
                      and/or transmit cardholder data?
                    </Typography>

                    <br />

                    <Typography component="div" gutterBottom>
                      We do not Store, Process or Transmit any Card Holder Data.
                      Payment processing has been fully outsourced. Transactions
                      involving Debit / Credit cards are handled by
                      <TextField
                        disabled={
                          formData && formData.length > 0
                            ? !isFormEditable
                            : isFormEditable
                        }
                        className={classes.formField}
                        size="small"
                        required
                        id="transaction-handler"
                        variant="outlined"
                        placeholder="Razorpay / CC Avenues"
                        value={editTransactionHandler}
                        onChange={(e) =>
                          setEditTransactionHandler(e.target.value)
                        }
                        inputlabelprops={{
                          shrink: true,
                        }}
                        style={{
                          width: "auto",
                          marginTop: "-8px",
                          marginLeft: "8px",
                          marginRight: "8px",
                          marginBottom: "10px",
                        }}
                      />
                      For Payment, Card details are entered on
                      <TextField
                        disabled={
                          formData && formData.length > 0
                            ? !isFormEditable
                            : isFormEditable
                        }
                        className={classes.formField}
                        size="small"
                        id="card-details-entry"
                        variant="outlined"
                        placeholder=" Mention here card details"
                        value={editCardDetails}
                        onChange={(e) => setEditCardDetails(e.target.value)}
                        inputlabelprops={{
                          shrink: true,
                        }}
                        required
                        style={{
                          width: "auto",
                          marginTop: "-8px",
                          marginLeft: "8px",
                          marginRight: "8px",
                        }}
                      />
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  expanded={expandedPanel === "panelLocations"}
                  onChange={handleAccordionChange("panelLocations")}
                >
                  <AccordionSummary
                    className={classes.accordionHeader}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2b-content"
                    id="panel2b-header"
                  >
                    <h2
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        marginLeft: "7px",
                      }}
                    >
                      Locations
                    </h2>
                  </AccordionSummary>
                  <p style={{ marginLeft: "20px" }}>
                    List types of facilities (for example, retail outlets,
                    corporate offices, data centers, call centers, etc.) and a
                    summary of locations included in the PCI DSS review.
                  </p>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                            >
                              Type of facility
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                              align="center"
                            >
                              Number of facilities of this type
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                              align="center"
                            >
                              Location(s) of facility (city, country)
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {rows.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                <TextField
                                  disabled={
                                    formData && formData.length > 0
                                      ? !isFormEditable
                                      : isFormEditable
                                  }
                                  required
                                  placeholder="Eg-Retail outlets"
                                  // value={row.type}
                                  // value={
                                  //   formData && formData[14]?.partResponse
                                  //     ? JSON.parse(formData[14]?.partResponse)
                                  //         ?.type || row.type
                                  //     : row.type
                                  // }
                                  value={
                                    formData && formData.length > 0
                                      ? editFacilityData?.type
                                      : row.type
                                  }
                                  inputlabelprops={{
                                    shrink: true,
                                  }}
                                  name="type"
                                  onChange={
                                    formData && formData.length > 0
                                      ? (e) => setEditFacilityData({ ...editFacilityData, [e.target.name]: [e.target.value] })
                                      // setEditFacilityData1(e, index, "type")
                                      : (e) =>
                                        handleInputChange(e, index, "type")
                                  }
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  disabled={
                                    formData && formData.length > 0
                                      ? !isFormEditable
                                      : isFormEditable
                                  }
                                  // value={
                                  //   formData && formData[14]?.partResponse
                                  //     ? JSON.parse(formData[14].partResponse)
                                  //         ?.number || row.number
                                  //     : row.number
                                  // }
                                  value={
                                    formData && formData.length > 0
                                      ? editFacilityData?.number
                                      : row.number
                                  }
                                  name="number"
                                  required
                                  // value={row.number}


                                  // onChange={(e) =>
                                  //   handleInputChange(e, index, "number")
                                  // }
                                  onChange={
                                    formData && formData.length > 0
                                      ? (e) => setEditFacilityData({ ...editFacilityData, [e.target.name]: [e.target.value] })
                                      : (e) =>
                                        handleInputChange(e, index, "number")
                                  }
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  disabled={
                                    formData && formData.length > 0
                                      ? !isFormEditable
                                      : isFormEditable
                                  }
                                  required
                                  // value={
                                  //   formData && formData[14]?.partResponse
                                  //     ? JSON.parse(formData[14].partResponse)
                                  //         ?.location || row.location
                                  //     : row.location
                                  // }
                                  value={
                                    formData && formData.length > 0
                                      ? editFacilityData?.location
                                      : row.location
                                  }
                                  className={classes.formField}
                                  // value={row.location}
                                  // onChange={(e) =>
                                  //   handleInputChange(e, index, "location")
                                  // }
                                  name="location"
                                  onChange={
                                    formData && formData.length > 0
                                      ? (e) => setEditFacilityData({ ...editFacilityData, [e.target.name]: [e.target.value] })
                                      : (e) =>
                                        handleInputChange(
                                          e,
                                          index,
                                          "location"
                                        )
                                  }
                                  fullWidth
                                />
                              </TableCell>

                              <TableCell align="right">
                                {index > 0 && (
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleRemoveRow(index)}
                                    sx={{ ml: 1 }} // Add some left margin for spacing
                                  >
                                    Remove
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddRow}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      Add Row
                    </Button>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    className={classes.accordionHeader}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                  >
                    <h2
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        marginLeft: "7px",
                      }}
                    >
                      Payment Application
                    </h2>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        marginLeft: "5px",
                      }}
                    >
                      Provide the following information regarding the Payment
                      Applications your organization uses:
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                            >
                              Payment Application Name
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                            >
                              Version Number
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                            >
                              Application Vendor
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                            >
                              Is application PA-DSS Listed?
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                            >
                              PA-DSS Listing Expiry date (if applicable)
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {applications.map((app, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <TextField
                                  disabled={
                                    formData && formData.length > 0
                                      ? !isFormEditable
                                      : isFormEditable
                                  }
                                  required
                                  className={classes.formField}
                                  // value={app.name}
                                  name="name"
                                  onChange={
                                    formData && formData.length > 0
                                      ? (e) => setEditPaymentApplication({ ...editPaymentApplication, [e.target.name]: [e.target.value] })

                                      : (e) =>
                                        handleInputChange1(e, index, "name")
                                  }
                                  fullWidth
                                  value={
                                    formData && formData.length > 0
                                      ? editPaymentApplication?.name
                                      : app.name
                                  }
                                />

                              </TableCell>
                              <TableCell>
                                <TextField
                                  disabled={
                                    formData && formData.length > 0
                                      ? !isFormEditable
                                      : isFormEditable
                                  }
                                  required
                                  // onChange={(e) =>
                                  //   handleInputChange1(e, index, "version")
                                  // }
                                  name="version"
                                  onChange={
                                    formData && formData.length > 0
                                      ? (e) => setEditPaymentApplication({ ...editPaymentApplication, [e.target.name]: [e.target.value] })

                                      : (e) =>
                                        handleInputChange1(e, index, "version")
                                  }
                                  fullWidth
                                  value={
                                    formData && formData.length > 0
                                      ? editPaymentApplication?.version
                                      : app.version
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  disabled={
                                    formData && formData.length > 0
                                      ? !isFormEditable
                                      : isFormEditable
                                  }
                                  required
                                  // value={app.vendor}
                                  // onChange={(e) =>
                                  //   handleInputChange1(e, index, "vendor")
                                  // }
                                  name="vendor"
                                  onChange={
                                    formData && formData.length > 0
                                      ? (e) => setEditPaymentApplication({ ...editPaymentApplication, [e.target.name]: [e.target.value] })

                                      : (e) =>
                                        handleInputChange1(e, index, "vendor")
                                  }
                                  fullWidth
                                  value={
                                    formData && formData.length > 0
                                      ? editPaymentApplication?.vendor
                                      : app.vendor
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <FormGroup row>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        value={
                                          formData && formData.length > 0
                                            ? editPaymentApplication?.isListed
                                            : app.isListed
                                        } checked={app.isListed === true}
                                        onChange={() =>
                                          handleCheckboxChange(index, true)
                                        }
                                      />
                                    }
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={app.isListed === false}
                                        onChange={() =>
                                          handleCheckboxChange(index, false)
                                        }
                                      />
                                    }
                                    label="No"
                                  />
                                </FormGroup>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  disabled={
                                    formData && formData.length > 0
                                      ? !isFormEditable
                                      : isFormEditable
                                  }
                                  name="expiryDate"
                                  value={
                                    formData && formData.length > 0
                                      ? editPaymentApplication?.expiryDate
                                      : app.expiryDate
                                  }
                                  required
                                  fullWidth
                                  type="date"
                                  // value={app.expiryDate || ""}
                                  // onChange={(e) =>
                                  //   handleInputChange2(e, index, "expiryDate")
                                  // } 
                                  onChange={
                                    formData && formData.length > 0
                                      ? (e) => setEditPaymentApplication({ ...editPaymentApplication, [e.target.name]: [e.target.value] })

                                      : (e) =>
                                        handleInputChange1(e, index, "expiryDate")
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {index > 0 && (
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                      handleRemoveApplication(index)
                                    }
                                    sx={{ ml: 1 }} // Add some left margin for spacing
                                  >
                                    Remove
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addApplicationRow}
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "10px" }}
                    >
                      Add Application
                    </Button>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    className={classes.accordionHeader}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2e-content"
                    id="panel2e-header"
                  >
                    <h2
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        marginLeft: "7px",
                      }}
                    >
                      Description of Environment
                    </h2>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle1" gutterBottom>
                      Please mention the following here:
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Brief the IT infrastructure of the Merchant's
                      organization:
                    </Typography>
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            disabled={
                              formData && formData.length > 0
                                ? !isFormEditable
                                : isFormEditable
                            }
                            className={classes.formField}
                            fullWidth
                            required
                            label="Merchant's website URL"
                            variant="outlined"
                            placeholder="http://www.example.com"
                            // value={websiteUrl}
                            value={
                              formData && formData.length > 0
                                ? editMerchantUrl
                                : websiteUrl
                            }
                            inputlabelprops={{
                              shrink: true,
                            }}
                            onChange={
                              formData && formData.length > 0
                                ? (e) => setEditMerchantUrl(e.target.value)
                                : (e) => setWebsiteUrl(e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            disabled={
                              formData && formData.length > 0
                                ? !isFormEditable
                                : isFormEditable
                            }
                            className={classes.formField}
                            fullWidth
                            label="Name of ERP - If any"
                            variant="outlined"
                            placeholder="e.g., Octopot"
                            // value={erpName}
                            // value={
                            //   (formData && formData[17]?.partResponse) ||
                            //   erpName
                            // }
                            value={
                              formData && formData.length > 0
                                ? editErpName
                                : erpName
                            }
                            inputlabelprops={{
                              shrink: true,
                            }}
                            required
                            onChange={
                              formData && formData.length > 0
                                ? (e) => setEditErpName(e.target.value)
                                : (e) => setErpName(e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            disabled={
                              formData && formData.length > 0
                                ? !isFormEditable
                                : isFormEditable
                            }
                            className={classes.formField}
                            fullWidth
                            required
                            label="Payment Gateway"
                            variant="outlined"
                            placeholder="e.g., CC Avenues / Razorpay / Billdesk"
                            // value={paymentGateway}
                            // value={
                            //   (formData && formData[18]?.partResponse) ||
                            //   paymentGateway
                            // }
                            value={
                              formData && formData.length > 0
                                ? editPaymentGateway
                                : paymentGateway
                            }
                            inputlabelprops={{
                              shrink: true,
                            }}
                            onChange={
                              formData && formData.length > 0
                                ? (e) => setEditPaymentGateway(e.target.value)
                                : (e) => setPaymentGateway(e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            disabled={
                              formData && formData.length > 0
                                ? !isFormEditable
                                : isFormEditable
                            }
                            className={classes.formField}
                            fullWidth
                            required
                            label="Any other third party service Provider"
                            variant="outlined"
                            placeholder="e.g., Juspay"
                            // value={thirdPartyService}
                            // value={
                            //   (formData && formData[19]?.partResponse) ||
                            //   thirdPartyService
                            // }
                            value={
                              formData && formData.length > 0
                                ? editThirdServiceProvider
                                : thirdPartyService
                            }
                            inputlabelprops={{
                              shrink: true,
                            }}
                            onChange={
                              formData && formData.length > 0
                                ? (e) =>
                                  setEditThirdServiceProvider(e.target.value)
                                : (e) => setThirdPartyService(e.target.value)
                            }
                          />
                        </Grid>
                        {/* Add any additional fields as necessary */}
                      </Grid>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    className={classes.accordionHeader}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2f-content"
                    id="panel2f-header"
                  >
                    <h2
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        marginLeft: "7px",
                      }}
                    >
                      Third-Party Service Providers
                    </h2>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl component="fieldset" fullWidth margin="normal">
                      <FormLabel
                        component="legend"
                        style={{ fontWeight: "bold", fontSize: "1rem" }}
                      >
                        Does your company share cardholder data with any
                        third-party service providers?
                      </FormLabel>
                    </FormControl>

                    <>
                      <TableContainer
                        component={Paper}
                        variant="outlined"
                        margin="normal"
                      >
                        <Table aria-label="service providers table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  textAlign: "center",
                                }}
                              >
                                Name of service provider
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  textAlign: "center",
                                }}
                              >
                                Description of services provided
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {serviceProviders.map((provider, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <TextField
                                    disabled={
                                      formData && formData.length > 0
                                        ? !isFormEditable
                                        : isFormEditable
                                    }
                                    value={
                                      formData && formData.length > 0
                                        ? editServiceProvider.name
                                        : provider.name
                                    }
                                    required
                                    name="name"
                                    // value={provider.name}
                                    onChange={
                                      formData && formData.length > 0
                                        ? (e) =>
                                          setEditServiceProvider({ ...editServiceProvider, [e.target.name]: [e.target.value] })
                                        : (e) =>
                                          handleServiceProviderChange(
                                            index,
                                            "name",
                                            e.target.value
                                          )
                                    }
                                    fullWidth
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    disabled={
                                      formData && formData.length > 0
                                        ? !isFormEditable
                                        : isFormEditable
                                    }
                                    name="description"
                                    required
                                    // value={provider.description}
                                    value={
                                      formData && formData.length > 0
                                        ? editServiceProvider.description
                                        : provider.description
                                    }
                                    onChange={
                                      formData && formData.length > 0
                                        ? (e) =>
                                          setEditServiceProvider({ ...editServiceProvider, [e.target.name]: [e.target.value] }) : (e) =>
                                          handleServiceProviderChange(
                                            index,
                                            "description",
                                            e.target.value
                                          )
                                    }
                                    fullWidth
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddServiceProvider}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "10px" }}
                      >
                        Add Service Provider
                      </Button>
                    </>
                  </AccordionDetails>
                </Accordion>
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              sx={{ color: "text.secondary", my: 2 }}
            >
              Part 3. PCI DSS Validation
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  3A. Merchant Attestation
                </h2>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  style={{
                    display: "flex",
                    flexDirection:'row',
                    // flexWrap:'wrap',
                    // flexDirection: "row",
                    // justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      flex: "1 1 auto",
                      marginRight: "16px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{ width: "auto" }}
                      >
                        Merchant Executive Officer Name:
                      </Typography>
                      <TextField
                        disabled={
                          formData && formData.length > 0
                            ? !isFormEditable
                            : isFormEditable
                        }
                        required
                        value={
                          formData && formData.length > 0
                            ? editExecutiveInformation.executiveName
                            : executiveName
                        }
                        name="executiveName"
                        onChange={
                          formData && formData.length > 0
                            ? (e) => setEditExecutiveInformation({ ...editExecutiveInformation, [e.target.name]: [e.target.value] })
                            : handleExecutiveNameChange
                        }
                        label="Executive Officer Name"
                        className={classes.formField}
                        sx={{ width: 200 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      // flexDirection:'wrap',

                      gap: 2,
                      flex: "1 1 auto",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{ width: "auto" }}
                      >
                        Title:
                      </Typography>
                      <TextField
                        disabled={
                          formData && formData.length > 0
                            ? !isFormEditable
                            : isFormEditable
                        }
                        required
                        // value={executiveTitle}
                        // value={patchExecutiveTitle}
                        value={
                          formData && formData.length > 0
                            ? editExecutiveInformation.executiveTitle
                            : executiveTitle
                        }
                        name="executiveTitle"
                        onChange={
                          formData && formData.length > 0
                            ? (e) => setEditExecutiveInformation({ ...editExecutiveInformation, [e.target.name]: [e.target.value] })
                            : handleExecutiveTitleChange
                        }
                        className={classes.formField}
                        label="Title"
                        sx={{ width: 200 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                    {/* <Box sx={{justifyContent:'flex-start'}}> */}
                    <Signature />

                    {/* </Box> */}
                  </Box>
                </div>
              </AccordionDetails>
            </Accordion>
          </AccordionDetails>
        </Accordion>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            mb: 15,
          }}
        >
          {formData && formData.length > 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditUpdateToggle}
              style={{ width: "150px", height: "40px" }}
            >
              {isFormEditable ? "Update" : "Edit"}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ width: "150px", height: "40px" }}
            >
              Save
            </Button>
          )}

          <Button
            disabled={activeSubmit === false}
            // type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmitPost}
            style={{ width: "150px", height: "40px", marginLeft: "20px" }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Tabsection1;
