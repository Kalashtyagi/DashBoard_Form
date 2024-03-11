
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../apiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel";

const defaultTheme = createTheme();
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Login() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();

  const [authChecked, setAuthChecked] = useState(false); // State to track if authentication check is completed

  

  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(false);
  const[mrmEmail,setMrmEmail]=useState('');

  const [showPassword, setShowPassword] = useState(false);
  function togglePasswordVisibilty() {
    setShowPassword(!showPassword);
  }
  const glass = {
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    borderRadius: "20px",
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  

  const onSubmit = async (data) => {
    console.log("data", data);
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("re", response);
      if (response?.status == 200) {
        const responseData = await response.json();
        setRes(responseData?.data);
        sessionStorage.setItem("userId", responseData?.data?.adminId);
        sessionStorage.setItem("AdminEmail", responseData?.data?.email);

        toast.success("Login Successfully");

        navigate("/dashboard");
        setLoading(false);
      } else {
        const responseData = await response.json();
        toast.error(responseData.message);
        setLoading(false);
      }
      reset();
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleMrm=async(e)=>{
    e.preventDefault();
    setLoading(true);
    if(mrmEmail===''){

      toast.error("Fill The Email",{
        position:'top-center'
      });
      setLoading(false);
      return;
    }
    console.log("data",mrmEmail);
    const hdfcEmailPattern = /^[a-zA-Z0-9._%+-]+@hdfc.*$/;
  if (!hdfcEmailPattern.test(mrmEmail)) { 
    toast.error("Email is not in Proper form",{
      position:'top-center'
    })
    setLoading(false);
    console.error("Invalid email format or does not contain 'hdfc'.");
  }else{
    navigate("/dashboard");

  }


  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" style={glass}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="login as a MRM" {...a11yProps(0)} />
                <Tab label="Login as an Admin" {...a11yProps(1)} />
              </Tabs>
            </Box>
          </Box>
          <Avatar sx={{ bgcolor: "secondary.main", marginTop: "20px" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <CustomTabPanel value={value} index={0}>
            <form >
            <Box >
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e)=>setMrmEmail(e.target.value)}
                autoFocus
                
                style={{ width: "400px" }}
              />
              <br />

              <br />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                onClick={handleMrm}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}{" "}
              </Button>
            </Box>
            </form>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                {...register("email", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                })}
              />
              <br />
              <span
                style={{
                  position: "absolute",
                  color: "red",
                  fontSize: "14px",
                  marginTop: "-12px",
                }}
              >
                {errors.email?.type === "required" && "Email is required"}
                {errors.email?.type === "pattern" && "Email is incorrect"}
              </span>
              <TextField
                margin="normal"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                style={{ width: "400px" }}
                autoComplete="current-password"
                {...register("password", {
                  required: true,
                  minLength: 4,
                  maxLength: 12,
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibilty} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <br />
              <span
                style={{
                  position: "absolute",
                  color: "red",
                  fontSize: "14px",
                  marginTop: "-12px",
                }}
              >
                {errors.password?.type === "required" && "Password is required"}
                {errors.password?.type === "minLength" &&
                  "Password length must be 4"}
                {errors.password?.type === "maxLength" &&
                  "Password contains less than 20 character"}
              </span>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}{" "}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/reset-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CustomTabPanel>
        </Box>
      </Container>
      <ToastContainer/>
    </ThemeProvider>
  );
}