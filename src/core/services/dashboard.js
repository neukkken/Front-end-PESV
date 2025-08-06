import axios from './axios.js';

const getDashboardData = () => axios.get('/pesv/dashboard/data');

export default {
    getDashboardData
}