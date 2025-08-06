import axios from "axios";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, 
});

// Interceptor para agregar el token en cada solicitud
instance.interceptors.request.use(
    (config) => {
        // Obtener el token desde sessionStorage
        const token = sessionStorage.getItem("accessToken");

        // Si el token existe, agregarlo en la cabecera de Authorization
        if (token) {
            config.headers['Authorization'] = `Barrer ${token}`; 
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance; 
