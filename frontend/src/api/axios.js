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
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
    // Nginx strips the first /api from the URL, but the Spring Boot controllers 
    // for admin and student routes are mapped to /api/admin/... and /api/student/...
    // So we must manually prepend an extra /api to these specific routes!
    if (config.url && (config.url.startsWith('/admin/') || config.url.startsWith('/student/'))) {
        config.url = `/api${config.url}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
//     if (config.url && config.url.includes('/admin/job/')) {
//         config.url = `/api${config.url}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default api;
