import Login from "./pages/login/Login";
import { useContext } from "react";
import { Context } from "./context/Context";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import ListUser from "./pages/list/ListUser";
import NewClient from "./pages/newUser/NewUser";
import Perfil from "./pages/profile/Profile";
import ManageUser from "./pages/manage/ManageUser";
import ManageReports from "./pages/manage_report/ManageReport";
import Ticket from "./pages/ticket";
import Report from "./pages/listReports";
import Payments from "./pages/reg_payments";
import PayBills from "./pages/cli_pay_bills";
import GenPayments from "./pages/gen_payments";
import PrintBill from "./pages/cli_print_bill";
import SendBill from "./pages/cli_send_bill";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./style/theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const context = useContext(Context);
  // console.log(context.loginState);
  return (
    <>
      {context.appState.loginState ? (
        <Login />
      ) : (
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/clients"
                    element={<ListUser type={"client"} />}
                  />
                  <Route
                    path="/managers"
                    element={<ListUser type={"manager"} />}
                  />
                  <Route
                    path="/operators"
                    element={<ListUser type={"operator"} />}
                  />
                  <Route path="/newUser" element={<NewClient />} />
                  <Route
                    path="/clients/manage"
                    element={<ManageUser type={"client"} />}
                  />
                  <Route
                    path="/managers/manage"
                    element={<ManageUser type={"manager"} />}
                  />
                  <Route
                    path="/operators/manage"
                    element={<ManageUser type={"operator"} />}
                  />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/ticket" element={<Ticket />} />
                  <Route path="/regPayments" element={<Payments />} />
                  <Route path="/genPayments" element={<GenPayments />} />
                  <Route path="/payBill" element={<PayBills />} />
                  <Route path="/report" element={<Report type={"manager"}/>} />
                  <Route path="/report/manage" element={<ManageReports type={"manager"}/>} />
                  <Route path="/defGlobal" element={<GenPayments />} />
                  <Route path="/modGlobal" element={<GenPayments />} />
                  <Route path="/printBill" element={<PrintBill />} />
                  <Route path="/sendBill" element={<SendBill />} />
                </Routes>
              </main>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      )}
    </>
  );
}

export default App;

