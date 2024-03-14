import {
    Box,
    Button,
    Modal,
    TextField,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
  } from "@mui/material";
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  import { tokens } from "../../theme";
  import { mockDataContacts } from "../../data/mockData";
  import Header from "../../components/Header";
  import { useTheme } from "@mui/material";
  import { SidebarContext } from "../global/SidebarContext";
  import { useContext, useEffect } from "react";
  import { useState } from "react";
  import { v4 as uuidv4 } from "uuid";
  import { BASE_URL } from "../../apiConfig";
  import axios from "axios";
  import { ToastContainer, toast } from "react-toastify";
 
  import { useQuery } from "@tanstack/react-query";
  import CircularProgress from "@mui/material/CircularProgress";
  import Skeleton from '@mui/material/Skeleton';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import { DarkContext } from "../global/DarkBar";
  import ViewImageModal from "../../components/Modal/ViewImageModal";
  import EditModal from "../../components/Modal/EditModal";
  import Table from "../../components/Table";
  const fetchData = async () => {
    const response = await fetch(`${BASE_URL}GetallMerchant`);
    const result = await response.json();
    const rowsWithIds = result?.data.map((row) => ({ ...row, id: uuidv4() }));
    return rowsWithIds;
  };
  const MerchantApproval = () => {
    const [merchantData, setMerchantData] = useState([]);
    const theme = useTheme();
    const { isDark } = useContext(DarkContext);
  
    const colors = tokens(theme.palette.mode);
    const [selectedRow, setSelectedRow] = useState(null);
    const { isCollapsed } = useContext(SidebarContext);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [formId, setFormId] = useState([]);
    const [emailRow, setEmailRow] = useState(null);
    const[modalOpen,setModalOpen]=useState(false);
    const [merchantInfo,setMerchantInfo]=useState('');

    
    const {isLoading,error,data:data1,refetch}=useQuery({queryKey:["merchant"],
    queryFn:fetchData,
  })
    
    const [emailData, setEmailData] = useState({
      name: "",
      email: "",
      merchantId: "",
      formId: "",
    });
    const [editData, setEditData] = useState({
      name: "",
      address: "",
      phone: "",
      email: "",
    });
    
    const saveMerchantId=(row)=>{
        console.log("row",row);
        setMerchantInfo(row);
        setModalOpen(true);

    }
    const handleEdit = (row) => {
      setSelectedRow(row);
      setEditModalOpen(true);
    }
  
    const columns = [
     
      {
        field: "leagalName",
        headerName: "Leagal Name",
        flex: 2,
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
        flex: 3,
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
            style={{ cursor: "pointer",display:'flex',justifyContent:"space-around" }}
           
          >
            <Button size="small" variant="contained" color="success" onClick={() => handleEdit(params.row)} >
              Edit
            </Button><Button style={{color:isDark?"black":"white"}} onClick={()=>saveMerchantId(params.row)}> <VisibilityIcon/></Button>
           
            
  
          </div>
        ),
      },
    
    ];
    ;
  
    const handleCloseModal = () => {
      setEditModalOpen(false);
    };
    const getAllFormId = async () => {
      try {
        const response = await fetch(`${BASE_URL}GetAllFormData`);
        const result = await response.json();
        setFormId(result.data);
        console.log("result", result.data);
      } catch (error) {
        console.log("error", error);
      }
    };
  
    return (
      <Box
        m="20px"
        sx={{
          marginLeft: isCollapsed ? "100px" : "300px",
          transition: "margin-left 0.3s",
        }}
      >
        <Header title="Merchant List" subtitle="List of Merchants Approval" />
       
        {isLoading &&   <CircularProgress color="secondary"style={{marginLeft:'45%',marginTop:'200px'}}  />}
  
        {data1 && (
  <Table
    rows={data1.filter(row => {
      if (row.creatorEmailID && typeof row.creatorEmailID === 'string') {
        return row.creatorEmailID.includes("hdfc") || row.merchantType === "MRM_Level 4";
      }
      return false; // Filter out rows where creatorEmailID is not a string or undefined
    })}
    columns={columns}
  />
)}
        <ViewImageModal modalOpen={modalOpen} merchantInfo={merchantInfo} setModalOpen={setModalOpen} refetchData={refetch}
        />
         <EditModal
        selectedItem={selectedRow}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        handleCloseModal={handleCloseModal}
        refetch={refetch}
      />
        
        

      </Box>
    );
  };
  
  export default MerchantApproval;