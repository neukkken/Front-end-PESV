import axios from "./axios.js";

const getEnumValues = () => axios.get(`/pesv/notificaciones/enums`);
const createNotify = (data_notify) =>
  axios.post(`/pesv/notificaciones/`, data_notify);

const getNotifyAdmin = () => axios.get(`/pesv/notificaciones/admin`);
const getNotifyByIdUser = (id_user) =>
  axios.get(`/pesv/notificaciones/user/${id_user}`);

//Mracar Notify como leida 🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾🥾

const marcarComoLeidaSiSabe = (id_notify) =>
  axios.put(`/pesv/notificaciones/mark/${id_notify}`);

export default {
  getEnumValues,
  createNotify,
  getNotifyAdmin,
  getNotifyByIdUser,
  marcarComoLeidaSiSabe
};
