import Cookies from "js-cookie";


export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "admin" | "user";
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to register");
  }

  if (data.access_token) {
    Cookies.set("token", data.access_token, { expires: 7 }); // 7 days expiry
  }
  if (data.data) {
    Cookies.set("user_profile", JSON.stringify(data.data), { expires: 7 });
  }

  return data;
}


export async function loginUser(payload: {
  email: string;
  password: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Store token and user data in Cookies for consistency with api-client.ts
  if (data.access_token) {
    Cookies.set("token", data.access_token, { expires: 7 }); // 7 days expiry
  }
  if (data.data) {
    Cookies.set("user_profile", JSON.stringify(data.data), { expires: 7 });
  }

  return data;
}

export async function logoutUser() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${baseUrl}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Logout failed");
  }

  Cookies.remove("token");
  Cookies.remove("user_profile");

  return data;
}

export async function getCurrentUser() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${baseUrl}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user profile");
  }

  if (data.data) {
    Cookies.set("user_profile", JSON.stringify(data.data), { expires: 7 });
  }

  return data;
}
