
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
  import Header from "../../components/Header";
  import { useContext, useEffect } from "react";
  import { BASE_URL } from "../../apiConfig";
  import axios from "axios";
  import EmailIcon from "@mui/icons-material/Email";
  import { EmailSharp } from "@mui/icons-material";
  
function Table({data,columns}){
    return(
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
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          align="center"
        />
      </Box>
    )
}
export default Table;