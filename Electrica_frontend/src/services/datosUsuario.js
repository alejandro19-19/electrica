
//------------------------------------------------------------------
//Obtención de los datos del inicio de sesión. -> Necesita controlar la ejecución de estas funciones para poder hacer la autorización.
export let token = null;
export let dataLogin = null;
export let headerToken = null;
export function asignarDataLogin(data) {
  dataLogin = data;
  token = data.token;
  headerToken = {
    headers: {
      Authorization: `Token ${data.token}`,
      "Content-type": "application/json",
    },
  };
}
//------------------------------------------------------------------

//Se le da formato a la información recopilada de la bd.
export let dataMeWithFormat = null;
export let dataMeFull = null;
export function asignarDataMe(data) {
  dataMeWithFormat = {
    id: data.id,
    password: data.password,
    nombre: data.nombre,
    apellido: data.apellido,
    cedula: data.cedula,
    email: data.email,
    direccion: data.direccion,
    fecha_nacimiento: data.fecha_nacimiento,
    celular: data.celular,
  };
  dataMeFull = data;
}

//-------------------------------------------------------------------
