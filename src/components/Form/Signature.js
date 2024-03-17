import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fId, mId } from "./const";

import "react-toastify/dist/ReactToastify.css";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  accordionHeader: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    fontWeight: "bold",
  },

  submitButton: {
    backgroundColor: "#4caf50",
    color: "white",
    "&:hover": {
      backgroundColor: "#388e3c",
    },
  },
  menu: {
    height: "250px",
  },
  // Additional custom styles...
}));

const apiUrl = process.env.REACT_APP_API_URL;

export default function Sign() {
  const [apiImage, setApiImage] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [UpdateImage, setUpdateImage] = useState("");

  const classes = useStyles();

  // getImageFromAPi

  useEffect(() => {
    const fetchImage = async () => {
      const apiurl = `${apiUrl}ImageUpload/GetImage?formId=${fId}&merchantId=${mId}`;

      try {
        const response = await fetch(apiurl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setApiImage(imageUrl);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchImage();
  }, []);
console.log("fid",mId,fId);
  const handleSignatureChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setSignatureImage(file); // Store the file object itself
    }
    console.log("signn", signatureImage);
  };

  const handleEditChange = (event) => {
    if (event.target.files.length > 0) {
      setApiImage("");
      const file = event.target.files[0];
      setUpdateImage(file);
      setApiImage(URL.createObjectURL(file));
    }
  };
  console.log("apiImage", apiImage);

  //posting image
  const uploadImg = async () => {
    try {
      const formData = new FormData();
      formData.append("image", signatureImage);
      formData.append("formId", fId);
      formData.append("merchantId", mId);

      const response = await axios.post(`${apiUrl}InsertImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = await response.data;

      console.log("Response:", response.data);
      toast.success(result.message);
      // Handle response
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  //editImage

  const ChangeImageApi = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", UpdateImage);
      formData.append("formId", fId);
      formData.append("merchantId", mId);
      console.log("image", apiImage);

      const response = await axios.put(`${apiUrl}UpdateImage`, formData, {
        headers: {
          "Content-Type": "applicatin/json",
        },
      });
      const result = await response.data;

      console.log("Response:", response.data);
      toast.success(result.message);
      // Handle response
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center",justifyContent:'flex-start' }}>
        <Typography
          variant="body1"
          gutterBottom
          component="div"
          sx={{ width: "auto" }}
        >
          Signature of Merchant Executive Officer:
        </Typography>
        {apiImage && apiImage != null ? (
          <Button
            variant="contained"
            component="label"
            className={classes.uploadButton}
            startIcon={<CloudUploadIcon />}
          >
            Edit Signature
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleEditChange}
            />
          </Button>
        ) : (
          <Button
            variant="contained"
            component="label"
            className={classes.uploadButton}
            startIcon={<CloudUploadIcon />}
          >
            Select Signature
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleSignatureChange}
            />
          </Button>
        )}

        {apiImage != null ? (
          <>
            <Box
              component="img"
              src={apiImage}
              alt="edit"
              sx={{ maxHeight: "100px", mt: 2, ml: 2 }}
            />
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={ChangeImageApi}
            >
              Change Signature
            </Button>
          </>
        ) : (
          signatureImage !== null && (
            <>
              <Box
                component="img"
                src={URL.createObjectURL(signatureImage)}
                alt="Signature"
                sx={{ maxHeight: "100px", mt: 2, ml: 2 }}
              />
              <Button
                size="small"
                variant="outlined"
                color="success"
                onClick={uploadImg}
              >
                Upload Signature
              </Button>
            </>
          )
        )}
        <ToastContainer position="top-center" />
      </Box>
    </>
  );
}
