import { Box, Button, Modal, TextField,Grid ,FormControl,InputLabel,Select,MenuItem} from "@mui/material";
import { useEffect, useState,useContext } from "react";
import { BASE_URL } from "../../apiConfig";
import { EMAIL_URL } from "../../apiConfig";
import axios from "axios";
import {ToastContainer,toast } from "react-toastify"
import { DarkContext } from "../../scenes/global/DarkBar";
import {CircularProgress} from "@mui/material";
function FormComplanceModal({rowData,formModalOpen,setFormModalOpen,handleFormCloseModal}){   
  const { isDark } = useContext(DarkContext); 
     const[formId,setFormId]=useState([]);
     const storedUserId = sessionStorage.getItem("userId");
     const[body,setBody]=useState('');
     const[subject,setSubject]=useState('');
     const[loading,setLoading]=useState(false);

     const[emailData,setEmailData]=useState({
        leagalName:'',
        email:'',
        merchantId:'',
        formId:null
      })
     
      useEffect(()=>{
        setEmailData({ 
             leagalName:rowData?.leagalName,
             email:rowData?.email,
             merchantId:rowData?.merchantId,    
        })

        
    
      },[rowData])
    const getAllFormId=async()=>{
        try{
          const response=await fetch(`${BASE_URL}GetAllFormData`)
          const result=await response.json();
          setFormId(result.data);
          console.log("result",result.data);
        }catch(error){
          console.log("error",error);
        }
      } 
    useEffect(()=>{
          getAllFormId();
    },[rowData])
    console.log("rowdata",rowData);
  
    return(
      <>
     
        <Modal
        open={formModalOpen}
        onClose={handleFormCloseModal}
        aria-labelledby="email-modal-title"
        aria-describedby="email-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign:'center'
          }}
        >
           <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Leagal Name"
                value={emailData.leagalName}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  style: {
                    color: isDark ? "black" : "white",
                  },
                }}
    
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                value={emailData.email}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  style: {
                    color: isDark ? "black" : "white",
                  },
                }}
    
              />
            </Grid>
          </Grid>
          <TextField
            label="Merchant ID"
            value={emailData.merchantId}
            InputLabelProps={{
              style: {
                color: isDark ? "black" : "white",
              },
            }}

            
            fullWidth
            margin="normal"
          />
            <FormControl variant="outlined" fullWidth>
            <InputLabel id="form-id-label"style={{ color: isDark ? "black" : "white" }}
>FormId</InputLabel>
          <Select
            
            type="select"
            label="FormId"
            required
             
            
            value={emailData.formId}
            onChange={(e) => setEmailData({ ...emailData, formId: e.target.value })}

            fullWidth
            MenuProps={{ style: { maxHeight: 200 } }} 
          >
            {formId.map((formId) => (
              <MenuItem key={formId.formId} value={formId.formId}>
                {formId.title}
              </MenuItem>
            ))}
          </Select>
          </FormControl>
         

          <Box sx= {{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
            >
                    {loading ? <CircularProgress size={20} color="success"/> : "Next"}</Button>
            <Button
              variant="contained"
              color="error"
              style={{ marginLeft: 8 }}
              onClick={handleFormCloseModal}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* <ToastContainer/> */}
      </>
    )
}
export default FormComplanceModal;