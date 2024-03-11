
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';
import { BASE_URL } from '../../apiConfig';
import { CircularProgress, } from "@mui/material";
import { toast } from "react-toastify";



function ApproveModal({ anchorEl, rowData, app, handlePopoverClose }) {
    const [reviewComments, setReviewComments] = useState('');
    const storedUserId = sessionStorage.getItem("userId");
    const [loading, setLoading] = useState(false);
    console.log("app", app);
    console.log("rowData", rowData);

    const handleApprove = async (e) => {
        if (app === "disapprove") {
            if (reviewComments === '') {
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
                    value: app === "approve" ? true : false,
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
            toast.success(response.data.message,{
                position:'top-center'
            });
            setLoading(false);
            handlePopoverClose();
            setReviewComments('');
        } catch (error) {
            toast.error("somethings wrong please try again");
            console.log("error", error);
            handlePopoverClose();

        } finally {
            setLoading(false);


        }

    };

    function handleClose(){
        setReviewComments('');
        handlePopoverClose();
    }
    return (
        <Dialog
            open={Boolean(anchorEl)}
            onClose={handlePopoverClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: {
                    minHeight: '22vh', // Adjust the value as per your requirement
                },
            }}
        >
            <DialogTitle id="alert-dialog-title" variant='h4'>Confirm Approval</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" typography='h4'>
                    Are you sure you want to {app === 'disapprove' ? 'disapprove' : 'approve'}
                </DialogContentText>
                {app === 'disapprove' && (
                    <TextareaAutosize
                        autoFocus
                        id="reviewComments"
                        aria-label="Reasion for disapprove"
                        placeholder="Reasion for disapprove"
                        minRows={3}
                        style={{ width: '100%', marginTop: '10px' }}
                        value={reviewComments}
                        onChange={(e) => setReviewComments(e.target.value)}
                    />
                )}
            </DialogContent>
            <DialogActions style={{ marginTop: '-20px', marginRight: '16px' }}>
                <Button color="success" variant='contained' onClick={(e) => handleApprove(e)}
                    disabled={loading}                >
                    {loading ? <CircularProgress size={20} color="success" /> : (app === "disapprove" ? "Disapprove" : "Approve")}          </Button>
                <Button onClick={handleClose} variant='contained' color="error">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default ApproveModal;