import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define your form schema with Zod
const formSchema = z.object({
  identifier: z.string().min(2, {
    message: "Identifier must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true); //  track login/register
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(`${backendUrl}/api/auth/google`, {
          token: tokenResponse.credential,
        });
        localStorage.setItem("token", response.data.token);
        toast.success("Google login successful!");
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Google login failed");
      }
    },
    onError: () => {
      toast.error("Google login error");
    },
  });

  async function onSubmit(values) {
    try {
      const endpoint = isLogin
        ? `${backendUrl}/api/auth/login`
        : `${backendUrl}/api/auth/register`;
      const response = await axios.post(endpoint, values);

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.success("Registration successful! Please login.");
        setIsLogin(true); // Switch to login after successful registration
        form.reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  }

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect to home page
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isLogin ? "Username or Email" : "Username"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
            <Button
              type="button"
              className="w-full mt-2"
              variant="outline"
              onClick={googleLogin}
            >
              Continue with Google
            </Button>
          </form>
        </Form>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            form.reset();
          }}
          className="mt-4 text-sm text-gray-600 hover:text-blue-500"
        >
          {isLogin ? "Create an account" : "Login to your account"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
