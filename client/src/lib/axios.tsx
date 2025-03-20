import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://localhost:3670/',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// axios.interceptors.request.use(
//     async (config) => {
//         const accessToken = localStorage.getItem('accessToken');
//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// axios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         if (error.response && error.response.status === 403) {
//             try {
//                 const res = await axios.post('/api/refresh-token');
//                 localStorage.setItem('accessToken', res.data.accessToken);
//                 error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
//                 return axios(error.config);
//             } catch (refreshError) {
//                 console.error('Refresh Token Expired');
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export default axios;
