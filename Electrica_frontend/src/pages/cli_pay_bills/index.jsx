import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header/Header";

const NewClient = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    const datos = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values),
    };

    //Oe, este link debe corresponder con el host donde se creen clientes, o con el local que están usando.
    fetch("http://127.0.0.1:8000/core/user/create", datos)
      .then((response) => response.json())
      .then((json) => console.log("json ", json));
    //Limpiar las casillas.

    console.log("datos ", JSON.stringify(values));
    // console.log(`Mi nombre es ${values.name}`)
  };

  return (
    <Box m="20px">
      <Header title="PAGAR FACTURA" subtitle="menú para pagar facturas con tarjeta de crédito/débito." />

      <Formik
        // Se ejecuta cuando el formulario ha sido
        onSubmit={handleFormSubmit}
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
                label="Nombre del titular de la tarjeta"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.lastName}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Número de tarjeta"
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
                label="CVV"
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
                label="Id de Factura"
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
                label="Fecha de vencimiento"
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
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.celular}
                name="celular"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
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
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Pagar Factura
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
  cedula: "",
  email: "",
  fecha_nacimiento: "",
  celular: "",
  direccion: "",
  tipo: "Cliente",
  servicio_activo: "1",
  al_dia: 1,
  password: "12345",
};

export default NewClient;
