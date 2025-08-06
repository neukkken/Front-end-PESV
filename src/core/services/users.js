import axios from "./axios.js";

const getAllUsers = () => axios.get(`/pesv/admin/users`);

const findUsersPaginados = async (lastId, limit) =>
  axios.get(`/pesv/admin/users/pagination?lastId=${lastId}&limit=${limit}`);
const filerUserByNameOrCc = async (searchTerm) =>
  axios.post(`/pesv/filter/users?searchTerm=${searchTerm}`);

const getSelectRegisterUser = () => axios.get(`/pesv/user/select-register`);
const registerUserAdmin = (data_user) => axios.post(`/auth/users`, data_user);
const registerUserDocuments = (docs) =>
  axios.post(`/pesv/documents/uploadUserFile`, docs);

const getUserById = (id_user) => axios.get(`/auth/users/${id_user}`);
const updateUser = (id_user, userData) =>
  axios.put(`/auth/users/edit/${id_user}`, userData);

const getDocsByIdUser = (id_user) =>
  axios.get(`/pesv/user/documents/${id_user}`);

export default {
  findUsersPaginados,
  filerUserByNameOrCc,
  getAllUsers,
  getSelectRegisterUser,
  registerUserDocuments,
  registerUserAdmin,
  getUserById,
  updateUser,
  getDocsByIdUser
};
