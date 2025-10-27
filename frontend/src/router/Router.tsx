// src/router/Router.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import AdminRegister from "../Pages/Auth/AdminRegister";
import StudentRegisterPage from "../Pages/Auth/StudentRegisterPage";
import TeacherRegisterPage from "../Pages/Auth/TeacherRegisterPage";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/students/register"
          element={<StudentRegisterPage />}
        />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
        <Route
          path="/admin/teachers/register"
          element={<TeacherRegisterPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
