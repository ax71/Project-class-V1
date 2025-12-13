"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { LoginForm, loginSchema } from "@/validations/auth-validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_LOGIN_FORM } from "@/constants/auth-constants";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/form-input";
import Link from "next/link";
import { loginUser } from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const onSubmit = form.handleSubmit(async (formData) => {
    try {
      setLoading(true);
      setErrorMSG(null);
      
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log("🔥 Respon Laravel:", response);
      const accessToken = response.access_token;
      const userData = response.data;

      if (!accessToken) {
        throw new Error("Laravel tidak mengirimkan Token!");
      }

      // 3. Simpan Token ke Cookie (Agar Middleware Next.js bisa baca)
      document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

      // Simpan data user untuk pengecekan role
      document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `user_profile=${JSON.stringify(
        userData
      )}; path=/; max-age=86400; SameSite=Lax`;

      // 4. Redirect
      if (userData.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/users";
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setErrorMSG(error.message || "Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl ">Welcome</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Please login to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
              form={form}
              type="email"
              name="email"
              label="Email"
              placeholder="Insert your email"
            />

            <FormInput
              form={form}
              type="password"
              name="password"
              label="Password"
              placeholder="********"
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Login"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-muted-foreground mt-3">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#69B1F0] hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
