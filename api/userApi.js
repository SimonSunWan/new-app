import { api } from "@/utils/request.js";

export const login = (params) => api.post("/auth/login", params);
export const getUserInfo = () => api.get("/users/me");
