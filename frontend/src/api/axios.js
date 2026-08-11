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
    // are inconsistently mapped: most admin/student routes are mapped to /api/admin/... 
    // and /api/student/..., BUT /student/resume-match is missing the /api prefix!
    if (config.url) {
        if (config.url.startsWith('/admin/') ||
            (config.url.startsWith('/student/') && !config.url.includes('resume-match'))) {
            config.url = `/api${config.url}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;


// import.meta.env.VITE_API_BASE_URL
