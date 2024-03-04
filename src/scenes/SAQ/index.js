import { Box, Button, TextField, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { DarkContext } from "../global/DarkBar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../../apiConfig";
import { toast,ToastContainer } from "react-toastify";

const AddForm = () => {
  const storedUserId = sessionStorage.getItem("userId");
  console.log("userid",storedUserId)

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { isCollapsed } = useContext(SidebarContext);
  const { isDark } = useContext(DarkContext);
  const[value,setValue]=useState('');

  
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const handleFileChange = (e) => {
    setValue("FormTemplate", e.target.files[0]);
    console.log(value,"value");
  };
const validateTotalParts=(value)=>{ 
  
  if(value<0){
    return 'Total part can not be negative'
  }
 else if(value>10){
    return 'number must be less than or equal to 10'
  }
 else{
  return true

 }

}
// const countt=(value)=>{
//   if(value>99){
//     return 'Total parts should be below 100';
//   }
//   return true
// }

const onSubmit = async (data) => {
  const  fileInput = document.querySelector('input[name="FormTemplate"]');
  const fileType = fileInput.files[0]?.type;
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("createdBy", storedUserId);
  formData.append("version", data.version);
  formData.append("isActive", true);
  formData.append("totalParts", data.totalParts);
  formData.append("description", data.description);
  formData.append("FormTemplate", fileInput.files[0]);

  try {
    const response = await axios.post(
      `${BASE_URL}InsertFormData`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          AdminId: storedUserId,
        },
      }
    );

    if (response?.status === 200) {
      const responseData = response?.data;
      toast.success(responseData.message);
      console.log("API Response:", responseData);
    } else {
      console.error("HTTP error! Status:", response.status);
    }

    reset(); 
  } catch (error) {
    console.error("API Error:", error);
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
      <Box display="flex" justifyContent="space-between">
        <Header title="Add Form" subtitle="Create a new Form" />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Title"
            name="title"
            sx={{ gridColumn: "span 2" }}
            InputLabelProps={{
              style: {
                color: isDark ? "black" : "white",
              },
            }}
            {...register("title", {
              required: "Title is required",
            })}
            error={Boolean(errors.title)}
            helperText={
              <span style={{position:'absolute',fontSize:'14px',marginLeft:'-10px'}}>{errors.title?.message}</span>
            }
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Version"
            name="version"
            sx={{ gridColumn: "span 2" }}
            InputLabelProps={{
              style: {
                color: isDark ? "black" : "white",
              },
            }}
            {...register("version", {
              required: "Version is required",
            })}
            error={Boolean(errors.version)}
            helperText={
              <span style={{position:'absolute',fontSize:'14px',marginLeft:'-10px'}}>{errors.version?.message}</span>
            }
          />
          
          <Box sx={{ gridColumn: "span 2" }}>
            <FormControl variant="filled" fullWidth>
              <InputLabel
                id="demo-simple-select-filled-label"
                style={{ color: isDark ? "black" : "white" }}
              >
                Form Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Admin Type"
                type="select"
                name="formType"
                {...register("formType", {
                  required: "Form Type is required",
                })}
                error={Boolean(errors.formType)}
                helperText={
                  <span style={{position:'absolute',fontSize:'14px',marginLeft:'-10px'}}>{errors.formType?.message}</span>
                }
              >
                <MenuItem value="Saq">Saq</MenuItem>
              </Select>
            </FormControl>
          </Box>
         
          <TextField
            fullWidth
            variant="filled"
            type="Number"
            label="Total Parts"
            name="totalParts"
            sx={{ gridColumn: "span 2" }}
            InputLabelProps={{
              style: {
                color: isDark ? "black" : "white",
                shrink: true,
                
              },
            }}         
            inputProps={{
              min:"0"
            }}  
            {...register("totalParts", {
              required: "Total parts is required",
              inputMode: "numeric",            
              validate:validateTotalParts,
            })}
            error={Boolean(errors.totalParts)}
            helperText={
              <span style={{position:'absolute',fontSize:'14px',marginLeft:'-10px'}}>{errors.totalParts?.message}</span>
            }
          />

          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            variant="filled"
            rows={3}
            sx={{ gridColumn: "span 2" }}
            placeholder="Add Description"
            InputLabelProps={{
              style: {
                color: isDark ? "black" : "white",
              },
            }}
            {...register("description", {
              required: "Description is required",
            })}
            error={Boolean(errors.description)}
            helperText={
              <span style={{position:'absolute',fontSize:'14px',marginLeft:'-10px'}}>{errors.description?.message}</span>
            }
          /> 
            <TextField
            id="outlined-multiline-static"
            variant="filled"
            type="file"
            sx={{ gridColumn: "span 2" }}
            InputLabelProps={{
              style: {
                color: isDark ? "black" : "white",
              },
            }}
            {...register("FormTemplate",{
              required:'Select file'
            })}
            onChange={handleFileChange}
            error={Boolean(errors.FormTemplate)}
            helperText={
              <span style={{position:'absolute',fontSize:'14px',marginLeft:'-10px'}}>{errors.FormTemplate?.message}</span>
            }

            
           
          />
        </Box>
        <Box display="flex" justifyContent="center" mt="20px">
          <Button type="submit" color="secondary" variant="contained" size="large">
            Add Form
          </Button>
        </Box>
      </form>
      <ToastContainer position="top-center"/>
    </Box>
  );
};

export default AddForm;
