"use server";

import { cookies } from "next/headers";

export async function getCourse() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) return null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.ok) {
      throw new Error("Gagal mengambil data course");
    }

    const data = await res.json();

    return data.data || data;
  } catch (err) {
    console.error("Error getCourse:", err);
    return null;
  }
}
