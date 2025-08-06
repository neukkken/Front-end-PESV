import axios from "./axios.js";
const fechaHoy = new Date().toISOString().split("T")[0];

const getFomulariosPreOperacionalDiarios = () =>
  axios.get(`/pesv/preoperacional/diarios`);

const getFormularioPreById = (id) => axios.get(`/pesv/preoperacional/${id}`);

const getFomsWhitErrors = () => axios.get(`/pesv/preoperacional/diarios/error`);


//Faltantes
const getFomrsFaltantesByVehiculo = () =>
  axios.get(`/pesv/preoperacional/vehiculos-faltantes`);


//Marcar no aplica
const markPreoperaconalFaltantes = () =>
  axios.post(`/pesv/preoperacional/marcar-faltantes-pesv`);


const getPreoperacionalById = (id_form) =>
  axios.get(`/pesv/preoperacional/find/${id_form}`);


const deletePreoperacionalById = (id_form) =>
  axios.delete(`/pesv/preoperacional/delete/${id_form}`);


const updateePreoperacionalById = (id_form, data) =>
  axios.put(`/pesv/preoperacional/update/${id_form}`, data);


export default {
  getFomulariosPreOperacionalDiarios,
  getFormularioPreById,
  getFomsWhitErrors,
  getFomrsFaltantesByVehiculo,
  markPreoperaconalFaltantes,
  getPreoperacionalById,
  deletePreoperacionalById,
  updateePreoperacionalById
};
