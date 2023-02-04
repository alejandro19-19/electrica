import { useEffect, useState, useContext } from "react";
import { Box, Button, TextField } from "@mui/material";
import Header from "../../components/header/Header";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { headerToken } from "../../services/datosUsuario";

const DataReport = ({ type }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleFormSubmit = (values) => {
        
    const config = {
      method: "PUT",
      headers: headerToken.headers,
      body: JSON.stringify(toSend),
    };
    //Oe, este link debe corresponder con el host donde se creen clientes, o con el local que están usando.
    let id = values.id;
    fetch(`http://127.0.0.1:8000/core/user/${type}/update/${id}/`, config).then(
      (response) => response.json()
    );
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
  };

  const initialValues = context.appState.temporalUser;

  // console.log(context)

  return (
    <>
      <Box m="20px">
        {/* <Header
          title="Usuario"
          subtitle={`Perfil del usuario ${context.appState.temporalUser.nombre}`}
        /> */}
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
                  sx={{ gridColumn: "span 4" }}
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
                {values.al_dia ? (
                  <TextField
                  fullWidth
                  variant="filled"
                  type="bool"
                  label="Ha Pagado"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={"Si"}
                  name="al_dia"
                  disabled
                  error={!!touched.al_dia && !!errors.al_dia}
                  helperText={touched.al_dia && errors.al_dia}
                  sx={{ gridColumn: "span 2" }}
                />
                ) : (
                  <TextField
                  fullWidth
                  variant="filled"
                  type="bool"
                  label="Ha Pagado"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={"No"}
                  name="al_dia"
                  disabled
                  error={!!touched.al_dia && !!errors.al_dia}
                  helperText={touched.al_dia && errors.al_dia}
                  sx={{ gridColumn: "span 2" }}
                />
                )}
                {values.al_dia && (values.servicio_activo||servicioActivo) ? (<Button
                  color="secondary"
                  variant="contained"
                  disabled
                >
                  SERVICIO ACTIVADO
                </Button>
                ): values.al_dia && (!values.servicio_activo||!servicioActivo) ? (
                  <Button
                    color="secondary"
                    variant="contained"
                    disabled={!edicion}
                    onClick={() => {
                      values.servicio_activo=true;
                      setServicio(true)
                    }}
                  >
                    SERVICIO DESACTIVADO
                  </Button>
                ) : (
                  <Button
                  color="secondary"
                  variant="contained"
                  disabled
                  /**onClick={() => {
                    values.servicio_activo=false;
                    setServicio(false)
                  }}**/
                >
                  SERVICIO DESACTIVADO
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

export default DataReport;
