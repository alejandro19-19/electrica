import { useContext, useEffect, useRef } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../style/theme";
import { mockDataReport } from "../../data/mockData";
import Header from "../../components/header/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Context } from "../../context/Context";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  headerToken,
  asignarDataMe,
  dataMeWithFormat,
  dataMeFull,
} from "../../services/datosUsuario";
import * as fact from "../../services/facturas";
import * as rep from "../../services/reportes";
import CircularProgress from "@mui/material/CircularProgress";

const Reports = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [data, setData] = useState([]);
  const [state, setState] = useState(null);
  const effectRan = useRef(false)

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "nombre",
      headerName: "Nombre Cliente",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "cedula",
      headerName: "Cedula",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
        field: "celular",
        headerName: "Celular",
        flex: 1,
    },
    {
      field: "cliente_id",
      headerName: "ID del Cliente",
      flex: 1,
    },
    {
      field: "consumo_en_kwh",
      headerName:"Consumo (Kwh)",
      flex: 1,
    },
  ];

  //---------------------------------------------------------------------------
  //Aquí se consulta la info de todas las facturas.
  const consultaLista = async (config) => {
    const data = await fetch(
      `http://127.0.0.1:8000/core/factura/view/`,
      config
    );
    return data.json();
  };

  const configLista = async () => {
    const config = headerToken;
    let response = await consultaLista(config);
    if (type === "manager") {
      rep.cargarReporte(response);
      setData(rep.data);
    } 
    setLoading(false);
  };
  useEffect(() => {
    if (effectRan.current == false) {
      configLista();
      effectRan.current = true
    }
  }, [type]);
  // }, [type, data]);
  //console.log("List", listClients)
  //----------------------------------------------------------------------------

  return (
    <>
    {loading ? (
      <>
        <Box
          width={"100%"}
          height={"calc(100% - 90px)"}
          sx={{ display: "flex" }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress color="secondary" size={60} />
        </Box>
      </>
    ) : (
      <Box m="20px">
        <Header title="REPORTES" subtitle="Gestión de reportes" />
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            }
          }}
        >
          <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    )}
  </>
  );
};

export default Reports;
