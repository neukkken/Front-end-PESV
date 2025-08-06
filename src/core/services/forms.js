import axios from "./axios.js";

const getForms = () => axios.get('/pesv/formularios');
const postForm = (data_form) => axios.post(`/pesv/formularios`, data_form);

export default {
    getForms,
    postForm
}