"use server";

import { INITIAL_LOGIN_FORM } from "@/constants/auth-constants";
import axiosInstance from "@/lib/axios";
import { AuthFormState } from "@/types/auth";
import { loginSchema } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: AuthFormState,
  formData: FormData | null
) {
  if (!formData) {
    return INITIAL_LOGIN_FORM;
  }

  // ✅ Validasi input seperti biasa
  const validatedFields = loginSchema.safeParse({
    email: formData?.get("email"),
    password: formData?.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  try {
    const response = await axiosInstance.post("/login", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });

    const { data: user, access_token: token } = response.data;

    if (!token) {
      return {
        status: "error",
        errors: { _form: ["Login gagal: token tidak ditemukan"] },
      };
    }

    const cookiesStore = await cookies();
    cookiesStore.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });
    cookiesStore.set("user_profile", JSON.stringify(user), {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Login gagal, periksa kembali akun Anda.";

    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [message],
      },
    };
  }
}
