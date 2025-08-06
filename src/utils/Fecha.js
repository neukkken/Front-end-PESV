import moment from 'moment-timezone';

export function convertirFecha(fechaISO) {
  return moment(fechaISO).tz('America/Bogota').format('DD/MM/YYYY'); // 02/05/2025 o 03/05/2025 según la hora
}
