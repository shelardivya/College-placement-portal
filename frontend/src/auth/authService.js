import api from "../api/axios";

export const registerStudent = (studentData) => {
    return api.post("/auth/register/student", studentData);
};

export const loginStudent = (loginData) => {
    return api.post("/auth/login", loginData);
};