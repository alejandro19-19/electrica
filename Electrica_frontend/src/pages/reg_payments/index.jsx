import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header/Header";

const Payments = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
    // console.log(`Mi nombre es ${values.name}`)
  };

  return (
    <Box m="20px">
      <Header
        title="GESTIONAR PAGOS"
        subtitle="Registrar pagos de clientes"
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
                type="date"
                label="Fecha de expedicion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateOfBirth}
                name="dateOfExpedition"
                error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Plazo (meses)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="limit"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de pago efectuado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateOfBirth}
                name="dateOfPayment"
                error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Estrato económico"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="stratum"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Consumo en Kw"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="consumo"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Total a pagar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="totalPayment"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ID del Cliente"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="clientID"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Registrar pago
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
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

export default Payments;
