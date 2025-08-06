import axios from "./axios.js";

const loginUser = (value) => axios.post(`/auth/users/login`, value);
const verfyAuth = () => axios.post(`/auth/users/verify`);



export default {
    loginUser,
    verfyAuth

}
