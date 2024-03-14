import { useState,useEffect } from "react"
import { Popover } from "@mui/material";
import { Box, CircularProgress, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../apiConfig"; 



function ApprovePopOver({anchorEl,rowData,app,handlePopoverClose}){ 
    const [reviewComments, setReviewComments] = useState('');
    const storedUserId = sessionStorage.getItem("userId");
    const[loading,setLoading]=useState(false);

    console.log("props",app);
    const handleApprove = async (e) => {  
      if(app==="disapprove"){
        if(reviewComments===''){
          toast.warning("Write your comment to disapprove it");
          return;
        }
      }
     setLoading(true);
        e.preventDefault();
    
        try {
          const patchData = [
            {
              path: "/isFinalSubmission",
              op: "replace",
              value:app==="approve"?true:false,
            }, {
              path: "/reviewedBy",
              op: "replace",
              value: storedUserId,
    
            },
            {
              path: "/reviewComments",
              op: "replace",
              value: app === "approve" ? "Approved" : reviewComments,
    
            }
          ];
          const response = await axios.patch(`${BASE_URL}UpdateMerchantFormSubmissions?FormId=${rowData.formID}&MerchantId=${rowData.merchantID}`, patchData);
          console.log("reponse", response.data.message);
          toast.success(response.data.message, {
            position: 'top-center'
          });
          setLoading(false);
          handlePopoverClose();
        } catch (error) {
          toast.error("somethings wrong please try again");
          console.log("error", error);
          handlePopoverClose();

        } finally{ 
          setLoading(false);
          handlePopoverClose();


        }   

      };
      const handleDisapprove = () => {
            handlePopoverClose();
      };
    return(
        <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box p={2} style={{ textAlign: "center" }}>
          <Typography>
            Are you sure do you want to {app=="approve"?"approve":"disapprove"}
          </Typography>
          {app == "disapprove" && (
            <textarea placeholder="Reason for disapprove" required onChange={(e) => setReviewComments(e.target.value)} />
          )}
          <br />
          <Button
            size="small"
            variant="contained"
            onClick={(e) => handleApprove(e)}
            color="success"
            disabled={loading}
            
          >
                    {loading ? <CircularProgress size={20} color="success"/> : (app === "disapprove" ? "Disapprove" : "Approve")}
            

          </Button>
          &nbsp;
          <Button
            size="small"
            variant="contained"
            onClick={handlePopoverClose}
            color="error"
          >
            Cancel
          </Button>
        </Box>
      </Popover>
    )
}
export default ApprovePopOver;