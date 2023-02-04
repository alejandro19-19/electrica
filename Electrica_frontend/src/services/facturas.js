import { filterEventStoreDefs } from "@fullcalendar/core";
import { headerToken } from "./datosUsuario";

export let facturas = null;
let data = null;
export let idUser = null;
export let alDia = true;
export let pagoTotal = 0;
export let consumos = [];
export let meses = [];
export let facturasVencidas = 0;

export const cargarfacturas = (info) => {
  data = info;
};

export const filterData = (id) => {
  idUser = id;

  facturas = data.filter((item) => item.cliente_id === idUser);

  consumos = [];
  meses = [];

  let suma = 0;
  let vencido = 0;
  for (let i = 0; i < facturas.length; i++) {
    if (facturas[i].pagado === false) {
      alDia = false;
      suma += facturas[i].total_pagar;
      vencido += 1;
    }
    if (consumos.length < facturas.length) {
      consumos.push(facturas[i].consumo_en_kwh);
      meses.push(facturas[i].fecha_expedicion);
    }
  }
  // console.log(consumos);
  // console.log(meses);
  pagoTotal = suma;
  facturasVencidas = vencido;
};