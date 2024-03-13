import { useState,useEffect} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Form from "./scenes/form";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Saq from "./scenes/SAQ";
import Update from "./scenes/Update/Update";
import Login from "./scenes/Login/Login";
import CreateAdmin from "./scenes/createAdmin/CreateAdmin";
import ChangePass from "./scenes/ChangePassword/ChangePass";
import ResetPass from "./scenes/Reset password/ResetPass";
import Bulkupload from "./scenes/form/Bulkupload";
import MerchantList from "./scenes/MerchantList/index";
import MerchantForm from "./scenes/MerchantList/MerchantForm";
import FormInfo from "./scenes/MerchantList/FormInfo";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./utils/ProtectedRoute";
import Pdf from "./components/pdf/pdf";
import MrmScreen from "./scenes/MrmScreen/MrmScreen";
import MerchantApproval from "./scenes/MerchantApproval/MerchantApproval";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();
  const storedUserId = sessionStorage.getItem("userId");
 
//   useEffect(() => {
//   const checkAuthentication = async () => {
//     try {
//       if (!storedUserId) {
//         await navigate("/");
//       }
//     } catch (error) {
//       console.error("Error occurred while checking authentication:", error);
//     }
//   };

//   checkAuthentication();  

// }, [storedUserId, navigate]);

  const isLoginPage = window.location.pathname === "/";
  const isForgetPassword = window.location.pathname === "/reset-password";
  const isPdf = window.location.pathname === "/pdf";
  const isMrm=window.location.pathname==="/mrm";


  const sidebarVisible = isMrm || isLoginPage || isForgetPassword || isPdf ? false : isSidebar;
  

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {sidebarVisible && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isLoginPage && !isPdf && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Login />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/merchantList" element={<MerchantList />} />
              <Route path="/form" element={<Form />} />
              <Route path="/update" element={<Update />} />
              <Route path="/createAdmin" element={<CreateAdmin />} />
              <Route path="/saqs" element={<Saq />} />
              <Route path="/changePassword" element={<ChangePass />} />
              <Route path="/reset-password" element={<ResetPass />} />
              <Route path="bulkupload" element={<Bulkupload />} />
              <Route path="merchantForm" element={<MerchantForm />} />
              <Route path="formInformation" element={<FormInfo />} />
              <Route path="/pdf" element={<Pdf/>}/>
              <Route path="/mrm" element={<MrmScreen/>}/>
              <Route path="merchantApproval" element={<MerchantApproval/>}/>
            </Routes>
          </main>
        </div>
        {/* <ToastContainer position="top-center" /> */}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
