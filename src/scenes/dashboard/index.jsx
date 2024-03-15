

import {
  Box,
  Button,
  IconButton,
  List,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import { Notifications } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import HandshakeIcon from "@mui/icons-material/Handshake";
import BookOnlineSharpIcon from "@mui/icons-material/BookOnlineSharp";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { newMerchant } from "../../data/mockData";
import PieActiveArc from "../../components/PieChart";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { SidebarContext } from "../global/SidebarContext";
import { useContext, useState, useEffect } from "react";
import { BASE_URL } from "../../apiConfig";
import { Popover } from "@mui/material";
import { Modal, TextField } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { DarkContext } from "../global/DarkBar";
import CircularProgress from "@mui/material/CircularProgress";
import ApproveModal from "../../components/Modal/ApproveModal";
import "./index.css";


const Dashboard = () => {
  console.log(process.env.REACT_APP_BASE_URL, "d");
  const storedUserId = sessionStorage.getItem("userId");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [onBoardedData, setOnBoardedData] = useState([]);
  const [inProcessData, setInProcessData] = useState([]);
  const [getAllMerchantFromSub, setGetAllMerchantFromSub] = useState([]);
  const [notMatchingData, setNotMatchingData] = useState([]);
  const [merchantLogs, setMerchantLogs] = useState([]);
  const [value, setValue] = useState("inprocess");
  const handleChange1 = (event) => {
    setValue(event.target.value);
  };
  console.log("value", value);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const theme = useTheme();
  const { isDark } = useContext(DarkContext);

  const colors = tokens(theme.palette.mode);
  const { isCollapsed } = useContext(SidebarContext);
  const [viewMoreData, setViewMoreData] = useState([]);
  const [reviewComments, setReviewComments] = useState([]);
  const [reviewCom, setReviewCom] = useState("");
  const [allAdminLogs, setAllAdminLogs] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}GetallMerchantFormSubmissions`);

      const result = await response.json();
      if (result?.statusCode === 200) {
        setGetAllMerchantFromSub(result?.data);
        const approvedData = result?.data.filter(
          (item) => item.reviewComments === "Approved"
        );
        const remainingData = result?.data.filter(
          (item) => item.reviewComments !== "Approved"
        );

        setOnBoardedData(approvedData);
        setReviewComments(remainingData);
        setData(result?.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  const getAllMerchant = async () => {
    try {
      const response = await fetch(`${BASE_URL}GetallMerchant`);
      const result = await response.json();
      if (result?.statusCode === 200) {
        setInProcessData(result?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  
  const openViewMore = (item) => {
    setOpen(true);
    setViewMoreData([item]);

    console.log("item", item);
  };
  useEffect(() => {
    fetchData();
    getAllMerchant();
  }, []);
  useEffect(() => {
    const matchingData = [];
    reviewComments.forEach((comment) => {
      const matchingInProcessData = inProcessData.find(
        (processData) =>
          processData.merchantId === comment.merchantID.toLowerCase()
      );
      if (matchingInProcessData) {
        matchingData.push({
          ...comment,
          leagalName:matchingInProcessData.leagalName
          // merchantName: matchingInProcessData.merchantName,
        });
      }
    });
    setNotMatchingData(matchingData);
  }, [inProcessData, onBoardedData]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [app, setApp] = useState(null);

  const handlePopoverOpen = (event, item, disc) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setApp(disc);
    console.log("Item", item);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handlePdf = async (row) => {
    try {
      const response = await axios.get(
        `${BASE_URL}DownloadPDF?FormId=${row.formID}&MerchantId=${row.merchantID}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.pdf");
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("pdf Download Successfully",{
        position:'top-center'
      })
    } catch (error) {
      toast.error("something went wrong plz try again");
      console.error("Error downloading file:", error);
    }
  };
 
  console.log("notMatchingData",notMatchingData);
  return (
    <>
      {/* {data.length === 0 ? (
        <>
          <CircularProgress
            color="secondary"
            style={{ marginLeft: "55%", marginTop: "300px" }}
          />
        </>
      ) : ( */}
      <Box
        m="20px"
        sx={{
          marginLeft: isCollapsed ? "100px" : "300px",
          marginTop: "100px",
          transition: "margin-left 0.3s",
        }}
      >
        {/* HEADER */}
        <Box
          className="header"
          style={{ backgroundColor: isDark ? "#fcfcfc" : "#111b2d"}}
        >
          <Header title="DASHBOARDD" subtitle="New Merchant-overview" />
        </Box>

        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="200px"
          gap="10px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={reviewComments.length}
              subtitle="In Process"
              progress="0.2"
              // increase="+14%"
              icon={
                <LoopIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={onBoardedData.length}
              subtitle="On Boarded"
              progress="0.50"
              // increase="+21%"
              icon={
                <HandshakeIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
         

          <Box
            gridColumn="span 6"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={value}
                  onChange={handleChange1}
                >
                  <FormControlLabel
                    value="inprocess"
                    control={<Radio />}
                    label="In Process"
                  />
                  <FormControlLabel
                    value="onBoarded"
                    control={<Radio />}
                    label="On Boarded"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box>
              <LineChart
                chartData={
                  value == "inprocess" ? reviewComments : onBoardedData
                }
                isDashboard={true}
              />
            </Box>
            
          </Box>
          <Box
            gridColumn="span 6"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h5" fontWeight="600">
              On Boarding by location
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              mt="25px"
              justifyContent="space-between"
            >
              <PieActiveArc size="175" />
            </Box>
          </Box>

          {/* ROW 3 */}

          {/* <Box
            gridColumn="span 12"
            gridRow="span 2"
            position="relative"
            overflow="auto"
            backgroundColor={colors.primary[400]}
          >
            <Typography
              variant="h4"
              fontWeight="700"
              
              padding='auto'
              position="sticky"
              top="0"
              zIndex="1"
              backgroundColor="#2e7c67"
              width="100%"
              paddingLeft="10px"
              paddingRight="10px"
              height={30}
            >
              New Merchant
            </Typography>
            {notMatchingData.length === 0 ? (
              <Typography variant="h5" mt={2} ml={2} color="textSecondary"style={{textAlign:'center'}}>
                No data found
              </Typography>
            ) : (
              notMatchingData.map((newItem, index) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h5" ml="10px">
                    {newItem.leagalName}
                  </Typography>
                  <Typography>{newItem.merchantID}</Typography>

                  <Box display="flex" marginTop="25px">
                    <IconButton>
                      <DownloadOutlinedIcon
                        sx={{
                          fontSize: "26px",
                          color: colors.greenAccent[500],
                          marginTop: "-7px"
                        }}
                        onClick={() => handlePdf(newItem)}
                      />
                    </IconButton>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        fontSize: "15px",
                        marginRight: "10px",
                        height: "35px",
                        color: colors.greenAccent[500]
                      }}
                      onClick={(e) => handlePopoverOpen(e, newItem, "approve")}
                    >
                      approve
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        fontSize: "15px",
                        marginRight: "10px",
                        height: "35px",
                        color: colors.greenAccent[500]
                      }}
                      onClick={(e) => handlePopoverOpen(e, newItem, "disapprove")}
                    >
                      disapprove
                    </Button>
                  </Box>
                </Box>
              ))

            
            )}

          </Box> */}
          
        </Box>

        <ApproveModal anchorEl={anchorEl} rowData={selectedItem} app={app} handlePopoverClose={handlePopoverClose} />
       
        <ToastContainer />
      </Box>
      {/* )} */}
    </>
  );
};

export default Dashboard;