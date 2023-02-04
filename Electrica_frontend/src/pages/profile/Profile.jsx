import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header/Header";
import React, { useState, useEffect } from "react";
import { RepeatOneSharp } from "@mui/icons-material";
import {
  headerToken,
  asignarDataMe,
  dataMeWithFormat,
  dataMeFull,
} from "../../services/datosUsuario";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext } from "react";
import { Context } from "../../context/Context";
import AlertMessage from "../../components/alertMessage/AlertMessage";

export default function Perfil() {
  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(Context);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [typeError, setTypeError] = useState("success");

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    //Ojo, que se está enviando tanto cuando se da en editar, como cuando se envia jeje, quitar el cuando "editar"
    const toSent = {
      id: dataMeFull.id,
      password: dataMeFull.password,
      nombre: values.nombre,
      apellido: values.apellido,
      cedula: values.cedula,
      email: values.email,
      fecha_nacimiento: values.fecha_nacimiento,
      celular: values.celular,
      direccion: values.direccion,
      tipo: context.appState.roll,
    };
    const config = {
      method: "PUT",
      headers: headerToken.headers,
      body: JSON.stringify(toSent),
    };
    //Oe, este link debe corresponder con el host donde se creen clientes, o con el local que están usando.
    fetch("http://127.0.0.1:8000/core/user/update/me", config)
      .then((response) => response.json())
      // .then((response) => {
      //   if (!response.ok) {
      //     return Promise.reject();
      //   }
      // })
      .then((response) => {
        setMessage("Datos actualizados con éxito");
        setTypeError("success");
        setAlert(true);
      })
      .catch((error) => {
        setMessage("Hubo un error al actualizar los datos");
        setTypeError("error");
        setAlert(true);
      });
    //Limpiar las casillas.
    setAlert(false);
  };

  const [edicion, setEdicion] = useState(false);

  const ejecutar = (values) => {
    handleFormSubmit(values);
    setEdicion(!edicion);
  };

  //Aquí se consulta la info del usuario que la está solicitando.
  //---------------------------------------------------------------------------
  const consultaPerfilBd = async (config) => {
    const data = await fetch(
      "http://127.0.0.1:8000/core/user/update/me",
      config
    );
    return data.json();
  };

  const configConsultaPerfil = async () => {
    const config = headerToken;
    const response = await consultaPerfilBd(config);
    asignarDataMe(response);
    setIsLoading(false);
  };
  configConsultaPerfil();
  //----------------------------------------------------------------------------

  if (isLoading) {
    return (
      <>
        {/* <div className="Perfil">
          <h1>Cargando...</h1>
        </div> */}
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
    );
  }
  return (
    <Box m="20px">
      {/*console.log("Return", dataMeWithFormat)*/}
      <Header title="Perfil" subtitle="Bienvenido a tu Perfil" />
      {alert ? <AlertMessage message={message} type={typeError} /> : null}
      <Formik
        // Se ejecuta cuando el formulario ha sido
        onSubmit={ejecutar}
        initialValues={dataMeWithFormat}
        //validationSchema={checkoutSchema}
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
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                disabled={!edicion}
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apellido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apellido}
                name="apellido"
                disabled={!edicion}
                error={!!touched.apellido && !!errors.apellido}
                helperText={touched.apellido && errors.apellido}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Número de identificación"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cedula}
                name="cedula"
                disabled
                error={!!touched.cedula && !!errors.cedula}
                helperText={touched.cedula && errors.cedula}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                disabled
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección de residencia"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                disabled
                error={!!touched.direccion && !!errors.direccion}
                helperText={touched.direccion && errors.direccion}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de nacimiento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fecha_nacimiento}
                name="fecha_nacimiento"
                disabled
                error={!!touched.fecha_nacimiento && !!errors.fecha_nacimiento}
                helperText={touched.fecha_nacimiento && errors.fecha_nacimiento}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Número telefónico"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.celular}
                name="celular"
                disabled={!edicion}
                error={!!touched.celular && !!errors.celular}
                helperText={touched.celular && errors.celular}
                sx={{ gridColumn: "span 2" }}
              />
              <>
                {context.appState.roll === "Cliente" ? (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="bool"
                    label="Ha Pagado"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={`${
                      context.appState.dataUser.al_dia === true ? "Si" : "No"
                    }`}
                    name="al_dia"
                    disabled
                    error={!!touched.al_dia && !!errors.al_dia}
                    helperText={touched.al_dia && errors.al_dia}
                    sx={{ gridColumn: "span 2" }}
                  />
                ) : null}
              </>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              {!edicion ? (
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    setEdicion(!edicion);
                  }}
                >
                  EDITAR DATOS
                </Button>
              ) : (
                <Box
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"space-evenly"}
                >
                  <Button type="submit" color="secondary" variant="contained">
                    GUARDAR CAMBIOS
                  </Button>
                  <Button
                    type="submit"
                    color="error"
                    variant="contained"
                    onClick={() => {
                      setEdicion(!edicion);
                    }}
                  >
                    CANCELAR
                  </Button>
                </Box>
              )}
            </Box>
            {/* <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {edicion ? "GUARDAR CAMBIOS" : "EDITAR DATOS"}
              </Button>
            </Box> */}
          </form>
        )}
      </Formik>
    </Box>
  );
}

const phoneRegExp = /^[0-9]+$/;

const numberId = /^[0-9]+$/;

/* const checkoutSchema = yup.object().shape({
  name: yup.string().required("Requerido"),
  noIdentification: yup
    .string()
    .matches(numberId, "Número de identificación no válido")
    .required("Requerido"),
  email: yup.string().email("Email inválido").required("Requerido"),
  address: yup.string().required("Requerido"),
  dateOfBirth: yup.string().required("Requerido"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Número de teléfono no válido")
    .required("Requerido"),
}); */
