
import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./Header";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../apiConfig";
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
import { tokens } from "../theme";
import { useQuery } from "@tanstack/react-query";
import EmailIcon from "@mui/icons-material/Email";
import EditModal from "./Modal/EditModal";
import { DarkContext } from "../scenes/global/DarkBar";
  
function Table({rows,columns}){
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isDark } = useContext(DarkContext);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  


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
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          align="center"
        />
      </Box>
    )
}
export default Table;