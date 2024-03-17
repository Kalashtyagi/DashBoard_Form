import { toast, ToastContainer } from "react-toastify";
import { fId,mId } from "../Form/const";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const handleApprove = async (e) => {
    
    e.preventDefault();

    try {
        const patchData = [
            {
                path: "/isFinalSubmission",
                op: "replace",
                value: true,
            }, 
           
        ];
        const response = await axios.patch(`${BASE_URL}UpdateMerchantFormSubmissions?FormId=${fId}&MerchantId=${mId}`, patchData);
        console.log("reponse", response.data.message);
        toast.success(response.data.message);
        
    } catch (error) {
        toast.error("somethings wrong please try again");
        console.log("error", error);

    } finally {


    }

};
export default handleApprove;