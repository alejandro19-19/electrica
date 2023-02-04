import { Box } from "@mui/material";
import Header from "../../components/header/Header";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import { CardState } from "../../components/cardState/CardState";
import ConsumptionHistory from "../../components/consumptionHistory/ConsumptionHistory";
import { facturas, cargarfacturas, filterData } from "../../services/facturas";
import { headerToken } from "../../services/datosUsuario";
import CircularProgress from "@mui/material/CircularProgress";

const Dashboard = () => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/core/factura/view/", headerToken)
      .then((res) => res.json())
      .then((res) => {
        cargarfacturas(res);
      });
    fetch("http://127.0.0.1:8000/core/user/me", headerToken)
      .then((res) => res.json())
      .then((res) => {
        filterData(res.Info_user.user.id);
        // console.log(facturas)
        setLoading(false);
      });
  }, []);

  return (
    <Box m="20px">
      <Box>
        <Header title="DASHBOARD" subtitle="Bienvenido a tu dashboard" />
        {loading ? (
          <Box
            width={"100%"}
            height={"calc(100% - 90px)"}
            sx={{ display: "flex" }}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CircularProgress color="secondary" size={60} />
          </Box>
        ) : (
          <Box>
            {context.appState.roll === "Cliente" && (
              <>
                <CardState />
                <ConsumptionHistory />
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
