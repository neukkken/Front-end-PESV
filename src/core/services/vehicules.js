import axios from "./axios.js";

const getAllVehiculos = () => axios.get(`/pesv/admin/vehiculos`);

const getSelctVehiculos = () => axios.get(`/pesv/vehiculos`);
const registerAdminVehicule = (data_vehiculo) =>
  axios.post(`/pesv/admin/vehiculos`, data_vehiculo);
const registerVehiculeDocuments = (docs) =>
  axios.post(`/pesv/documents/uploadVehiculeFile`, docs);
const getVehiculoById = (id_vehiculo) =>
  axios.get(`/pesv/admin/vehiculo/${id_vehiculo}`);

const getDocsVehiuleById = (id_vehiculo) =>
  axios.get(`/pesv/vehiculos/documents/${id_vehiculo}`);


// const descargaDocsByAssetId = (assetId) => {
//   axios.get(`/pesv/documents/download/${assetId}`)
//     .then((response) => {
//       const downloadUrl = response.data.downloadUrl;
//       // Redirigir a la URL para iniciar la descarga
//       window.location.href = downloadUrl;
//     })
//     .catch((error) => {
//       console.error('Error al descargar el archivo:', error);
//     });
// };

const descargaDocsByAssetId = (assetId) => {
  axios
    .get(`/pesv/documents/download/${assetId}`)
    .then((response) => {
      const downloadUrl = response.data.downloadUrl;
      console.log(downloadUrl);

      // Crear un enlace dinámico y simular el clic
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "archivo"); // Nombre del archivo opcional
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error("Error al descargar el archivo:", error);
    });
};

const getVehiculosByUser = (id_user) =>
  axios.get(`/pesv/admin/user/${id_user}/vehiculos`);

const editInfoVehiculo = (id_vehiculo, vehicule_data) =>
  axios.put(`/pesv/vehiculos/edit/${id_vehiculo}`, vehicule_data);

export default {
  getAllVehiculos,
  getSelctVehiculos,
  registerAdminVehicule,
  registerVehiculeDocuments,
  getVehiculoById,
  getDocsVehiuleById,
  descargaDocsByAssetId,
  editInfoVehiculo,
  getVehiculosByUser,
  
};