import { useState } from "react";
import "./navbar.scss";
import DataReport from "../../pages/manage_report/DataReport";
import { Box } from "@mui/material";
import { style } from "@mui/system";

const Navbar = ({ type }) => {
  return (
    <Box>
      <div className="navBar">
        <button>Datos Personales</button>
        <DataReport type={type} />
      </div>
    </Box>
  );
};

export default Navbar;
