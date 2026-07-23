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