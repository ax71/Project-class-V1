import Cookies from "js-cookie";

// Kita definisikan Base URL agar tidak berulang
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

  // PERBAIKAN: Sesuai Docs v2.0, token ada di json.data.access_token
  const responseData = json.data;

  if (responseData?.access_token) {
    Cookies.set("token", responseData.access_token, { expires: 7 });
  }

  // PERBAIKAN: User ada di json.data.user
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

  // PERBAIKAN: Unwrapping data sesuai Docs v2.0
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

export async function logoutUser() {
  const token = Cookies.get("token");

  // Kita tetap hapus data di browser meskipun token tidak ada / request gagal
  // agar user tidak terjebak di state login palsu.
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
    // Selalu hapus data lokal apa pun hasil dari server
    clearLocalData();
  }
}

export async function getCurrentUser() {
  const token = Cookies.get("token");

  if (!token) {
    // Jangan throw Error, return null saja agar UI bisa redirect dengan halus
    return null;
  }

  // PERBAIKAN: Endpoint adalah '/user' bukan '/me'
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

  // PERBAIKAN PENTING:
  // Backend mengembalikan: { success: true, data: { id: 1, name: "..." } }
  // Frontend butuh langsung objek usernya.
  // Jadi kita return json.data

  if (json.data) {
    Cookies.set("user_profile", JSON.stringify(json.data), { expires: 7 });
    localStorage.setItem("user", JSON.stringify(json.data));
    return json.data; // <--- Return User Object langsung
  }

  return json;
}
