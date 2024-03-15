import { Box, CircularProgress, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { SidebarContext } from "../global/SidebarContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../../apiConfig";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import { Popover } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ApprovePopOver from "../../components/Modal/ApprovePopOver";
import { pdfContext } from "../../Context/pdfcontext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ApproveModal from "../../components/Modal/ApproveModal";
import Table from "../../components/Table";



const fetchData = async () => {
  const response = await fetch(`${BASE_URL}GetallMerchantFormSubmissions`);
  const result = await response.json();
  const rowsWithIds = result?.data.map((row) => ({ ...row, id: uuidv4() }));
  return rowsWithIds;
};


const MerchantForm = () => {
  const{pdfData,setPdfData}=useContext(pdfContext);
  const[pdfLoader,setPdfLoader]=useState(false);
  const navigate=useNavigate();
  const {isLoading,error,data:MerchantSubmissionsData,refetch}=useQuery({queryKey:["SubmissionData"],
  queryFn:fetchData,
})
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isCollapsed } = useContext(SidebarContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [app, setApp] = useState("");
  const storedUserId = sessionStorage.getItem("userId");
  const [rowData, setRowData] = useState("");
  const [reviewComments, setReviewComments] = useState("");

  const handlePopoverOpen = (event, row, disc) => {
    setAnchorEl(event.currentTarget);
    setRowData(row);
    setApp(disc);
  };
  console.log("app", app);
  console.log("row", rowData.formID);

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleApprove = async (e) => {
    e.preventDefault();

    try {
      const patchData = [
        {
          path: "/isFinalSubmission",
          op: "replace",
          value: app === "approve" ? true : false,
        },
        {
          path: "/reviewedBy",
          op: "replace",
          value: storedUserId,
        },
        {
          path: "/reviewComments",
          op: "replace",
          value: app == "approve" ? "Approved" : reviewComments,
        },
      ];
      const response = await axios.patch(
        `${BASE_URL}UpdateMerchantFormSubmissions?FormId=${rowData.formID}&MerchantId=${rowData.merchantID}`,
        patchData
      );
      console.log("reponse", response.data.message);
      toast.success(response.data.message, {
        position: "top-center",
      });
    } catch (error) {
      toast.error("somethings wrong please try again");
      console.log("error", error);
    }

    console.log("Approved:");

    handlePopoverClose();
  };

  const handleDisapprove = () => {
   

    // Close popover
    handlePopoverClose();
  };
  const handlePdf = async (row) => {
    console.log("row",row);
    setPdfLoader(true);
    try {
      const response = await axios.get(
        `${BASE_URL}DownloadPDF?FormId=${row.formID}&MerchantId=${row.merchantID}`,
        {
          responseType: 'blob',
        }
      );
      console.log("response",response);
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.pdf');
      document.body.appendChild(link);
      link.click();
        window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("pdf downloas successfully",{
        position:'top-center'
      })
      setPdfLoader(false);
    } catch (error) {
      toast.error("something went wrong please try again",{
        position:'top-center'
      })
      console.error('Error downloading file:', error);
      setPdfLoader( false);
    }
  };



  

  const columns = [
    {
      field: "submissionID",
      headerName: "Submission Id",
      flex: 4,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "merchantID",
      headerName: "Merchant Id",
      flex: 4,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },

    {
      field: "formID",
      headerName: "Form Id",
      flex: 5,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "reviewComments",
      headerName: "Review Comments",
      flex: 2,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
   
    {
      field: "isFinalSubmission",
      headerName: "Is Final Submission",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 4,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={(e) => handlePopoverOpen(e, params.row, "approve")}
            >
              Approve
            </Button>
            &nbsp;{" "}
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={(e) => handlePopoverOpen(e, params.row, "disapprove")}
            >
              Disapprove
            </Button>
            &nbsp;&nbsp;
            {pdfLoader ?<CircularProgress size={20} color='success'/>:
            <Button
              size="small"
              variant="contained"
              onClick={() => handlePdf(params.row)}
            >
              {" "}
              <DownloadIcon />
            </Button>}
          </div>
        );
      },

    },
  ];
  

  return (
    <Box
      m="20px"
      sx={{
        marginLeft: isCollapsed ? "100px" : "300px",
        transition: "margin-left 0.3s",
      }}
    >
      <Header title="Merchant Form Submission" />
      {isLoading &&   <CircularProgress color="secondary"style={{marginLeft:'45%',marginTop:'200px'}}  />}
      {MerchantSubmissionsData && (<Table     rows={MerchantSubmissionsData}
    columns={columns}/>
 
      )}
    <ApproveModal  anchorEl={anchorEl} rowData={rowData} app={app} handlePopoverClose={handlePopoverClose} refetch={refetch}/>
      

     
      <ToastContainer />
    </Box>
  );
};

export default MerchantForm;