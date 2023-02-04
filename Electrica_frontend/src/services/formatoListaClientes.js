export let listManagers = null;
export let listOperators = null;
export let listClients = null;

//Darle formato a los datos recogidos de la bd, este formato es necesario para poder modificar datos y regresarlos a la bd.

export const dataClientsWithFormat = (data) => {
  let newData = data.map(function (item) {
    return {
      id: item.user.id,
      nombre: item.user.nombre,
      apellido: item.user.apellido,
      cedula: item.user.cedula,
      email: item.user.email,
      fecha_nacimiento: item.user.fecha_nacimiento,
      celular: item.user.celular,
      direccion: item.user.direccion,
      servicio_activo: `${item.servicio_activo ? "Activo" : "Inactivo"}`,
      al_dia: `${item.al_dia === true ? 'Si' : 'No'}`,
    };
  });
  listClients = newData;
  return newData;
};

//Ve Camilo, esta es la función que yo usé ¿Podes modificar la tuya para que por lo menos quede igual con lode "Activo, Inactivo"? ¨Por lo menos la de "estado".

/* export const dataClientsWithFormat = (data) => {
  let newData = data.map(function (item) {
    const comprobacion = item.servicio_activo ? "Activo" : "Inactivo";
    return {
      id: item.user.id,
      nombre: item.user.nombre,
      cedula: item.user.cedula,
      email: item.user.email,
      fecha_nacimiento: item.user.fecha_nacimiento,
      celular: item.user.celular,
      direccion: item.user.direccion,
      estado: comprobacion,
      al_dia: item.al_dia,
    };
  });
  listClients = newData;
  return newData;
}; */

export const dataManagersWithFormat = (data) => {
  let newData = data.map(function (item) {
    return {
      id: item.user.id,
      nombre: item.user.nombre,
      apellido: item.user.apellido,
      cedula: item.user.cedula,
      email: item.user.email,
      fecha_nacimiento: item.user.fecha_nacimiento,
      celular: item.user.celular,
      direccion: item.user.direccion,
      estado: "-",
      salario: item.salario,
    };
  });
  listManagers = newData;
  return newData;
};

export const dataOperatorsWithFormat = (data) => {
  let newData = data.map(function (item) {
    return {
      id: item.user.id,
      nombre: item.user.nombre,
      apellido: item.user.apellido,
      cedula: item.user.cedula,
      email: item.user.email,
      fecha_nacimiento: item.user.fecha_nacimiento,
      celular: item.user.celular,
      direccion: item.user.direccion,
      estado: "-",
      salario: item.salario,
    };
  });
  listOperators = newData;
  return newData;
};
