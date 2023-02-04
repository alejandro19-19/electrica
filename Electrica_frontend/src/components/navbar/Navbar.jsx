import { useState } from "react";
import "./navbar.scss";
import DataUser from "../../pages/manage/DataUser";
import Invoices from "../../pages/manage/Invoices";
import Location from "../../pages/manage/Location";
import { Box } from "@mui/material";
import { style } from "@mui/system";

const Navbar = ({ type }) => {
  const [nextWindow, setNextWindow] = useState("dataUser");
  const [activate, setActivate] = useState(1);
  function window(str) {
    setNextWindow(str);
    if (str === "dataUser") {
      setActivate(1);
    } else if (str === "invoices") {
      setActivate(2);
    } else if (str === "location") {
      setActivate(3);
    }
  }

  return (
    <Box>
      <div className="navBar">
        <button
          className={`${activate === 1 ? "enable" : "disable"}`}
          onClick={() => {
            window("dataUser");
          }}
        >
          Datos Personales
        </button>
        {type === "client" && (
          <button
            className={`${activate === 2 ? "enable" : "disable"}`}
            onClick={() => {
              window("invoices");
            }}
          >
            Facturas
          </button>
        )}
        <button
          className={`${activate === 3 ? "enable" : "disable"}`}
          onClick={() => {
            window("location");
          }}
        >
          Ubicacion
        </button>
      </div>
      {nextWindow === "dataUser" && <DataUser type={type} />}
      {nextWindow === "invoices" && <Invoices type={type} />}
      {nextWindow === "location" && <Location type={type} />}
    </Box>
  );
};

export default Navbar;
