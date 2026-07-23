import api from "../api/axios";

export const registerStudent = (studentData) => {
    return api.post("/auth/register/student", studentData);
};

export const loginStudent = (loginData) => {
    return api.post("/auth/login", loginData);
};

export const loginAdmin = (adminData) => {
    return api.post("/auth/admin/login", adminData);
};

export const forgotPassword = (email) => {
    return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (resetData) => {
    return api.post("/auth/reset-password", resetData);
};

export const createJobPosting = (jobData) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = localStorage.getItem("user");
    console.log("--- API Debug Info ---");
    console.log("Token in localStorage:", token);
    console.log("Role in localStorage:", role);
    console.log("User in localStorage:", user);
    console.log("Payload sending to API:", jobData);
    console.log("----------------------");
    return api.post("/admin/job/add", jobData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


export const getDrafts = () => {
    const token =
        localStorage.getItem("token");
    return api.get("/admin/drafts", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


export const getDraftById = (id) => {
    const token =
        localStorage.getItem("token");
    return api.get(`/admin/draft/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


export const publishDraft = (id) => {
    const token = localStorage.getItem("token");
    return api.put(`/admin/draft/publish/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};



export const getAdminProfile = () => {
    const token = localStorage.getItem("token");

    return api.get("/api/admin/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getStudentProfile = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/student/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updateAdminProfile = (profileData) => {
    const token = localStorage.getItem("token");
    return api.put("/api/admin/profile", profileData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updateStudentProfile = (profileData) => {
    const token = localStorage.getItem("token");
    return api.put("/api/student/profile", profileData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getStudentDashboardStats = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/student/dashboard/stats", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getAdminStudentAnalyticsDashboard = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/admin/student-analytics/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getAdminRecentPosts = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/admin/dashboard/recent-posts", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getAllPlacementDrives = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/admin/placement-drive/all", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const addPlacementDrive = (driveData) => {
    const token = localStorage.getItem("token");
    return api.post("/api/admin/placement-drive/add", driveData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updatePlacementDrive = (id, driveData) => {
    const token = localStorage.getItem("token");
    return api.put(`/api/admin/placement-drive/update/${id}`, driveData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const deletePlacementDrive = (id) => {
    const token = localStorage.getItem("token");
    return api.delete(`/api/admin/placement-drive/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getAllTopPlacedStudents = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/admin/top-placed-student/all", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const addTopPlacedStudent = (studentData) => {
    const token = localStorage.getItem("token");
    return api.post("/api/admin/top-placed-student/add", studentData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getAllQueries = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/admin/query/all", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const replyToQuery = (id, replyText) => {
    const token = localStorage.getItem("token");
    return api.put(`/api/admin/query/${id}/reply`, { reply: replyText }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const changePassword = (passwordData) => {
    const token = localStorage.getItem("token");
    return api.put("/auth/change-password", passwordData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getLatestJobs = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/student/jobs/latest", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const applyForJob = (jobId, formData) => {
    const token = localStorage.getItem("token");
    return api.post(`/api/student/jobs/${jobId}/apply`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getStudentQueries = () => {
    const token = localStorage.getItem("token");
    return api.get("/api/student/query", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const submitStudentQuery = (queryData) => {
    const token = localStorage.getItem("token");
    return api.post("/api/student/query", queryData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
