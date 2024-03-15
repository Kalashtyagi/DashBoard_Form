


import { Box, Button, TextField } from "@mui/material";
import { Grid } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Header from "../../components/Header";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import { SidebarContext } from "../global/SidebarContext";
import { useContext } from "react";
import { DarkContext } from "../global/DarkBar";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../../apiConfig";
import { CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Form = () => {
  const AdminId = sessionStorage.getItem("userId");
  const AdminEmail=sessionStorage.getItem('AdminEmail')
  const { isDark } = useContext(DarkContext);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { isCollapsed } = useContext(SidebarContext);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const[selectImage,setSelectImage]=useState('');
  
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      merchantType: "", 
    },
  });
  const handleImage = (e) => {
    const file = e.target.files[0];
    setSelectImage(file);

  };


  const onSubmit = async (data) => {
    setLoading(true);
   
    const formData=new FormData();
    formData.append("caseOwner",AdminId);
    formData.append("creatorEmailID",AdminEmail);
    formData.append("status",true);
    formData.append("dbaName",data.dbaName);
    formData.append("email",data.email);
    formData.append("leagalName",data.leagalName);
    formData.append("merchantType",data.merchantType);
    formData.append("image",selectImage);
    try {
      const response = await axios.post(
        `${BASE_URL}createMerchant`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
         
        }
      );
      console.log("response",response)

      if (response?.status == 200) {
        const responseData = await response?.data;
        console.log("API Response:", responseData);
        toast.success(responseData?.message);
        reset();
        setLoading(false);

      } 
    } catch (error) {
      console.error("API Error:", error);
      toast.error("something went wrong");
      reset();
    } finally {
      setLoading(false);
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    console.log("file", selectedFile);
    const formData = new FormData();
    if (selectedFile == null) {
      toast.warning("please select excel file");
      return;
    }
    try {
      formData.append("file", selectedFile);

      const response = await axios.post(
        `${BASE_URL}BulkUploadMerchan`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response);
      const result = await response.data;
      if (result?.statusCode === 200) {
        toast.success(result.message);
        setSelectedFile("");
      }
    } catch (error) {
      toast.error("something went wrong plz try again");
      setSelectedFile("");

      console.log("error", error);
    }
  };

  return (
    <>
      <Box
        m="20px"
        sx={{
          marginLeft: isCollapsed ? "100px" : "300px",
          transition: "margin-left 0.3s",
        }}
      >
        <Accordion
          defaultExpanded
          style={{ backgroundColor: isDark ? "white" : "#2e3b47" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>
              <Box display="flex" justifyContent="space-between">
                <Header
                  title="Add Single Merchant "
                  subtitle="Create a single Merchant"
                />
              </Box>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(6, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Legal Name"
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{
                    style: {
                      color: isDark ? "black" : "white",
                    },
                  }}
                  {...register("leagalName", {
                    required: "Name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabetical characters are allowed",
                    },
                  })}
                  error={Boolean(errors.name)}
                  helperText={
                    <span
                      style={{
                        position: "absolute",
                        color: "red",
                        fontSize: "14px",
                        marginLeft: "-10px",
                      }}
                    >
                      {errors.name?.message}
                    </span>
                  }
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  label="Email"
                  InputLabelProps={{
                    style: {
                      color: isDark ? "black" : "white",
                    },
                  }}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  sx={{ gridColumn: "span 2" }}
                  error={Boolean(errors.email)}
                  helperText={
                    <span
                      style={{
                        position: "absolute",
                        color: "red",
                        fontSize: "14px",
                        // top: '50px',
                        marginLeft: "-10px",
                      }}
                    >
                      {errors.email?.message}
                    </span>
                  }
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Dba Name"
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{
                    style: {
                      color: isDark ? "black" : "white",
                    },
                  }}
                  {...register("dbaName", {
                    required: "Name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabetical characters are allowed",
                    },
                  })}
                  error={Boolean(errors.name)}
                  helperText={
                    <span
                      style={{
                        position: "absolute",
                        color: "red",
                        fontSize: "14px",
                        marginLeft: "-10px",
                      }}
                    >
                      {errors.name?.message}
                    </span>
                  }
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{
                    style: {
                      color: isDark ? "black" : "white",
                    },
                  }}
                
                />

                <Box sx={{ gridColumn: "span 2" }}>
                  <FormControl variant="filled" fullWidth>
                    <InputLabel
                      id="demo-simple-select-filled-label"
                      style={{ color: isDark ? "black" : "white" }}
                    >
                      Merchant Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Merchant Type"
                      type="select"
                      {...register("merchantType", {
                        required: "Merchant Type is required",
                      })}
                      error={Boolean(errors.merchantType)}
                      helperText={
                        <span
                          style={{
                            position: "absolute",
                            fontSize: "14px",
                            marginLeft: "-10px",
                          }}
                        >
                          {errors.merchantType?.message}
                        </span>
                      }
                    >
                      <MenuItem disabled value="">
                        Choice option
                      </MenuItem>
                      <MenuItem value="Level 1">Level 1</MenuItem>
                      <MenuItem value="Level 2">Level 2</MenuItem>
                      <MenuItem value="Level 3">Level 3</MenuItem>
                      <MenuItem value="Level 4">Level 4</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained"disabled={loading}>
                  Create New Merchant
                </Button>
              </Box>
            </form>
          </AccordionDetails>
        </Accordion>

      </Box>
      <Box
        m="20px"
        sx={{
          marginLeft: isCollapsed ? "100px" : "300px",
          transition: "margin-left 0.3s",
        }}
      >
        <Accordion
          // defaultExpanded
          style={{ backgroundColor: isDark ? "white" : "#2e3b47" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>
              <Box display="flex" justifyContent="space-between">
                <Header
                  title="Add Multiple Merchant "
                  subtitle="Create multiple Merchant"
                />
              </Box>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
           
            <Grid container spacing={3}>
                <Grid item sx={4}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    style={{
                      fontSize: "20px",
                      color: "blueviolet",
                      backgroundColor: "white",
                      height: "40px",
                    }}
                  >
                    Select file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <p>Accept only xls or xlsx</p>
                  <p style={{ color: "#03c6a1" }}>
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </p>
                </Grid>
                <Grid item sx={4}>
                 
                  <Button type="submit" color="secondary" variant="contained" size="large"onClick={handleUpload}>
                    Upload
                  </Button>
                </Grid>
                <Grid item xs={2} >
                  <Button variant="contained" color="success" size="small">
                    <DownloadIcon fontSize="large" />
                    Download Sample
                  </Button>
                </Grid>
              </Grid>
          </AccordionDetails>
        </Accordion>

      </Box>
       
        <ToastContainer position="top-center" />
    </>
  );
};

export default Form;