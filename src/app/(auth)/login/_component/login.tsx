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
import { AlertCircle } from "lucide-react";

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

      const accessToken = response.data.access_token;
      const userData = response.data.user;

      if (!accessToken) {
        throw new Error("Server did not return an authentication token");
      }

      document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `user_profile=${JSON.stringify(
        userData
      )}; path=/; max-age=86400; SameSite=Lax`;

      if (userData?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/users");
      }
      
      router.refresh(); 

    } catch (error: any) {
      console.error("Login Error:", error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message?.includes("Network") || error.message?.includes("fetch")) {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrorMSG(errorMessage);
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
            {/* Error Alert */}
            {errorMSG && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Login Failed
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {errorMSG}
                  </p>
                </div>
              </div>
            )}

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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing..." : "Login"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-muted-foreground mt-3 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#69B1F0] hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
