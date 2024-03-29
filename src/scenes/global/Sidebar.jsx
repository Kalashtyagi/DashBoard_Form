
import React, { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import AddIcon from "@mui/icons-material/Add";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SettingsIcon from "@mui/icons-material/Settings";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { SidebarContext } from "./SidebarContext";
import FeedIcon from "@mui/icons-material/Feed";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogOut = async () => {
    sessionStorage.clear();
    toast.success("successfully Logout", {
      position: 'top-center'
    })
    setTimeout(() => {
      navigate("/");

    }, 900);
  }
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0, // Start from the top of the viewport
        left: 0,
        width: isCollapsed ? "80px" : "250px",
        transition: "width 0.3s",
        height: "100vh", // Full viewport height
        // overflowY: 'auto',
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            // onClick={() => setIsCollapsed(!isCollapsed)}
            onClick={handleToggleSidebar}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="37px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINS
                </Typography>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  style={{ marginRight: "-10px" }}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 30px" }}>
  {isCollapsed ? (
    <Tooltip title="Merchant Information" arrow>
      <span>Mer. Info</span>
    </Tooltip>
  ) : (
    "Merchant Information"
  )}
</Typography>
            <Item
              title="Merchant Information"
              to="/merchantList"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />




            <Item
              title="Merchant Approval"
              to="/merchantApproval"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Create Merchant"
              to="/form"
              icon={<PersonAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />



            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 30px" }}
            >
              Forms
            </Typography>

            <Item
              title="Form Information"
              to="/formInformation"
              icon={<FeedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Merchant Form Submission"
              to="/merchantForm"
              icon={<ArticleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Create Form"
              to="/saqs"
              icon={<AddToPhotosIcon />}
              selected={selected}
              setSelected={setSelected}
            />
           <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 30px" }}
            >
              Logs
            </Typography>
            <Item
              title="Admin Log"
              to="/adminLog"
              icon={<PersonAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Merchant Log"
              to="/merchantLog"
              icon={<PersonAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 29px" }}
            >
              {isCollapsed?(
                <Tooltip title="Accounts" arrow>
                  <span>Accounts</span>

                </Tooltip>):(
                  "Accounts"

                )}
            </Typography>

            
           
            <Item
              title="Create Admin"
              to="/createAdmin"
              icon={<PersonAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Change Password"
              to="/changePassword"
              icon={<LockPersonIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Setting"
              to="/update"
              icon={<SettingsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <div onClick={handleLogOut}>
              <Typography>
              <Item
                title="Sign Out"
                // to="/"
                
              // selected={selected}
              // setSelected={setSelected}
              />
              </Typography>
             
            </div> */}
            
            <Typography
            onClick={handleLogOut}
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 29px",cursor:"pointer" }}
            >
              <LogoutIcon/>
              Sign out
            </Typography>
          </Box>
        </Menu>
      </ProSidebar>
      <ToastContainer />
    </Box>
  );
};

export default Sidebar;