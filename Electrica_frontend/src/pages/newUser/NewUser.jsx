import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header/Header";
import { headerToken } from "../../services/datosUsuario";
import { useState } from "react";
import AlertMessage from "../../components/alertMessage/AlertMessage";
import Autocomplete from "@mui/material/Autocomplete";
import { GridFilterInputValue } from "@mui/x-data-grid";

const NewUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [typeUser, setTypeUser] = useState("");
  const [send, setSend] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [typeError, setTypeError] = useState("success");

  const handleFormSubmit = (values) => {
    // values.password = values.cedula.toString();
    let toSend = {};
    if (values.tipo === "Cliente") {
      toSend = {
        nombre: values.nombre,
        apellido: values.apellido,
        cedula: values.cedula,
        email: values.email,
        fecha_nacimiento: values.fecha_nacimiento,
        celular: values.celular,
        direccion: values.direccion,
        tipo: values.tipo,
        servicio_activo: values.servicio_activo,
        al_dia: values.al_dia,
        password: values.cedula.toString(),
      };
    } else {
      toSend = {
        nombre: values.nombre,
        apellido: values.apellido,
        cedula: values.cedula,
        email: values.email,
        fecha_nacimiento: values.fecha_nacimiento,
        celular: values.celular,
        direccion: values.direccion,
        tipo: values.tipo,
        password: values.cedula.toString(),
        salario: values.salario,
        servicio_activo: false,
        al_dia: false,
      };
    }
    // console.log(toSend)
    // console.log(values)
    const datos = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(toSend),
    };
    //Oe, este link debe corresponder con el host donde se creen clientes, o con el local que están usando.
    fetch("http://127.0.0.1:8000/core/user/create", datos)
      .then((response) => response.json())
      // .then((response) => {
      //   if (!response.ok) {
      //     return Promise.reject();
      //   }
      // })
      .then((response) => {
        setSend(true);
        setMessage("Usuario credo exitosamente");
        setTypeError("success");
        setAlert(true);
        setTypeUser("");
      })
      .catch((error) => {
        setMessage("Hubo un error al crear el usuario");
        setTypeError("error");
        setAlert(true);
      });
  };

  return (
    <Box m="20px">
      <Header title="CREAR NUEVO USUARIO" subtitle="Crear un nuevo usuario" />
      {alert ? <AlertMessage message={message} type={typeError} /> : null}
      <Formik
        // Se ejecuta cuando el formulario ha sido
        onSubmit={() => {
          handleFormSubmit(dataToSend);
        }}
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
          resetForm,
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
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Tipo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tipo}
                name="tipo"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.lastName}
                sx={{ gridColumn: "span 1" }}
              /> */}
              <Autocomplete
                disablePortal
                options={listUsers}
                id="tipo"
                onChange={(event, newValue) => {
                  values.tipo = newValue;
                  setTypeUser(newValue);
                }}
                value={typeUser}
                sx={{ gridColumn: "span 4" }}
                renderInput={(params) => <TextField {...params} label="Tipo" />}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre"
                placeholder="Example Example"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apellido"
                placeholder="Example Example"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apellido}
                name="apellido"
                error={!!touched.apellido && !!errors.apellido}
                helperText={touched.apellido && errors.apellido}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Número de identificación"
                placeholder="123456789"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cedula}
                name="cedula"
                error={!!touched.noIdentification && !!errors.noIdentification}
                helperText={touched.noIdentification && errors.noIdentification}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                placeholder="example@example.com"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección de residencia"
                placeholder="example # 3 - 2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
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
                error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Número telefónico"
                placeholder="123456789"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.celular}
                name="celular"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />
              {values.tipo === "Cliente" ? (
                <>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Al dia"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.al_dia ? "Si" :  "No"}
                    name="al_dia"
                    sx={{ gridColumn: "span 1" }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Servicio activo"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.servicio_activo ? "Si" :  "No"}
                    name="servicio_activo"
                    sx={{ gridColumn: "span 1" }}
                    disabled
                  />
                </>
              ) : null}
              {values.tipo === "Gerente" || values.tipo === "Operador" ? (
                <>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Salario"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.salario}
                    name="salario"
                    sx={{ gridColumn: "span 1" }}
                  />
                </>
              ) : null}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                onClick={() => {
                  dataToSend = JSON.parse(JSON.stringify(values));
                  resetForm();
                }}
                type="submit"
                color="secondary"
                variant="contained"
              >
                Crear Nuevo Usuario
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp = /^[0-9]+$/;

const numberId = /^[0-9]+$/;

/* const checkoutSchema = yup.object().shape({
  nombre: yup.string().required("Requerido"),
  cedula: yup
    .string()
    .matches(numberId, "Número de identificación no válido")
    .required("Requerido"),
  email: yup.string().email("Email inválido").required("Requerido"),
  direccion: yup.string().required("Requerido"),
  fecha_nacimiento: yup.string().required("Requerido"),
  celular: yup
    .string()
    .matches(phoneRegExp, "Número de teléfono no válido")
    .required("Requerido"),
}); */

const initialValues = {
  nombre: "",
  apellido: "",
  cedula: "",
  email: "",
  fecha_nacimiento: "",
  celular: "",
  direccion: "",
  tipo: "",
  servicio_activo: true,
  al_dia: true,
  password: "",
  salario: 0,
};

let dataToSend = {
  nombre: "",
  apellido: "",
  cedula: "",
  email: "",
  fecha_nacimiento: "",
  celular: "",
  direccion: "",
  tipo: "",
  servicio_activo: true,
  al_dia: true,
  password: "",
  salario: 0,
};

const listUsers = ["Gerente", "Operador", "Cliente"];

export default NewUser;
