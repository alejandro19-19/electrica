import { Context } from "../../context/Context";
import { useEffect, useState, useContext } from "react";
import { headerToken } from "../../services/datosUsuario";
import ConsumptionHistory from "../../components/consumptionHistory/ConsumptionHistory";
import { Box } from "@mui/material";
import {
  facturas,
  cargarfacturas,
  filterData,
} from "../../services/facturas";

const Invoices = () => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(true);

  // console.log(facturas);

  useEffect(() => {
    // console.log("effect")
    fetch("http://127.0.0.1:8000/core/factura/view/", headerToken)
      .then((res) => res.json())
      .then((res) => {
        cargarfacturas(res);
        console.log(context)
        filterData(context.appState.temporalUser.user.id);
        console.log(facturas)
        setLoading(false);
      });
  }, []);
  return (
    <Box width={"100%"}>
      {/* {console.log("render")} */}
      <ConsumptionHistory />
    </Box>
  );
};

export default Invoices;
