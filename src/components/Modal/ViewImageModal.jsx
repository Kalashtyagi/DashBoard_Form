import React, { useState, useEffect } from "react";
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
import { CircularProgress } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BASE_URL } from "../../apiConfig";
import axios from "axios"; // Import Axios
import { ToastContainer, toast } from "react-toastify";


const ViewImageModal = ({ modalOpen, merchantInfo, setModalOpen }) => {
  const [imageData, setImageData] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const storedUserId = sessionStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const[disLoading,setDisLoading]=useState(false);
  const[action,setAction]=useState('');
  console.log("merchantinfo",merchantInfo);


  const fetchImage = async () => {
    try {
      const response = await fetch(`${BASE_URL}Merchant/GetMErchantSImage?merchantId=${merchantInfo.merchantId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageData(imageUrl);
    } catch (error) {
      console.error("Error:", error);
    }


  };
  useEffect(() => {
    fetchImage();
  }, [merchantInfo]);

  const SendEmail=async(action)=>{
    // e.preventDefault();
    console.log("Leo",action);
    
    try{ 
      const response=await axios.post(`${BASE_URL}SendEmail`,{
        adminId:storedUserId,
        toEmailId:merchantInfo.creatorEmailID,
          body:`your form has been ${action}`,
          subject:`Merchat Approval or Disapproval information`
      })
      console.log("response",response);
       if(response?.status==200){
        const responseData=await response?.data;
        toast.success(responseData?.message,{
          position:'top-center'
        });
        setAction('');
        console.log("response",response.data.message);
        
       }
      else{
      }

     }catch(error){
      // toast.error(error.message)

      console.log("error",error);
     }
  }


  function handleClose() {
    setModalOpen(false);

  }
  const handleApprove = async (act) => {
    setAction(act);
    if(act=='approve'?setLoading(true):setDisLoading(true));
    try {
      const patchData = [
        {
          path: "/status",
          op: "replace",
          value: act == "approve" ? true : false,
        },
        {
          path: "/caseOwner",
          op: "replace",
          value: storedUserId,

        },

      ];
      const response = await axios.patch(`${BASE_URL}PatchMerchant?Email=${merchantInfo.email}`, patchData);
      console.log("reponse", response);
      if(response?.status==200){
        toast.success("Status update successfully", {
          position: 'top-center'
        });
        setDisLoading(false);
        setLoading(false);
        setModalOpen(false);
        SendEmail(act);
        

      }
      

    } catch (error) {
      toast.error("somethings wrong please try again");
      console.log("error", error);
      setDisLoading(false);
      setLoading(false);
    }finally{
      setDisLoading(false);
        setLoading(false);
      setImageData('');
    }

  }

  return (
    <>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 2,
          }}
        >
          {imageData ? (
            <img src={imageData} alt="Image" style={{ width: '100%', height: '250px' }} />
          ) : (
            <CircularProgress />
          )}

          <Box mt={2} display="flex" style={{ float: 'right' }}>
            <Button variant="contained" color="success" onClick={() => handleApprove('approve')} disabled={loading}> {loading ? <CircularProgress size={20} color="success" /> : 'Approve'}
            </Button>&nbsp;
            <Button variant="contained" color="error" onClick={() => handleApprove('disapprove')} disabled={disLoading}>{disLoading? <CircularProgress size={20} color="success" /> : 'Disapprove'}
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default ViewImageModal;
