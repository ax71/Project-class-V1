const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const loginUser = async ({ email, password }: any) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login gagal di sisi Server");
  }

  return data;
};
