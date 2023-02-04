import Header from "../../components/header/Header";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { Context } from "../../context/Context";
import Navbar from "../../components/navbar/Navbar_report";

const ManageReport = ({ type }) => {

  return (
    <Box width={"100%"}>
      <Box margin={"20px"}>
        <Header
          title="Reporte"
          subtitle={`Datos del reporte`}
        />
      </Box>
      <Navbar type={type} />
    </Box>
  );
};

export default ManageReport;
