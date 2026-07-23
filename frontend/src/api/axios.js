// import axios from "axios";
// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json"
//     }
// });

// export default api;

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "any-value" // Bypasses the ngrok warning screen
    }
});









// api.interceptors.request.use((config) => {
//     if (config.url && config.url.includes('/admin/job/')) {
//         config.url = `/api${config.url}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default api;
