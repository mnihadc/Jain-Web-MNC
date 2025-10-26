import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FiLock, FiMail, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${(props) => (props.$hasError ? "#ef4444" : "#e5e7eb")};
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;

  &:hover {
    color: #374151;
  }
`;

const RoleSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RoleButton = styled.button<{ $isSelected: boolean }>`
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => (props.$isSelected ? "#3b82f6" : "#e5e7eb")};
  background: ${(props) => (props.$isSelected ? "#3b82f6" : "white")};
  color: ${(props) => (props.$isSelected ? "white" : "#374151")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: #3b82f6;
    background: ${(props) => (props.$isSelected ? "#3b82f6" : "#f8fafc")};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ForgotPassword = styled.a`
  color: #6b7280;
  text-decoration: none;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
  display: block;

  &:hover {
    color: #374151;
  }
`;

type UserRole = "student" | "teacher" | "admin";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student" as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [apiError, setApiError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear API error
    if (apiError) {
      setApiError("");
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));

    // Clear API error when changing role
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      // Direct API call to backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          withCredentials: true, // Important for cookies
        }
      );

      console.log("Login successful:", response.data);

      // Redirect based on role
      navigate(`/${formData.role}/dashboard`);
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle different error types
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.request) {
        setApiError("Cannot connect to server. Please try again.");
      } else {
        setApiError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Welcome Back</FormTitle>
      <FormSubtitle>Sign in to your account</FormSubtitle>

      {/* API Error Message */}
      {apiError && (
        <ErrorMessage
          style={{ marginBottom: "1rem", justifyContent: "center" }}
        >
          <FiAlertCircle size={16} />
          {apiError}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <RoleSelector>
          <RoleButton
            type="button"
            $isSelected={formData.role === "student"}
            onClick={() => handleRoleChange("student")}
          >
            Student
          </RoleButton>
          <RoleButton
            type="button"
            $isSelected={formData.role === "teacher"}
            onClick={() => handleRoleChange("teacher")}
          >
            Teacher
          </RoleButton>
          <RoleButton
            type="button"
            $isSelected={formData.role === "admin"}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </RoleButton>
        </RoleSelector>

        <InputGroup>
          <Icon>
            <FiMail size={20} />
          </Icon>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            $hasError={!!errors.email}
            disabled={isLoading}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Icon>
            <FiLock size={20} />
          </Icon>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            $hasError={!!errors.password}
            disabled={isLoading}
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </PasswordToggle>
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </SubmitButton>

        <ForgotPassword href="#">Forgot your password?</ForgotPassword>
      </Form>
    </FormContainer>
  );
};

// Add spinner component
const Spinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default LoginForm;
