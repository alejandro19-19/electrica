import React from "react";
import "./cardState.scss";
import { facturas, alDia, pagoTotal } from "../../services/facturas";
import { useTheme } from "@emotion/react";
import { tokens } from "../../style/theme";

export const CardState = () => {
  let amountData = facturas.length - 1;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="card">
      <div className="left">
        <span className="title" style={{color: `${colors.grey[100]}`}}>Estado del servicio</span>
        <span className="text" style={{color: `${colors.grey[300]}`}}>Su total a pagar es de:</span>
        <span className="counter">{"$ " + pagoTotal}</span>
        <span className="date" style={{color: `${colors.grey[100]}`}}>Fecha límite de pago</span>
      </div>
      <div className="right">
        <div className={`percentage ${alDia ? "positive" : "negative"}`}>
          {alDia ? "Al día" : "Por pagar"}
        </div>
        <span className="date">
          {alDia ? "---" : facturas[amountData].fin_plazo}
        </span>
      </div>
    </div>
  );
};
