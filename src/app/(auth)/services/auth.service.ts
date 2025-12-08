import { LoginForm } from "@/validations/auth-validation";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export const loginUser = async (payload: LoginForm) => {
  try {
    const response = await axiosInstance.post("login", payload);

    const { access_token, data: user } = response.data;

    Cookies.set("token", access_token, { expires: 7 });
    Cookies.set("user_profile", JSON.stringify(user), { expires: 7 });
  } catch (error: any) {
    const message = error.response?.data?.message || "Login Faild";
    throw new Error(message);
  }
};
