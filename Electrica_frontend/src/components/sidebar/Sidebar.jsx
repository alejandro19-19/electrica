import React, { useEffect } from "react";
import { useState, useContext } from "react";
// import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../style/theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Create from "@mui/icons-material/Create";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from '@mui/icons-material/Assignment';
import BallotIcon from '@mui/icons-material/Ballot';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AddCardIcon from '@mui/icons-material/AddCard';
import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import PrintIcon from '@mui/icons-material/Print';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Context } from "../../context/Context";
import {
  sidebarClasses,
  menuClasses,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "../mainSidebar";
import { headerToken } from "../../services/datosUsuario";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      routerLink={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const Sidebar_ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const context = useContext(Context);
  const { toggleSidebar, collapseSidebar, broken, rtl, collapsed } =
    useProSidebar();
  const consultaDatosUsuario = async (config) => {
    const data = await fetch("http://127.0.0.1:8000/core/user/me", config);
    return data.json();
  };

  const configDatosUsuario = async () => {
    const config = headerToken;
    const response = await consultaDatosUsuario(config);
    let roll = null;
    if (response.is_client) {
      roll = "Cliente";
    } else if (response.is_operator) {
      roll = "Operador";
    } else if (response.is_gerente) {
      roll = "Gerente";
    } else if (response.is_admin) {
      roll = "Admin";
    }
    let variable = {};
    if (roll === "Cliente") {
      variable = {
        servicio_activo: response.Info_user.servicio_activo,
        al_dia: response.Info_user.al_dia,
      };
    }
    context.setAppState({
      loginState: false,
      roll: roll,
      name: response.Info_user.user.nombre,
      temporalUser: null,
      dataUser: variable,
    });
  };
  useEffect(() => {
    configDatosUsuario();
  }, []);

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          height: "100%",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        <Sidebar
          breakPoint="lg"
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              backgroundColor: `${colors.primary[400]} !important`,
            },
            [`.${menuClasses.subMenuContent}`]: {
              backgroundColor: `${colors.primary[400]} !important`,
            },
          }}
        >
          <Box>
            <Menu
              menuItemStyles={{
                button: ({ level, active, disabled, isSubmenu }) => {
                  if (level === 0)
                    return {
                      color: active ? "#6870fa" : "#ABA4A2",
                      backgroundColor: "transparent !important",
                    };
                },
              }}
            >
              {/* LOGO AND MENU ICON */}
              <MenuItem
                style={{
                  margin: "10px 0 20px 0",
                  color: colors.grey[100],
                  height: "auto",
                }}
              >
                {!collapsed ? (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <img
                      alt="profile-user"
                      width="140px"
                      src={`../../assets/logoTitulo.png`}
                      style={{ cursor: "pointer" }}
                    />
                    <IconButton
                      className="sb-button"
                      onClick={() => collapseSidebar()}
                    >
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton
                    className="sb-button"
                    onClick={() => collapseSidebar()}
                  >
                    <MenuOutlinedIcon />
                  </IconButton>
                )}
                {!collapsed ? (
                  <Box mb="25px">
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img
                        alt="profile-user"
                        width="100px"
                        height="100px"
                        src={`../../assets/user.png`}
                        style={{ cursor: "pointer", borderRadius: "50%" }}
                      />
                    </Box>
                    <Box textAlign="center">
                      <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "10px 0 0 0" }}
                        whiteSpace="initial"
                      >
                        {context.appState.name}
                      </Typography>
                      <Typography variant="h5" color={colors.greenAccent[500]}>
                        {context.appState.roll}
                      </Typography>
                    </Box>
                  </Box>
                ) : undefined}
              </MenuItem>
              <Item
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Perfil"
                to="/perfil"
                icon={<AccountBoxIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {(context.appState.roll === "Admin" ||
                context.appState.roll === "Gerente" ||
                context.appState.roll === "Operador") && (
                <SubMenu label="Usuarios" icon={<PersonIcon />}>
                  {context.appState.roll === "Admin" && (
                    <Item
                      title="Gerentes"
                      to="/managers"
                      icon={<ManageAccountsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  )}
                  {(context.appState.roll === "Admin" ||
                    context.appState.roll === "Gerente") && (
                    <Item
                      title="Operadores"
                      to="/operators"
                      icon={<SupportAgentIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  )}
                  {(context.appState.roll === "Admin" ||
                    context.appState.roll === "Gerente" ||
                    context.appState.roll === "Operador") && (
                    <Item
                      title="Clientes"
                      to="/clients"
                      icon={<PeopleOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  )}
                </SubMenu>
              )}
              {context.appState.roll != "Cliente" ? (
                <>
                  <Item
                    title="Crear Nuevo Usuario"
                    to="/newUser"
                    icon={<Create />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </>
              ) : undefined}
              {context.appState.roll === "Cliente" ? (
                <SubMenu label="Facturas" icon={<DescriptionIcon />}>
                  <Item
                    title="Consultar"
                    to="/ticket"
                    icon={<FindInPageIcon/>}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Pagar virtual"
                    to="/payBill"
                    icon={<PaymentIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Pagar presencial"
                    to="/genPayments"
                    icon={<AccountBalanceIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>     
              ) : undefined}
              {context.appState.roll === "Operador" ? (
                <SubMenu label="Pagos" icon={<DescriptionIcon />}>
                  <Item
                    title= "Registrar pagos clientes"
                    to="/regPayments"
                    icon={<RequestQuoteIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Generar factura"
                    to="/printBill"
                    icon={<PrintIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
              ) : undefined}
              {context.appState.roll === "Operador" || context.appState.roll === "Gerente"? (
                <SubMenu label="Facturas" icon={<ReceiptOutlinedIcon/>}>
                  <Item
                    title= "Enviar factura via e-mail"
                    to="/sendBill"
                    icon={<RequestQuoteIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
              ) : undefined}
              {context.appState.roll === "Gerente" ? (
                <SubMenu label="Reportes de usuarios" icon={<AssignmentIcon />}>
                  <Item
                    title="Listar Reporte"
                    to="/report"
                    icon={<BallotIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
              ) : undefined}
              {context.appState.roll === "Gerente" ? (
                <SubMenu label="Facturas" icon={<DescriptionIcon />}>
                  <Item
                    title="Generar factura"
                    to="/ticket"
                    icon={<ReceiptIcon/>}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
              ) : undefined}
              {context.appState.roll === "Admin" ? (
                <SubMenu label="Configurar sistema" icon={<BuildCircleIcon />}>
                  <Item
                    title="Crear"
                    to="/defGlobal"
                    icon={<AddCircleOutlineIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Modificar"
                    to="/modGlobal"
                    icon={<SettingsIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
              ) : undefined}
            </Menu>
          </Box>
        </Sidebar>
      </Box>
    </Box>
  );
};

export default Sidebar_;
