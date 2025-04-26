import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode"; //  Not used here anymore
import "./AuthForm.css";

const AuthForm = ({ mode }) => {
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, register, user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await login(identifier, password);
        toast.success("Login successful!");
      } else {
        await register(identifier, email, password);
        toast.success("Registration successful!");
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const idToken = credentialResponse.credential; // Get the ID token

      if (!idToken) {
        throw new Error("Google ID token is missing.");
      }
      await loginWithGoogle({ token: idToken });
      toast.success("Logged in with Google!");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error(error.message || "Google login failed");
      setError("Google login failed. Please try again."); // Set error state
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = (error) => {
    console.error("Google Login Error:", error); // Log the error
    toast.error("Google Login Failed");
    setError("Google login failed."); // set the error message.
    setLoading(false);
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="identifier">
            {mode === "login" ? "Username or Email:" : "Username:"}
          </label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className={"btn-submit"} type="submit" disabled={loading}>
          {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </button>

        {mode === "login" && (
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              //   uxMode="redirect" //  -- Important for some environments.  Try it if you have issues.
            />
          </div>
        )}

        {mode === "login" ? (
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        ) : (
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
