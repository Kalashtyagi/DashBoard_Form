
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
import EditModal from "../../components/Modal/EditModal";
import Table from "../../components/Table";
import FormComplanceModal from "../../components/Modal/FormComplanceModal";
import { useNavigate } from "react-router-dom";


function MrmScreen(){ 
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const[formModalOpen,setFormModalOpen]=useState(false);

  const navigate = useNavigate();


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
      formData.append("merchantType","MRM_Level 4");
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
          toast.success(responseData?.message,{
            position:'top-center'
          });
          reset();
          refetch();
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
        return [];
      }
    };
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = useState(false);
    const { isDark } = useContext(DarkContext);

    const { isCollapsed } = useContext(SidebarContext);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const {isLoading,error,data:data1,refetch}=useQuery({queryKey:["merchant"],
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
      const handleEdit = (row) => {
        setSelectedRow(row);
        setEditModalOpen(true);
      }
      const handleCloseModal = () => {
        setEditModalOpen(false);
      };
      const handleFormCloseModal=()=>{
        setFormModalOpen(false);
      }
      const formModal=(row)=>{
        setSelectedRow(row);
        setFormModalOpen(true);

      }
      const columns = [
        
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
          field: "caseOwner",
          headerName: "Owner ID",
          flex: 4,
          headerAlign: "center",
          align: "center",
          cellClassName: "custom-cell",
        },
        {
          field: "status",
          headerName: "Status",
          flex: 2,
          headerAlign: "center",
          align: "center",
          cellClassName: "custom-cell",
          renderCell: (params) => {
            let statusText;
            switch (params.row.status) {
              case true:
                statusText = "Approved";
                break;
              case false:
                statusText = "Disapproved";
                break;
              default:
                statusText = "To be Reviewed";
            }
            return <div>{statusText}</div>;

          }
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
              style={{ cursor: "pointer"}}
              
            >
              <Button size="small" variant="contained" color="success"onClick={() => handleEdit(params.row)}>
                Edit
              </Button>&nbsp;
              {params.row.status==true && <Button size="small" variant="contained" color="error" onClick={()=>formModal(params.row)}>
                Fill Complaince Form
              </Button> }
              
            </div>
          ),
        },
       
      ];
    

    return(
        <>
             <Box
        m="20px"
        sx={{
          transition: "margin-left 0.3s",
        }}
      >
        <Accordion
          defaultExpanded
          style={{ backgroundColor: isDark ? "white" : "rgba(20,27,45,255)" }}
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

               
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained"disabled={loading}>
                  Create New Merchant
                </Button>
                <Button variant="contained" color="secondary" onClick={()=>navigate("/hdfcForm")}>
                  Hdfc Form
                </Button>
              </Box>
            </form>
          </AccordionDetails>
        </Accordion>

      </Box>
      <Box
      m="20px"
      sx={{
        transition: "margin-left 0.3s",
      }}
    >
      <Header title="Merchant List" subtitle="Merchant Created By You" />
     
      {isLoading &&   <CircularProgress color="secondary"style={{marginLeft:'45%',marginTop:'200px'}}  />}

    
      {data1 && <Table   rows={data1.filter(row => row.creatorEmailID === MrmEmail)}
      columns={columns}
/>}
      
      <EditModal
        selectedItem={selectedRow}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        handleCloseModal={handleCloseModal}
        refetch={refetch}
      />
    <FormComplanceModal rowData={selectedRow} formModalOpen={formModalOpen} setFormModalOpen={setEditModalOpen} handleFormCloseModal={handleFormCloseModal}/>

    </Box>
     <ToastContainer/>
        </>
    )
}
export default MrmScreen;