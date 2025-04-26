import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
        navigate("/login");
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, [navigate]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (identifier, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier,
        password,
      });
      const loggedInUser = response.data;
      setUser(loggedInUser);
      toast.success("Login successful!");
      navigate("/");
      return loggedInUser;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error("Login failed: " + errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
      });
      const newUser = response.data;
      setUser(newUser);
      toast.success("Registration successful!");
      navigate("/");
      return newUser;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error("Registration failed: " + errorMessage);
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async (googleUser) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/google-login`,
        googleUser // Send the { token: idToken }
      );
      const userData = response.data;
      setUser(userData);
      toast.success("Logged in with Google!");
      navigate("/");
      return userData;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      toast.error("Google login failed: " + errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out");
    navigate("/login");
  };

  return {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
  };
};

export { useAuth };
