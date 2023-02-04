import "./consumptionHistory.scss";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Box } from "@mui/material";
import { useState } from "react";
import { consumos, meses } from "../../services/facturas";
import { useTheme } from "@emotion/react";
import { tokens } from "../../style/theme";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ConsumptionHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let data = {
    labels: meses,
    datasets: [
      {
        label: "Historial de consumo",
        data: consumos,
        pointStyle: "circle",
        pointRadius: 10,
        pointHoverRadius: 15,
        borderColor: `${colors.grey[100]}`,
        borderWidth: 2,
      },
    ],
  }

  const [options, setOptions] = useState({});

  return (
    <div className="consumptionHistory">
      <h1 style={{ color: `${colors.grey[100]}` }}>Historial de Consumo</h1>
      <Line data={data} options={options}></Line>
    </div>
  );
};

export default ConsumptionHistory;
