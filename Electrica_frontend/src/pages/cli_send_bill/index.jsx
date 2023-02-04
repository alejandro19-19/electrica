import { Box, Button, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import React, { useContext, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {useReactToPrint} from 'react-to-print';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header/Header";



const SendBill = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const componentRef = useRef();

    const handleFormSubmit = (values) => {
        console.log(values);
        // console.log(`Mi nombre es ${values.name}`)
      };

return(
    <>
    <Box m="20px" ref={componentRef} >
      <Header
        title="ENVIAR FACTURA VÍA E-MAIL"
        subtitle="Enviar la factura de un clíente por medio del correo electrónico"
      />
      <Formik
        // Se ejecuta cuando el formulario ha sido
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre Completo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="nombre"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.lastName}
                sx={{ gridColumn: "span 4"}}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ID de la Factura"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="billID"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.lastName}
                sx={{ gridColumn: "span 4"}}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Correo electrónico del cliente"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="correo"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.lastName}
                sx={{ gridColumn: "span 4"}}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px" gap="30px">
              <Button type="submit" color="secondary" variant="contained" component="label">
                Cargar factura
                <input hidden accept="image/*" multiple type="file" />
              </Button>
              <Button type="submit" color="secondary" variant="contained" endIcon={<SendIcon/>}>
                Enviar factura
                <input hidden accept="image/*" multiple type="file" />
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
    </>   
);
};

const phoneRegExp =
/^[0-9]+$/;

const numberId = /^[0-9]+$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("Requerido"),
  noIdentification: yup.string()
  .matches(numberId, "Número de identificación no válido")
  .required("Requerido"),
  email: yup.string().email("Email inválido").required("Requerido"),
  address: yup.string().required("Requerido"),
  dateOfBirth: yup.string().required("Requerido"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Número de teléfono no válido")
    .required("Requerido"),
  
  
});

const initialValues = {
    name: "",
    noIdentification: "",
    email: "",
    address: "",
    dateOfBirth: "",
    contact: ""
  };
export default SendBill;

