import { Box } from "@mui/material";
import React from "react";
import MyMessages from "../shared/MyMessages";

function Teacher() {


  return(
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <h1>Mi Buzón</h1>
      <MyMessages role="teacher" />
    </Box>
  );
}

export default Teacher;
