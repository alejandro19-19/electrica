
export let data = [];

// Se guardan en un array temporal los reportes a cargar con el formato adecuado
export const cargarReporte = (reports) => {
  data = [];
  reports.map((report) => {
    data.push({
      id: report.factura_id,
      nombre: report.nombre,
      cedula: report.cedula,
      celular: report.celular,
      cliente_id: report.cliente_id,
      consumo_en_kwh: report.consumo_en_kwh,
    });
  })
};
