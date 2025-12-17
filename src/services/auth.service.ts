import apiClient from "@/lib/api-client";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "admin" | "user";
}) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to register");
  }

  const responseData = json.data;

  if (responseData?.access_token) {
    Cookies.set("token", responseData.access_token, { expires: 7 });
  }

  if (responseData?.user) {
    Cookies.set("user_profile", JSON.stringify(responseData.user), {
      expires: 7,
    });
    localStorage.setItem("user", JSON.stringify(responseData.user)); // Backup ke localStorage agar konsisten
  }

  return responseData;
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Login failed");
  }

  const responseData = json.data;

  if (responseData?.access_token) {
    Cookies.set("token", responseData.access_token, { expires: 7 });
  }

  if (responseData?.user) {
    Cookies.set("user_profile", JSON.stringify(responseData.user), {
      expires: 7,
    });
    localStorage.setItem("user", JSON.stringify(responseData.user));
  }

  return responseData;
}

export const updateProfile = async (name: string) => {
  // Panggil endpoint baru yang kita buat di atas
  const response = await apiClient.put("/profile/update", { name });
  return response.data;
};

export async function logoutUser() {
  const token = Cookies.get("token");

  const clearLocalData = () => {
    Cookies.remove("token");
    Cookies.remove("user_profile");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!token) {
    clearLocalData();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Logout failed on server, cleaning up locally anyway.");
    }
  } catch (error) {
    console.error("Logout connection error", error);
  } finally {
    clearLocalData();
  }
}

export async function getCurrentUser() {
  const token = Cookies.get("token");

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    // Jika token expired (401), bersihkan data
    if (response.status === 401) {
      Cookies.remove("token");
      localStorage.removeItem("user");
    }
    throw new Error(json.message || "Failed to fetch user profile");
  }

  if (json.data) {
    Cookies.set("user_profile", JSON.stringify(json.data), { expires: 7 });
    localStorage.setItem("user", JSON.stringify(json.data));
    return json.data;
  }

  return json;
}
