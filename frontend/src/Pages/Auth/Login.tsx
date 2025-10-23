// src/pages/Auth/Login.tsx
import React from "react";
import AuthLayout from "../../Components/auth/AuthLayout/AuthLayout";
import LoginForm from "../../Components/auth/LoginForm/LoginForm";

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
