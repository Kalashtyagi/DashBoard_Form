

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
  const getAllMerchantLogs = async () => {
    try {
      const response = await fetch(`${BASE_URL}GetallMerchantUpdateLogs`);
      const result = await response.json();
      if (result?.statusCode === 200) {
        setMerchantLogs(result?.data);
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
    getAllMerchantLogs();
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
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const adminLogs = async () => {
    try {
      const response = await fetch(`${BASE_URL}GetAllAdminUpdateLogs`);
      const result = await response.json();
      setAllAdminLogs(result.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    adminLogs();
  }, []);
  console.log("adminlogs", allAdminLogs);
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
          <Header title="DASHBOARD" subtitle="New Merchant-overview" />
        </Box>

        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="10px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 4"
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
            gridColumn="span 4"
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
          <div>
            <div className="adminLog" style={{ marginTop: "-90px" }}>
              <h6
                style={{
                  textAlign: "center",
                  color: !isDark ? "white" : "black",
                  fontSize: "26px",
                  marginTop: "-100px",
                  position: "sticky",
                  top: 0,
                  backgroundColor: isDark ? "#fcfcfc" : "#111b2d",
                  // zIndex: -1000,
                  // border: "4px solid #3da58a",
                }}
              >
                Admin log
              </h6>
              <br />
              {/* <br /> */}
              <div>
                {allAdminLogs.length === 0 ? (
                  <Typography variant="h5" mt={2} ml={2} style={{marginTop:'150px',textAlign:'center'}}  color="textSecondary">
                    No data found
                  </Typography>
                ) : (
                  allAdminLogs.map((item, index) => (
                    <div
                      key={item.adminId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px",
                      }}
                    >
                      <div>
                        <p>{item.adminId}</p>
                      </div>
                      <p
                        style={{
                          color: "#3da58a",
                          cursor: "pointer",
                          marginRight: "12px",
                        }}
                        onClick={() => openViewMore(item)}
                      >
                        view More
                      </p>
                    </div>
                  ))
                )}

              </div>
            </div>

            <div className="merchantLog" style={{ marginTop: "-70px",width:isCollapsed?"500px":"450px" }}>
              <h6
                style={{
                  textAlign: "center",
                  color: !isDark ? "white" : "black",
                  fontSize: "26px",
                  margin: "0",
                  position: "sticky",
                  top: 0,
                  backgroundColor: isDark ? "#fcfcfc" : "#111b2d",
                  zIndex: 1,
                  // border: "4px solid #3da58a",
                }}
              >
                Merchant log
              </h6>
              <br />
              {merchantLogs.length === 0 ? (
                <Typography variant="h5" mt={2} ml={2} color="textSecondary"style={{textAlign:'center'}}>
                  No data found
                </Typography>
              ) : (
                <div>
                  {merchantLogs.map((item) => (
                    <div
                      key={item.logId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px",
                      }}
                    >
                      <p>{item.merchantId}</p>
                      <p
                        onClick={() => openViewMore(item)}
                        style={{
                          color: "#3da58a",
                          cursor: "pointer",
                          marginRight: "12px",
                        }}
                      >
                        view More
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          <Box
            gridColumn="span 8"
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

          {/* ROW 3 */}

          <Box
            gridColumn="span 8"
            gridRow="span 2"
            position="relative"
            overflow="auto"
            backgroundColor={colors.primary[400]}
          >
            {/* Fixed "New Merchant" text */}
            <Typography
              variant="h4"
              fontWeight="700"
              // textAlign="center"
              // mt="20px"
              // mb="20px"
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

          </Box>
          <Box
            gridColumn="span 8"
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
        </Box>

        <ApproveModal anchorEl={anchorEl} rowData={selectedItem} app={app} handlePopoverClose={handlePopoverClose} />
        <Modal
          open={open}
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
              label="logId"
              name="logId"
              fullWidth
              value={viewMoreData[0]?.logId}
              InputLabelProps={{
                style: {
                  color: isDark ? "black" : "white",
                },
              }}
              margin="normal"
            />
            <TextField
              label={viewMoreData[0]?.merchantId ? "MerchantID" : "AdminID"}
              name={viewMoreData[0]?.merchantId ? "merchantId" : "adminId"}
              fullWidth
              value={viewMoreData[0]?.merchantId || viewMoreData[0]?.adminId}
              margin="normal"
              InputLabelProps={{
                style: {
                  color: isDark ? "black" : "white",
                },
              }}
            />
            <TextField
              label="new Value"
              name="newValue"
              value={viewMoreData[0]?.newValue}
              fullWidth
              margin="normal"
              InputLabelProps={{
                style: {
                  color: isDark ? "black" : "white",
                },
              }}
            />
            <TextField
              label="old Value"
              name="oldValue"
              value={viewMoreData[0]?.oldValue}
              InputLabelProps={{
                style: {
                  color: isDark ? "black" : "white",
                },
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="update Field"
              // disabled

              name="updateField"
              value={
                viewMoreData[0]?.updatedField || viewMoreData[0]?.updateField
              }
              InputLabelProps={{
                style: {
                  color: isDark ? "black" : "white",
                },
              }}
              fullWidth
              margin="normal"
            />
          </Box>
        </Modal>
        <ToastContainer />
      </Box>
      {/* )} */}
    </>
  );
};

export default Dashboard;