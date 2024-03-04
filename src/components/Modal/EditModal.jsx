import { Box, Button, Modal, TextField ,CircularProgress} from "@mui/material";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../apiConfig";
import axios from "axios";
import { useContext } from "react";
import { ToastClassName,ToastContainer,toast } from "react-toastify"
import { DarkContext } from "../../scenes/global/DarkBar";

function EditModal({ selectedItem, editModalOpen, setEditModalOpen, handleCloseModal }) { 
  const[loading,setLoading]=useState(false);
  console.log("selectedIntem",selectedItem);

  const [editData, setEditData] = useState({
    
    leagalName:"",
    merchantType:"",
    phone:"",
    email:"",
  });
  const { isDark } = useContext(DarkContext);
  useEffect(()=>{
    setEditData({ 
         leagalName:selectedItem?.leagalName,
         merchantType:selectedItem?.merchantType,
         phone:selectedItem?.phone,
         email:selectedItem?.email
    })

  },[selectedItem])

  const handleEditSubmit = async (email) => { 
    setLoading(true);
    try {
        const patchData = [
            {
                // operationType: 0,
                path: "/leagalName",
                op: "replace",
                from: "string",
                value:`${editData?.leagalName}`,
            },
            {
              path: "/email",
              op: "replace",
              from: "string",
              value:`${editData?.email}`, 
            },
           
           
            
        ];

        const response = await axios.patch(
            `${BASE_URL}PatchMerchant`,
            patchData,{
              params:{
                Email:email
              },
            }
        );
        const result=await response.data;
        setLoading(false);
        toast.success("Data update Successfully",{
          position:'top-center'
        });

    } catch (error) {
      toast.error("Something went wrong")
        console.error("Error editing merchant:", error);
    }finally{
      setLoading(false);
      setEditModalOpen(false);

    }
};
  return (
    <Modal
      open={editModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
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
        }}
      >
        <TextField
          label="Leagal Name"
          value={editData.leagalName}
          name="leagalName"
          onChange={(e) => setEditData({ ...editData, [e.target.name]: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{
            style: {
              color: isDark ? "black" : "white",
            },
          }}

        />
        <TextField
          label="Email"
          name="email"
          value={editData.email}
          onChange={(e) => setEditData({ ...editData, [e.target.name]: e.target.value })}
          fullWidth
          InputLabelProps={{
            style: {
              color: isDark ? "black" : "white",
            },
          }}

          margin="normal"
        />
         <TextField
          label="MerchantType"
          name="merchantType"
          value={editData.merchantType}
          onChange={(e) => setEditData({ ...editData, [e.target.name]: e.target.value })}
          fullWidth
          InputLabelProps={{
            style: {
              color: isDark ? "black" : "white",
            },
          }}

          margin="normal"
        />
        
       
        

        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleEditSubmit(editData.email)}
          >
           {loading?<CircularProgress size={20}/>:"Edit"}
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ marginLeft: 8 }}
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      
    </Modal>
  );
}

export default EditModal;
