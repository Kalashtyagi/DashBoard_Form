
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../../apiConfig";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { Box } from "@mui/material";
import { SidebarContext } from "../global/SidebarContext";
import { useTheme } from "@emotion/react";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "../../components/Table";



const fetchData = async () => {
  const response = await fetch(`${BASE_URL}GetAllFormData`);
  const result = await response.json();
  const rowsWithIds = result?.data.map((row) => ({ ...row, id: uuidv4() }));
  return rowsWithIds;
};

const FormInfo = () => {
  const theme = useTheme();
  const { isCollapsed } = useContext(SidebarContext);
  const [data, setData] = useState([]);
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: "formId",
      headerName: "ID",
      flex: 3,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "version",
      headerName: "Version",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 3,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 3,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "totalParts",
      headerName: "Total Parts",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "isActive",
      headerName: "Is Active",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
  ];
  const {isLoading,error,data:formData}=useQuery({queryKey:["formData"],
  queryFn:fetchData,
})

  // const fetchData = async () => {
  //   try {
  //     const res = await fetch(`${BASE_URL}GetAllFormData`);
  //     const result = await res.json();
  //     const rowsWithIds = result?.data.map((row) => ({ ...row, id: uuidv4() }));

  //     setData(rowsWithIds);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <Box
      m="20px"
      sx={{
        marginLeft: isCollapsed ? "100px" : "300px",
        transition: "margin-left 0.3s",
      }}
    >
      <Header title="Form Information" />
      {isLoading &&   <CircularProgress color="secondary"style={{marginLeft:'45%',marginTop:'200px'}}  />}
      {formData && ( <Table rows={formData}
   columns={columns}/>
 
      )}
     
    </Box>
  );
};

export default FormInfo;