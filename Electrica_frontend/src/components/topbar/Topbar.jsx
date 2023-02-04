import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../style/theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
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
import Login from "../../pages/login/Login";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { toggleSidebar, collapseSidebar, broken, rtl, collapsed } =
    useProSidebar();
  const navigate = useNavigate();

  const context = useContext(Context);
  const handleLogout = () => {
    let data = {
      loginState: true,
      roll: null,
      name: null,
      temporalUser: null,
    };
    navigate("/");
    window.localStorage.removeItem("loginUser");
    location.reload();
  };

  return (
    <Box
      display="flex"
      justifyContent={broken ? "space-between" : "flex-end"}
      p={2}
    >
      {/* ICON SIDEBAR */}
      {/* {console.log(broken)} */}
      {broken ? (
        <IconButton className="sb-button" onClick={() => toggleSidebar()}>
          <MenuOutlinedIcon />
        </IconButton>
      ) : undefined}
      {/* SEARCH BAR */}
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
