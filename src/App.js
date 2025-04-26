import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AuthForm from "./pages/AuthForm";
import Layout from "./components/Layout";

import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider

const App = () => {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  console.log(GOOGLE_CLIENT_ID);
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {" "}
      {/* Wrap your app */}
      <Router>
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/news/:id"
              element={
                <Layout>
                  <NewsDetailPage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <AuthForm mode="login" />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout>
                  <AuthForm mode="register" />
                </Layout>
              }
            />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
