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

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: INITIAL_REGISTER_FORM,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmpassword,
      };

      const response = await registerUser(payload);

      // console.log("REGISTER SUCCESS:", response);
      // Bisa diarahkan ke login
      router.push("/login");
    } catch (error: any) {
      console.error("REGISTER ERROR:", error.message);
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
            <FormInput
              form={form}
              type="text"
              name="name"
              label="Name"
              placeholder="Insert your name"
            />

            {/* <FormInput
              form={form}
              type="text"
              name="username"
              label="Username"
              placeholder="Insert your username"
            /> */}

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

            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Register"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-muted-foreground mt-3">
          Already have an account?{" "}
          <Link href="/login" className="text-[#69B1F0] hover:underline">
            Log In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
