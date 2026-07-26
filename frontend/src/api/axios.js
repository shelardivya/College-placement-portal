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
    baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.request.use((config) => {
    // Nginx strips the first /api from the URL. The Spring Boot controllers 
    // for admin routes are inconsistently mapped to /api/admin/... 
    // (while student routes are correctly mapped to /student/...)
    // So we must manually prepend an extra /api only to admin routes!
    if (config.url && config.url.startsWith('/admin/')) {
        config.url = `/api${config.url}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;


// import.meta.env.VITE_API_BASE_URL
