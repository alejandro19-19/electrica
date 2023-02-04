import React, {  useState, useContext, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../style/theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header/Header";
import {useReactToPrint} from 'react-to-print';
import {Select, FormControl, InputLabel, MenuItem, Box, Button} from "@mui/material";
import {
    headerToken,
    asignarDataMe,
    dataMeWithFormat,
    dataMeFull,
  } from "../../services/datosUsuario";
  import * as fact from "../../services/facturas";
  import CircularProgress from "@mui/material/CircularProgress";


const PrintBill = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Ejemplo PDF',
        onAfterPrint: ()=> alert('Impresión Exitosa')
    });

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
        // let consumo = await getConsumo(config, response[0]);
        // fact.data = response;
        setFactura(fact.data);  
        console.log("consumo:",response);
        console.log("data with format:",data)
        console.log("mockupdata:",mockDataReport);
        setLoading(false);
      };
      useEffect(() => {
        configLista();
        setUrl("/report/manage");
      });

    

return(
    <>
    <Box m="20px" >
      <Header
        title="IMPRIMIR FACTURA"
        subtitle="Imprimir la factura de un cliente"
      />
      <FormControl fullWidth>
          <InputLabel id="inputId">Seleccionar Factura</InputLabel>
          <Select
            id="demo-simple-select"
            labelId="inputId"
            value=''
            label="Seleccionar Factur"
            onChange={handleChange}
          >
            {factura.map((factura,index) => (
                <MenuItem key={index} value={factura.factura_id}/>
            ))}
          </Select>
        </FormControl>
                     <Box display="flex" justifyContent="end" mt="20px" gap="30px">


              <Button type="submit" color="secondary" variant="contained" component="label"> Cargar factura 
              <input hidden accept="image/*" multiple type="file" />
              </Button>
    <Button variant="contained" onClick = {handlePrint} color="secondary"> Imprimir Factura </Button>
      </Box>
      </Box>
      </>
);

};


export default PrintBill;