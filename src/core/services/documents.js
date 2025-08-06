import axios from "./axios.js";

const findDocuemntsPorExpirarYExpirados = () =>
  axios.get(`/pesv/documents/expirar`);

const findTiposDocumentosVehiculo = () =>
  axios.get(`/pesv/documents/tipos/vehiculos`);

const findTiposDocumentosUsuario = () =>
  axios.get(`/pesv/documents/tipos/usuarios`);

const subirUnDocuemntoAVehiculo = (data) =>
  axios.post(`/pesv/documents/uploadVehiculeId`, data); //Este solo sube un solo Docs esta otro que es el que sube los 5 al mismo tiempo

const subirUnDocuemntoAUsuario = (data) =>
  axios.post(`/pesv/documents/uploadUserId`, data); //Este solo sube un solo

const updateVehiucleDoc = (id_vehiculo, data) =>
  axios.put(`/pesv/documents/update/vehicule-doc/${id_vehiculo}`, data); //Se debe llamar file

const updateUserDoc = (id_user, data) =>
  axios.put(`/pesv/documents/update/user-doc/${id_user}`, data); //Se debe llamar file

const getUserDocuemntById = (id_doc) =>
  axios.get(`/pesv/documents/user/${id_doc}`);

const getVehicleDocuemntById = (id_doc) =>
  axios.get(`/pesv/documents/vehicle/${id_doc}`);


export default {
  findDocuemntsPorExpirarYExpirados,
  findTiposDocumentosVehiculo,
  subirUnDocuemntoAVehiculo,
  subirUnDocuemntoAUsuario,
  findTiposDocumentosUsuario,
  updateVehiucleDoc,
  updateUserDoc,
  getUserDocuemntById,
  getVehicleDocuemntById

};
