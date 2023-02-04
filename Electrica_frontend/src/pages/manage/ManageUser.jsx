import Header from "../../components/header/Header";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { Context } from "../../context/Context";
import Navbar from "../../components/navbar/Navbar";

const ManageUser = ({ type }) => {
  const context = useContext(Context);
  console.log(context)

  return (
    <Box width={"100%"}>
      <Box margin={"20px"}>
        <Header
          title="Usuario"
          subtitle={`Perfil del usuario ${context.appState.temporalUser.user.nombre}`}
        />
      </Box>
      <Navbar type={type} />
    </Box>
  );
};

export default ManageUser;
