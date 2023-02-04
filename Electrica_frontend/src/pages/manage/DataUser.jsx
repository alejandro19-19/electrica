import { useEffect, useState, useContext } from "react";
import { Box, Button, TextField } from "@mui/material";
import Header from "../../components/header/Header";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { headerToken } from "../../services/datosUsuario";
import AlertMessage from "../../components/alertMessage/AlertMessage";

const DataUser = ({ type }) => {
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [typeError, setTypeError] = useState("success");
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleFormSubmit = (values) => {
    //Ojo, que se está enviando tanto cuando se da en editar, como cuando se envia jeje, quitar el cuando "editar"
    context.setAppState({
      stateLogin: false,
      name: context.appState.name,
      temporalUser: values,
      roll: context.appState.roll,
      dataUser: context.appState.dataUser,
    });

    let toSend = {};
    let activo = values.servicio_activo === "Activo" ? true : false;
    let aldia = values.al_dia === "Si" ? true : false;
    if (type === "client") {
      toSend = {
        user: {
          id: values.id,
          nombre: values.nombre,
          apellido: values.apellido,
          cedula: values.cedula,
          email: values.email,
          decha_nacimiento: values.fecha_nacimiento,
          celular: values.celular,
          direccion: values.direccion,
        },
        // servicio_activo: values.servicio_activo,
        // al_dia: values.al_dia,
        servicio_activo: activo,
        al_dia: aldia,
      };
      // servicio_activo: `${values.servicio_activo === "Si" ? true : false}`,
      //   al_dia: `${values.al_dia === "Activo" ? true : false}`,
    } else {
      toSend = {
        user: {
          id: values.id,
          nombre: values.nombre,
          apellido: values.apellido,
          cedula: values.cedula,
          email: values.email,
          decha_nacimiento: values.fecha_nacimiento,
          celular: values.celular,
          direccion: values.direccion,
        },
        salario: values.salario,
      };
    }
    const config = {
      method: "PUT",
      headers: headerToken.headers,
      body: JSON.stringify(toSend),
    };
    //Oe, este link debe corresponder con el host donde se creen clientes, o con el local que están usando.
    let id = values.id;
    fetch(`http://127.0.0.1:8000/core/user/${type}/update/${id}/`, config)
      .then((response) => response.json())
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
  };

  const [edicion, setEdicion] = useState(false);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const navigate = useNavigate();
  // console.log(context.appState.temporalUser);
  const ejecutar = (values) => {
    handleFormSubmit(values);
    setEdicion(!edicion);
    setAlert(false);
  };

  const initialValues = context.appState.temporalUser.user;
  // console.log(context.appState.temporalUser.roll)

  // console.log(context)
  //--------------------------------------------------------------------------------------------------
  //Se realiza el cambio del al_dia si se puede realizar y muestra mensaje.
  const changeAlDia = (values, id, config) => {
    if (initialValues.al_dia === "Si") {
      if (values.Al_dia === false) {
        fetch(
          `http://127.0.0.1:8000/core/user/operator/change_client_status/${id}/`,
          config
        )
          .then((response) => response.json())
          .then((response) => {
            setMessage("Estado del servicio actualizado con éxito");
            setTypeError("success");
            setAlert(true);
          });
        context.appState.temporalUser.user.al_dia = "No";
      } else {
        setMessage(
          "No se puede desactivar el servicio al cliente pues está al día."
        );
        setTypeError("error");
        setAlert(true);
      }
    } else {
      if (values.Al_dia) {
        fetch(
          `http://127.0.0.1:8000/core/user/operator/change_client_status/${id}/`,
          config
        )
          .then((response) => response.json())
          .then((response) => console.log("initFalse y Al_DiaTrue", response))
          .then((response) => {
            setMessage("Estado del servicio actualizado con éxito");
            setTypeError("success");
            setAlert(true);
            context.appState.temporalUser.user.al_dia = "Si";
          });
      } else {
        setMessage("No se puede activar el servicio al cliente, está en mora.");
        setTypeError("error");
        setAlert(true);
      }
    }
  };
  //---------------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------------
  //Solicita info de si un cliente tiene 2 o más facturas vencidas y llama a changeAlDia con la respuesta.
  const isAlDia = () => {
    const config = {
      method: "GET",
      headers: headerToken.headers,
    };
    let id = initialValues.id;
    let respuesta = null;
    fetch(`http://127.0.0.1:8000/core/factura/client/view/${id}/`, config)
      .then((response) => response.json())
      .then((response) => changeAlDia(response, id, config));
    setAlert(false);
  };
  //---------------------------------------------------------------------------------------

  return (
    <>
      <Box m="20px">
        {/* <Header
          title="Usuario"
          subtitle={`Perfil del usuario ${context.appState.temporalUser.nombre}`}
        /> */}
        {alert ? <AlertMessage message={message} type={typeError} /> : null}
        <Formik
          // Se ejecuta cuando el formulario ha sido
          onSubmit={ejecutar}
          initialValues={initialValues}
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
                  error={
                    !!touched.fecha_nacimiento && !!errors.fecha_nacimiento
                  }
                  helperText={
                    touched.fecha_nacimiento && errors.fecha_nacimiento
                  }
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
                {type === "client" && values.al_dia === "Si" ? (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="bool"
                    label="Estado del servicio"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={"Activo"}
                    name="al_dia"
                    disabled
                    error={!!touched.al_dia && !!errors.al_dia}
                    helperText={touched.al_dia && errors.al_dia}
                    sx={{ gridColumn: "span 2" }}
                  />
                ) : (
                  <>
                    {type === "client" && (
                      <TextField
                        fullWidth
                        variant="filled"
                        type="bool"
                        label="Estado del servicio"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={"Inactivo por mora"}
                        name="al_dia"
                        disabled
                        error={!!touched.al_dia && !!errors.al_dia}
                        helperText={touched.al_dia && errors.al_dia}
                        sx={{ gridColumn: "span 2" }}
                      />
                    )}
                  </>
                )}
                {type === "client" && values.al_dia === "Si" ? (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      isAlDia();
                    }}
                    sx={{width: "200px"}}
                  >
                    DESACTIVAR EL SERVICIO
                  </Button>
                ) : (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      isAlDia();
                      //values.servicio_activo = true;
                      //setServicio(true);
                    }}
                  >
                    ACTIVAR EL SERVICIO
                  </Button>
                )}
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
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default DataUser;
