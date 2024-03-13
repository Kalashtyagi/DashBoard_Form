
import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
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
import { v4 as uuidv4 } from "uuid";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useQuery } from "@tanstack/react-query";
import EmailIcon from "@mui/icons-material/Email";
const MrmEmail=sessionStorage.getItem("MrmEmail");
console.log("mrm",MrmEmail);

// const fetchData1 = async () => {
//     const response = await fetch(`${BASE_URL}GetallMerchant`);
//     const result = await response.json();
//     const rowsWithIds = result?.data.map((row) => ({ ...row, id: uuidv4() }));
//     return rowsWithIds;
//   };
  
function MrmScreen(){ 
    const MrmEmail = sessionStorage.getItem("MrmEmail");
    console.log("mrm", MrmEmail);
    const[selectImage,setSelectImage]=useState('');

  
    const onSubmit = async (data) => {
      setLoading(true);
     
      const formData=new FormData();
      formData.append("creatorEmailID",MrmEmail);
      formData.append("dbaName",data.dbaName);
      formData.append("email",data.email);
      formData.append("leagalName",data.leagalName);
      formData.append("merchantType","Level 4");
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

    const fetchData1 = async () => {
      try {
        const response = await fetch(`${BASE_URL}GetallMerchant?email=${MrmEmail}`);
        const result = await response.json();
        const rowsWithIds = result?.data.map((row) => ({ ...row, id: uuidv4() }));
        return rowsWithIds;
      } catch (error) {
        console.error("Error fetching data:", error);
        // You can handle errors here, such as displaying an error message
        return [];
      }
    };
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = useState(false);
    const { isDark } = useContext(DarkContext);

    const { isCollapsed } = useContext(SidebarContext);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const {isLoading,error,data:data1}=useQuery({queryKey:["merchant"],
    queryFn:fetchData1,
  })
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
      const columns = [
        {
          field: "merchantId",
          headerName: "Id",
          flex: 3,
          headerAlign: "center",
          align: "center",
          cellClassName: "custom-cell",
        },
        {
          field: "leagalName",
          headerName: "Leagal Name",
          flex: 1,
          headerAlign: "center",
          align: "center",
          cellClassName: "custom-cell",
        },
        {
            field: "dbaName",
            headerName: "Dba Name",
            flex: 1,
            headerAlign: "center",
            align: "center",
            cellClassName: "custom-cell",
          },
    
    
        {
          field: "email",
          headerName: "Email",
          flex: 2,
          headerAlign: "center",
          align: "center",
          cellClassName: "custom-cell",
        },
       
        {
          field: "merchantType",
          headerName: "Merchant Type",
          flex: 2,
          headerAlign: "center",
          align: "center",
          cellClassName: "custom-cell",
        },
        {
          field: "caseOwner",
          headerName: "Owner ID",
          flex: 4,
          headerAlign: "center",
          align: "center",
          cellClassName: "custom-cell",
        },
        {
          field: "action",
          headerName: "Action",
          flex: 2,
          headerAlign: "center",
          align: "center",
          cellClassName: "custom-cell",
          renderCell: (params) => (
            <div
              style={{ cursor: "pointer" }}
            //   onClick={() => handleEdit(params.row)}
            >
              <Button size="small" variant="contained" color="success">
                Edit
              </Button>
            </div>
          ),
        },
       
      ];
    

    return(
        <>
             <Box
        m="20px"
        sx={{
        //   marginLeft: isCollapsed ? "100px" : "300px",
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
            <form  onSubmit={handleSubmit(onSubmit)}>
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

                {/* <Box sx={{ gridColumn: "span 2" }}>
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
                </Box> */}
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
        // marginLeft: isCollapsed ? "100px" : "300px",
        transition: "margin-left 0.3s",
      }}
    >
      <Header title="Merchant List" subtitle="Merchant Created By You" />
     
      {isLoading &&   <CircularProgress color="secondary"style={{marginLeft:'45%',marginTop:'200px'}}  />}

      {data1 &&(
             <Box
             m="40px 0 0 0"
             height="75vh"
             sx={{
               "& .MuiDataGrid-root": {
                 border: "none",
                 overflowX: "auto",
               },
               "& .MuiDataGrid-cell": {
                 borderBottom: "none",
               },
               "& .name-column--cell": {
                 color: colors.greenAccent[300],
               },
               "& .MuiDataGrid-columnHeaders": {
                 backgroundColor: colors.blueAccent[700],
                 borderBottom: "none",
               },
               "& .MuiDataGrid-virtualScroller": {
                 backgroundColor: colors.primary[400],
               },
               "& .MuiDataGrid-footerContainer": {
                 borderTop: "none",
                 backgroundColor: colors.blueAccent[700],
               },
               "& .MuiCheckbox-root": {
                 color: `${colors.greenAccent[200]} !important`,
               },
               "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                 color: `${colors.grey[100]} !important`,
               },
               "& .custom-cell": {
                 textAlign: "center",
               },
               "& .MuiDataGrid-columnHeaderTitle": {
                 fontSize: "15px",
               },
             }}
           >
             <DataGrid
      rows={data1.filter(row => row.creatorEmailID == MrmEmail)}
      columns={columns}
               components={{ Toolbar: GridToolbar }}
               align="center"
             />
           </Box>
      )}
      
      {/* <EditModal
        selectedItem={selectedRow}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        handleCloseModal={handleCloseModal}
      />
      <SendEmailModal
        rowData={emailRow}
        emailModalOpen={emailModalOpen}
        handleCloseEmailModal={handleCloseEmailModal}
        setEmailModalOpen={setEditModalOpen}
      /> */}
    </Box>
     
        </>
    )
}
export default MrmScreen;