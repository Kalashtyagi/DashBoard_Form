// import Header from "../../components/Header";
// import { DarkContext } from "../global/DarkBar";
// import { useContext, useState, useEffect } from "react";
// import { Box } from "@mui/material";
// import { SidebarContext } from "../global/SidebarContext";
// export default function AdminLog(){
//     const { isDark } = useContext(DarkContext);
//     const { isCollapsed } = useContext(SidebarContext);
//     return(
//         <>
//          <Box
//         m="20px"
//         sx={{
//           marginLeft: isCollapsed ? "100px" : "300px",
//           marginTop: "100px",
//           transition: "margin-left 0.3s",
//         }}
//       >
//         <Box
//           className="header"
//           style={{ backgroundColor: isDark ? "#fcfcfc" : "#111b2d"}}
//         >
//           <Header title="Admin Log" subtitle="Update of admins" />
//         </Box>
//       </Box>
        
        
//         </>
//     )
// }
import Header from "../../components/Header";
import { DarkContext } from "../global/DarkBar";
import { useContext, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { SidebarContext } from "../global/SidebarContext";
import { useQuery } from "@tanstack/react-query";
import Table from "../../components/Table";
import { BASE_URL } from "../../apiConfig";
import { v4 as uuidv4 } from "uuid";
import { CircularProgress } from "@mui/material";

export default function MerchantLog(){

    const { isDark } = useContext(DarkContext);
    const { isCollapsed } = useContext(SidebarContext);
    const fetchData1 = async () => {
      try {
        const response = await fetch(`${BASE_URL}GetAllAdminUpdateLogs`);
        const result = await response.json();
        const rowsWithIds = result?.data.map((row) => ({ ...row, id: uuidv4() }));
        return rowsWithIds;
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    };
    const {isLoading,error,data:data1}=useQuery({queryKey:["AdminLog"],
    queryFn:fetchData1,
  })
console.log("data",data1);
  const columns = [
        
    {
      field: "adminId",
      headerName: "Admin Id",
      flex: 2,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
  


    {
      field: "dateOfUpdate",
      headerName: "Date Of Update",
      flex: 2,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "updatedField",
      headerName: "Updated Field",
      flex: 2,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "oldValue",
      headerName: "Old Value",
      flex: 2,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
    {
      field: "newValue",
      headerName: "New Value",
      flex: 2,
      headerAlign: "center",
      align: "center",
      cellClassName: "custom-cell",
    },
   
  
   
  
   
  ];

    return(

<Box
m="20px"
sx={{
  marginLeft: isCollapsed ? "100px" : "300px",
  transition: "margin-left 0.3s",
}}
>
<Header title="Merchant Log" subtitle="Update of merchants" />
{isLoading &&   <CircularProgress color="secondary"style={{marginLeft:'45%',marginTop:'200px'}}  />}

{data1 &&( <Table   rows={data1}columns={columns}/>)}
</Box>
        
    )
}