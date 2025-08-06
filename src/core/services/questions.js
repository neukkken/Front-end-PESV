import axios from "./axios.js";

const getPreguntas = () => axios.get('/pesv/preguntas');
const postPreguntas = (data_preguntas) => axios.post('/pesv/preguntas', data_preguntas);

export default {
    getPreguntas,
    postPreguntas,
}