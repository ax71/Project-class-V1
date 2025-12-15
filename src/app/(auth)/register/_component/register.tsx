"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { RegisterForm, registerSchema } from "@/validations/auth-validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_REGISTER_FORM } from "@/constants/auth-constants";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/form-input";
import Link from "next/link";
import { registerUser } from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);
  const [successMSG, setSuccessMSG] = useState<string | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: INITIAL_REGISTER_FORM,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      setErrorMSG(null);
      setSuccessMSG(null);

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmpassword,
        role: "user" as const, // Default role for new registrations
      };

      const response = await registerUser(payload);

      setSuccessMSG("Registration successful! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("REGISTER ERROR:", error.message);
      
      // User-friendly error messages
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message.includes("422") || error.message.includes("validation")) {
        errorMessage = "Please check your input. Make sure all fields are filled correctly.";
      } else if (error.message.includes("email") && error.message.includes("taken")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (error.message.includes("Network") || error.message.includes("fetch")) {
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
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Please register to continue
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
                    Registration Failed
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {errorMSG}
                  </p>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {successMSG && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Success!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {successMSG}
                  </p>
                </div>
              </div>
            )}

            <FormInput
              form={form}
              type="text"
              name="name"
              label="Name"
              placeholder="Insert your name"
            />

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

            <FormInput
              form={form}
              type="password"
              name="confirmpassword"
              label="Confirm Password"
              placeholder="********"
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing..." : "Register"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-muted-foreground mt-3 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#69B1F0] hover:underline">
            Log In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
