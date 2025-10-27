// src/components/auth/AdminRegisterForm/AdminRegisterForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiLock,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiAward,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

// Import styled components from separate file
import {
  FormContainer,
  FormCard,
  FormHeader,
  FormTitle,
  FormSubtitle,
  Form,
  FormSection,
  SectionTitle,
  SectionDescription,
  InputGrid,
  InputGroup,
  Label,
  Input,
  Select,
  Textarea,
  Icon,
  PasswordToggle,
  CheckboxGroup,
  CheckboxLabel,
  RequirementList,
  RequirementItem,
  SubmitButton,
  BackButton,
  ButtonGroup,
  ErrorMessage,
  SuccessMessage,
  FormFooter,
  LoginLink,
} from "./AdminRegisterForm.styles";

interface FormData {
  // Basic Information
  adminId: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Personal Information
  dateOfBirth: string;
  gender: string;
  phone: string;
  emergencyContact: string;
  emergencyName: string;

  // Address
  street: string;
  city: string;
  state: string;
  pincode: string;

  // Professional
  department: string;
  designation: string;
  work: string;
  qualification: string[];
  joiningDate: string;
  salary: string;
  isMainAdmin: boolean;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const AdminRegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    adminId: "",
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    emergencyContact: "",
    emergencyName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    department: "IT",
    designation: "System Administrator",
    work: "",
    qualification: ["B.Tech"],
    joiningDate: "",
    salary: "",
    isMainAdmin: true,
  });

  const [currentQualification, setCurrentQualification] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  // Password requirements
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addQualification = () => {
    if (
      currentQualification.trim() &&
      !formData.qualification.includes(currentQualification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        qualification: [...prev.qualification, currentQualification.trim()],
      }));
      setCurrentQualification("");
    }
  };

  const removeQualification = (qual: string) => {
    setFormData((prev) => ({
      ...prev,
      qualification: prev.qualification.filter((q) => q !== qual),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validations
    if (!formData.adminId) newErrors.adminId = "Admin ID is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!allRequirementsMet)
      newErrors.password = "Password requirements not met";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.work) newErrors.work = "Work description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const submitData = {
        ...formData,
        // Generate employee ID from admin ID
        employeeId: `EMP${formData.adminId}`,
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register/admin",
        submitData
      );

      setSuccess("Administrator account created successfully!");
      console.log("Registration successful:", response.data);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      const apiError = error as ApiError;
      setErrors({
        submit:
          apiError.response?.data?.message ||
          apiError.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addQualification();
    }
  };

  return (
    <FormContainer>
      <FormCard>
        <FormHeader>
          <FormTitle>Create Administrator Account</FormTitle>
          <FormSubtitle>
            Fill in the details below to create the first system administrator
            account
          </FormSubtitle>
        </FormHeader>

        {success && (
          <SuccessMessage>
            <FiCheck size={18} />
            {success}
          </SuccessMessage>
        )}

        {errors.submit && (
          <ErrorMessage>
            <FiX size={16} />
            {errors.submit}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <FormSection>
            <SectionTitle>
              <FiUser size={18} />
              Basic Information
            </SectionTitle>
            <SectionDescription>
              Core account details for system access
            </SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="adminId">Admin ID *</Label>
                <Input
                  type="text"
                  id="adminId"
                  name="adminId"
                  value={formData.adminId}
                  onChange={handleInputChange}
                  placeholder="ADM001"
                  $hasError={!!errors.adminId}
                />
                {errors.adminId && (
                  <ErrorMessage>{errors.adminId}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="username">Username *</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="mainadmin"
                  $hasError={!!errors.username}
                />
                {errors.username && (
                  <ErrorMessage>{errors.username}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup style={{ gridColumn: "1 / -1" }}>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="System Administrator"
                  $hasError={!!errors.fullName}
                />
                {errors.fullName && (
                  <ErrorMessage>{errors.fullName}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup style={{ gridColumn: "1 / -1" }}>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@jain.edu"
                  $hasError={!!errors.email}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="password">Password *</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  $hasError={!!errors.password}
                />
                <Icon>
                  <FiLock size={18} />
                </Icon>
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </PasswordToggle>
                {errors.password && (
                  <ErrorMessage>{errors.password}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  $hasError={!!errors.confirmPassword}
                />
                <Icon>
                  <FiLock size={18} />
                </Icon>
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={14} />
                  ) : (
                    <FiEye size={14} />
                  )}
                </PasswordToggle>
                {errors.confirmPassword && (
                  <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                )}
              </InputGroup>
            </InputGrid>

            {/* Password Requirements */}
            <RequirementList>
              <RequirementItem $met={passwordRequirements.length}>
                <FiCheck size={14} />
                At least 8 characters
              </RequirementItem>
              <RequirementItem $met={passwordRequirements.uppercase}>
                <FiCheck size={14} />
                One uppercase letter
              </RequirementItem>
              <RequirementItem $met={passwordRequirements.lowercase}>
                <FiCheck size={14} />
                One lowercase letter
              </RequirementItem>
              <RequirementItem $met={passwordRequirements.number}>
                <FiCheck size={14} />
                One number
              </RequirementItem>
              <RequirementItem $met={passwordRequirements.special}>
                <FiCheck size={14} />
                One special character (@$!%*?&)
              </RequirementItem>
            </RequirementList>
          </FormSection>

          {/* Professional Information Section */}
          <FormSection>
            <SectionTitle>
              <FiBriefcase size={18} />
              Professional Information
            </SectionTitle>
            <SectionDescription>Work and department details</SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="department">Department *</Label>
                <Select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  $hasError={!!errors.department}
                >
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Academic">Academic</option>
                  <option value="Finance">Finance</option>
                  <option value="Administration">Administration</option>
                </Select>
                {errors.department && (
                  <ErrorMessage>{errors.department}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="designation">Designation *</Label>
                <Select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                >
                  <option value="System Administrator">
                    System Administrator
                  </option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Finance Manager">Finance Manager</option>
                </Select>
              </InputGroup>

              <InputGroup style={{ gridColumn: "1 / -1" }}>
                <Label htmlFor="work">Work Description *</Label>
                <Textarea
                  id="work"
                  name="work"
                  value={formData.work}
                  onChange={handleInputChange}
                  placeholder="Describe the primary responsibilities..."
                  rows={3}
                  $hasError={!!errors.work}
                />
                {errors.work && <ErrorMessage>{errors.work}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                />
                <Icon>
                  <FiCalendar size={18} />
                </Icon>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="salary">Salary (₹)</Label>
                <Input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="50000"
                />
                <Icon>
                  <FiDollarSign size={18} />
                </Icon>
              </InputGroup>
            </InputGrid>

            {/* Qualifications */}
            <InputGroup>
              <Label>Qualifications</Label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Input
                  type="text"
                  value={currentQualification}
                  onChange={(e) => setCurrentQualification(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add qualification (e.g., M.Tech)"
                />
                <button
                  type="button"
                  onClick={addQualification}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {formData.qualification.map((qual, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#EFF6FF",
                      color: "#1E40AF",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    <FiAward size={12} />
                    {qual}
                    <button
                      type="button"
                      onClick={() => removeQualification(qual)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#DC2626",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </InputGroup>

            <CheckboxGroup>
              <input
                type="checkbox"
                id="isMainAdmin"
                name="isMainAdmin"
                checked={formData.isMainAdmin}
                onChange={handleInputChange}
              />
              <CheckboxLabel htmlFor="isMainAdmin">
                Grant full system administrator privileges
              </CheckboxLabel>
            </CheckboxGroup>
          </FormSection>

          <ButtonGroup>
            <BackButton type="button" onClick={() => navigate("/login")}>
              Back to Login
            </BackButton>
            <SubmitButton
              type="submit"
              disabled={isLoading || !allRequirementsMet}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                "Create Administrator Account"
              )}
            </SubmitButton>
          </ButtonGroup>
        </Form>

        <FormFooter>
          <LoginLink href="/login">
            Already have an account? Sign in here
          </LoginLink>
        </FormFooter>
      </FormCard>
    </FormContainer>
  );
};

export default AdminRegisterForm;
