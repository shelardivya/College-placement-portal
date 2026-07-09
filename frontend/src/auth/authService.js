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