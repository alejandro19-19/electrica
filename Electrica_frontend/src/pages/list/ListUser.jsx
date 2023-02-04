import { useContext, useEffect } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../style/theme";
import Header from "../../components/header/Header";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
import {
  dataClientsWithFormat,
  listClients,
  dataManagersWithFormat,
  listManagers,
  dataOperatorsWithFormat,
  listOperators,
} from "../../services/formatoListaClientes";
import CircularProgress from "@mui/material/CircularProgress";
import AlertMessage from "../../components/alertMessage/AlertMessage";

const Clients = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [data, setData] = useState([]);
  const [url, setUrl] = useState("");
  const [reload, setReload] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [typeError, setTypeError] = useState("success");

  //--------------------------------------------------------------------------------------------------
  //Peticiones a la bd para el cambio de estado de un cliente, ya sea por medio del admin u operador.
  const cambiarEstado = (params) => {
    let urlFetch = "";
    const config = { token: headerToken, id: params.id };
    urlFetch = `http://127.0.0.1:8000/core/user/admin/change_user_status/${config.id}/`;

    fetch(urlFetch, config.token)
      .then((res) => res.json())
      .then((res) => {
        setReload(!reload);
        setTypeError("success");
        setAlert(true);
      });
    setAlert(false);

    // setReload(false)
  };
  //-----------------------------------------------------------------------------------------------------

  //---------------------------------------------------------------------
  //Verifica estado del cliente para saber si debe mostrar "Activo" o no.
  const isActiveCliente = (params) => {
    if (params.row.servicio_activo === "Activo") {
      return (
        <IconButton
          onClick={() => {
            setMessage(
              `El (la) cliente ${params.row.nombre} ha sido desactivado(a)`
            );
            cambiarEstado(params);
          }}
          aria-label="activo"
        >
          <PersonOffIcon />
        </IconButton>
      );
    }
    return (
      <IconButton
        onClick={() => {
          setMessage(
            `El (la) cliente ${params.row.nombre} ha sido activado(a)`
          );
          cambiarEstado(params);
        }}
        aria-label="Inactivo"
      >
        <PersonAddIcon />
      </IconButton>
    );
  };
  //--------------------------------------------------------------------

  let columns = [
    { field: "id", headerName: "ID", width: 20 },
    {
      field: "nombre",
      headerName: "Nombre",
      width: 150
    },
    {
      field: "apellido",
      headerName: "Apellido",
      width: 150
    },
    {
      field: "cedula",
      headerName: "No Identificación",
      width: 150
    },
    {
      field: "email",
      headerName: "Correo",
      width: 150
    },
    {
      field: "fecha_nacimiento",
      headerName: "Fecha de Nacimiento",
      width: 150
    },
    {
      field: "celular",
      headerName: "Celular",
      width: 150
    },
    {
      field: "direccion",
      headerName: "Dirección",
      width: 150
    },
    {
      field: "servicio_activo",
      headerName: "Estado",
      width: 100
    },
    {
      field: "accion",
      headerName: "Acción",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            {context.appState.roll === "Admin" ||
            context.appState.roll === "Operador"
              ? isActiveCliente(params)
              : undefined}

            <IconButton
              onClick={() => {
                // console.log(params.row)
                context.setAppState({
                  stateLogin: false,
                  name: context.appState.name,
                  temporalUser: { user: params.row, roll: type },
                  roll: context.appState.roll,
                  dataUser: context.appState.dataUser,
                });
                navigate(url);
              }}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // console.log(columns)

  let dataColumns = [];
  {
    type != "client"
      ? columns.filter((item) => {
          item.field !== "servicio_activo" && dataColumns.push(item);
        })
      : (dataColumns = columns);
  }

  //ID, Nombre, NoIdentificacion, correo, dirección.
  const [lista, setLista] = useState(null);

  //Aquí se consulta la info del usuario que la está solicitando.
  //---------------------------------------------------------------------------
  const consultaLista = async (config) => {
    const data = await fetch(
      `http://127.0.0.1:8000/core/user/staff/${type}/list`,
      config
    );
    return data.json();
  };

  const configLista = async () => {
    const config = headerToken;
    const response = await consultaLista(config);
    // console.log("Data", response)

    if (type === "manager") {
      dataManagersWithFormat(response);
      setData(listManagers);
    } else if (type === "operator") {
      dataOperatorsWithFormat(response);
      setData(listOperators);
    } else if ("client") {
      dataClientsWithFormat(response);
      setData(listClients);
    }
    setLoading(false);
  };
  useEffect(() => {
    configLista();
    if (type === "manager") {
      setTitle("GERENTES");
      setSubtitle("gerentes");
      setUrl("/managers/manage");
    } else if (type === "operator") {
      setTitle("OPERADORES");
      setSubtitle("operadores");
      setUrl("/operators/manage");
    } else if ("client") {
      setTitle("CLIENTES");
      setSubtitle("clientes");
      setUrl("/clients/manage");
    }
  }, [type, reload]);
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
          <Header title={`${title}`} subtitle={`Gestión de ${subtitle}`} />
          {alert ? <AlertMessage message={message} type={typeError} /> : null}
          <Box
            m="40px 0 0 0"
            height="65vh"
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
              },
            }}
          >
            <DataGrid
              // checkboxSelection
              rows={data}
              columns={dataColumns}
              components={{ Toolbar: GridToolbar }}
              pageSize={10}
              initialState={{
                sorting: {
                  sortModel: [{ field: "id", sort: "asc" }],
                },
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Clients;
