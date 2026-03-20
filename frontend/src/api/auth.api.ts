import api from "../lib/axios";
import type { LoginUserFormData, RegisterUserFormData } from "../schemas/auth.schemas";
import { backendUrl } from "../utils/constants";

export const registerUser = async (data: RegisterUserFormData) => {
    console.log({ backendUrl });

    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.profileImage && data.profileImage.length > 0) {
        formData.append("profileImage", data.profileImage[0]);
    }

    const response = await api.post("/users/register", formData);

    console.log("Register DATA: ", response.data);

    const token = response.data.data.accessToken;

    console.log("Token being stored:", token);

    localStorage.setItem("token", token);

    return response.data;
};

export const loginUser = async (data: LoginUserFormData) => {
    const formData = new FormData();
    console.log(data);
    console.log(typeof data.identifier);

    if (data.identifier.includes("@")) {
        console.log("it is an email");
        formData.append("email", data.identifier);
    } else {
        console.log("it is a username");
        formData.append("username", data.identifier);
    }
    formData.append("password", data.password);

    // console.log(formData);

    const response = await api.post("/users/login", formData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log("Login response:", response.data);
    const token = response.data.data.accessToken;

    console.log("Token being stored:", token);
    localStorage.setItem("token", token);

    return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  return await api.get("/users/current-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const logoutUser = async () => {
    const token = localStorage.getItem("token");

    return await api.get("/users/logout", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};