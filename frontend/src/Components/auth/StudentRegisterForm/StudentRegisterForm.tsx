// src/components/students/StudentRegisterForm/StudentRegisterForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBook,
  FiUsers,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiCalendar,
  FiAward,
} from "react-icons/fi";

// Import styled components
import {
  FormContainer,
  FormCard,
  FormHeader,
  FormTitle,
  FormSubtitle,
  Form,
  FormSection,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  SectionDescription,
  InputGrid,
  FullWidthGrid,
  InputGroup,
  Label,
  RequiredStar,
  Input,
  Select,
  Textarea,
  PasswordInputWrapper,
  PasswordToggle,
  CheckboxGroup,
  CheckboxLabel,
  ButtonGroup,
  SecondaryButton,
  PrimaryButton,
  ErrorMessage,
  SuccessMessage,
  FormFooter,
  InfoText,
} from "./StudentRegisterForm.styles";

interface StudentFormData {
  // Basic Information
  admissionId: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;

  // Personal Information
  personalInfo: {
    dateOfBirth: string;
    age: number;
    gender: "male" | "female" | "other";
    bloodGroup: string;
    nationality: string;
  };

  // Contact Information
  contact: {
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyName: string;
  };

  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  // Academic Information
  academic: {
    course: string;
    specialization: string;
    academicYear: string;
    semester: number;
    section: string;
    rollNumber: string;
    batch: string;
  };

  // Parent Information
  parentInfo: {
    fatherName: string;
    motherName: string;
    fatherOccupation: string;
    motherOccupation: string;
    parentPhone: string;
    parentEmail: string;
    annualIncome: string;
  };

  isActive: boolean;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const StudentRegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<StudentFormData>({
    admissionId: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    personalInfo: {
      dateOfBirth: "",
      age: 0,
      gender: "male",
      bloodGroup: "",
      nationality: "Indian",
    },
    contact: {
      email: "",
      phone: "",
      emergencyContact: "",
      emergencyName: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    academic: {
      course: "B.Tech",
      specialization: "",
      academicYear: `${new Date().getFullYear()}-${
        new Date().getFullYear() + 1
      }`,
      semester: 1,
      section: "A",
      rollNumber: "",
      batch: "",
    },
    parentInfo: {
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      parentPhone: "",
      parentEmail: "",
      annualIncome: "0-3 LPA",
    },
    isActive: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof StudentFormData],
          [child]: type === "number" ? parseInt(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const calculateAge = (dateString: string): number => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateOfBirth = e.target.value;
    const age = calculateAge(dateOfBirth);

    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        dateOfBirth,
        age,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic Information Validation
    if (!formData.admissionId.trim())
      newErrors.admissionId = "Admission ID is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Personal Information Validation
    if (!formData.personalInfo.dateOfBirth)
      newErrors["personalInfo.dateOfBirth"] = "Date of birth is required";
    if (formData.personalInfo.age < 15)
      newErrors["personalInfo.dateOfBirth"] =
        "Student must be at least 15 years old";
    if (formData.personalInfo.age > 30)
      newErrors["personalInfo.dateOfBirth"] =
        "Student must be less than 30 years old";

    // Contact Information Validation
    if (!formData.contact.email.trim())
      newErrors["contact.email"] = "Email is required";
    if (!formData.contact.phone.trim())
      newErrors["contact.phone"] = "Phone number is required";
    if (!formData.contact.emergencyContact.trim())
      newErrors["contact.emergencyContact"] = "Emergency contact is required";
    if (!formData.contact.emergencyName.trim())
      newErrors["contact.emergencyName"] = "Emergency contact name is required";

    // Address Validation
    if (!formData.address.street.trim())
      newErrors["address.street"] = "Street address is required";
    if (!formData.address.city.trim())
      newErrors["address.city"] = "City is required";
    if (!formData.address.state.trim())
      newErrors["address.state"] = "State is required";
    if (!formData.address.pincode.trim())
      newErrors["address.pincode"] = "Pincode is required";

    // Academic Information Validation
    if (!formData.academic.specialization.trim())
      newErrors["academic.specialization"] = "Specialization is required";
    if (!formData.academic.rollNumber.trim())
      newErrors["academic.rollNumber"] = "Roll number is required";

    // Parent Information Validation
    if (!formData.parentInfo.fatherName.trim())
      newErrors["parentInfo.fatherName"] = "Father's name is required";
    if (!formData.parentInfo.motherName.trim())
      newErrors["parentInfo.motherName"] = "Mother's name is required";
    if (!formData.parentInfo.fatherOccupation.trim())
      newErrors["parentInfo.fatherOccupation"] =
        "Father's occupation is required";
    if (!formData.parentInfo.motherOccupation.trim())
      newErrors["parentInfo.motherOccupation"] =
        "Mother's occupation is required";
    if (!formData.parentInfo.parentPhone.trim())
      newErrors["parentInfo.parentPhone"] = "Parent's phone number is required";

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
        role: "student",
      };

      const response = await axios.post(
        "http://localhost:5000/api/students/register",
        submitData
      );

      setSuccess("Student registered successfully!");
      console.log("Registration successful:", response.data);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          admissionId: "",
          username: "",
          fullName: "",
          password: "",
          confirmPassword: "",
          personalInfo: {
            dateOfBirth: "",
            age: 0,
            gender: "male",
            bloodGroup: "",
            nationality: "Indian",
          },
          contact: {
            email: "",
            phone: "",
            emergencyContact: "",
            emergencyName: "",
          },
          address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
          },
          academic: {
            course: "B.Tech",
            specialization: "",
            academicYear: `${new Date().getFullYear()}-${
              new Date().getFullYear() + 1
            }`,
            semester: 1,
            section: "A",
            rollNumber: "",
            batch: "",
          },
          parentInfo: {
            fatherName: "",
            motherName: "",
            fatherOccupation: "",
            motherOccupation: "",
            parentPhone: "",
            parentEmail: "",
            annualIncome: "0-3 LPA",
          },
          isActive: true,
        });
        setSuccess("");
      }, 3000);
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

  const getCurrentAcademicYear = () => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${currentYear + 1}`;
  };

  return (
    <FormContainer>
      <FormCard>
        <FormHeader>
          <FormTitle>Register New Student</FormTitle>
          <FormSubtitle>
            Fill in the student details to create a new student account
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
            <SectionHeader>
              <SectionIcon>
                <FiUser size={20} />
              </SectionIcon>
              <SectionTitle>Basic Information</SectionTitle>
            </SectionHeader>
            <SectionDescription>
              Core account details for student access
            </SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="admissionId">
                  Admission ID <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="admissionId"
                  name="admissionId"
                  value={formData.admissionId}
                  onChange={handleInputChange}
                  placeholder="ADM20240001"
                  $hasError={!!errors.admissionId}
                />
                {errors.admissionId && (
                  <ErrorMessage>{errors.admissionId}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="username">
                  Username <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="john.doe"
                  $hasError={!!errors.username}
                />
                {errors.username && (
                  <ErrorMessage>{errors.username}</ErrorMessage>
                )}
              </InputGroup>

              <FullWidthGrid>
                <InputGroup>
                  <Label htmlFor="fullName">
                    Full Name <RequiredStar>*</RequiredStar>
                  </Label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    $hasError={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <ErrorMessage>{errors.fullName}</ErrorMessage>
                  )}
                </InputGroup>
              </FullWidthGrid>

              <InputGroup>
                <Label htmlFor="password">
                  Password <RequiredStar>*</RequiredStar>
                </Label>
                <PasswordInputWrapper>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••"
                    $hasError={!!errors.password}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </PasswordToggle>
                </PasswordInputWrapper>
                {errors.password && (
                  <ErrorMessage>{errors.password}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">
                  Confirm Password <RequiredStar>*</RequiredStar>
                </Label>
                <PasswordInputWrapper>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••"
                    $hasError={!!errors.confirmPassword}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </PasswordToggle>
                </PasswordInputWrapper>
                {errors.confirmPassword && (
                  <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                )}
              </InputGroup>
            </InputGrid>
          </FormSection>

          {/* Personal Information Section */}
          <FormSection>
            <SectionHeader>
              <SectionIcon>
                <FiUser size={20} />
              </SectionIcon>
              <SectionTitle>Personal Information</SectionTitle>
            </SectionHeader>
            <SectionDescription>
              Student's personal details and identification
            </SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="personalInfo.dateOfBirth">
                  Date of Birth <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="date"
                  id="personalInfo.dateOfBirth"
                  name="personalInfo.dateOfBirth"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={handleDateOfBirthChange}
                  $hasError={!!errors["personalInfo.dateOfBirth"]}
                />
                {errors["personalInfo.dateOfBirth"] && (
                  <ErrorMessage>
                    {errors["personalInfo.dateOfBirth"]}
                  </ErrorMessage>
                )}
                {formData.personalInfo.age > 0 && (
                  <InfoText>Age: {formData.personalInfo.age} years</InfoText>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="personalInfo.gender">
                  Gender <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  id="personalInfo.gender"
                  name="personalInfo.gender"
                  value={formData.personalInfo.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="personalInfo.bloodGroup">Blood Group</Label>
                <Select
                  id="personalInfo.bloodGroup"
                  name="personalInfo.bloodGroup"
                  value={formData.personalInfo.bloodGroup}
                  onChange={handleInputChange}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="personalInfo.nationality">Nationality</Label>
                <Input
                  type="text"
                  id="personalInfo.nationality"
                  name="personalInfo.nationality"
                  value={formData.personalInfo.nationality}
                  onChange={handleInputChange}
                  placeholder="Indian"
                />
              </InputGroup>
            </InputGrid>
          </FormSection>

          {/* Contact Information Section */}
          <FormSection>
            <SectionHeader>
              <SectionIcon>
                <FiPhone size={20} />
              </SectionIcon>
              <SectionTitle>Contact Information</SectionTitle>
            </SectionHeader>
            <SectionDescription>
              Student's contact details and emergency information
            </SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="contact.email">
                  Email <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="email"
                  id="contact.email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  placeholder="student@jain.edu"
                  $hasError={!!errors["contact.email"]}
                />
                {errors["contact.email"] && (
                  <ErrorMessage>{errors["contact.email"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="contact.phone">
                  Phone <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="tel"
                  id="contact.phone"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  $hasError={!!errors["contact.phone"]}
                />
                {errors["contact.phone"] && (
                  <ErrorMessage>{errors["contact.phone"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="contact.emergencyName">
                  Emergency Contact Name <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="contact.emergencyName"
                  name="contact.emergencyName"
                  value={formData.contact.emergencyName}
                  onChange={handleInputChange}
                  placeholder="Emergency Contact Name"
                  $hasError={!!errors["contact.emergencyName"]}
                />
                {errors["contact.emergencyName"] && (
                  <ErrorMessage>{errors["contact.emergencyName"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="contact.emergencyContact">
                  Emergency Contact Number <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="tel"
                  id="contact.emergencyContact"
                  name="contact.emergencyContact"
                  value={formData.contact.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  $hasError={!!errors["contact.emergencyContact"]}
                />
                {errors["contact.emergencyContact"] && (
                  <ErrorMessage>
                    {errors["contact.emergencyContact"]}
                  </ErrorMessage>
                )}
              </InputGroup>
            </InputGrid>
          </FormSection>

          {/* Address Information Section */}
          <FormSection>
            <SectionHeader>
              <SectionIcon>
                <FiMapPin size={20} />
              </SectionIcon>
              <SectionTitle>Address Information</SectionTitle>
            </SectionHeader>
            <SectionDescription>
              Student's permanent residential address
            </SectionDescription>

            <InputGrid>
              <FullWidthGrid>
                <InputGroup>
                  <Label htmlFor="address.street">
                    Street Address <RequiredStar>*</RequiredStar>
                  </Label>
                  <Textarea
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter complete street address"
                    $hasError={!!errors["address.street"]}
                  />
                  {errors["address.street"] && (
                    <ErrorMessage>{errors["address.street"]}</ErrorMessage>
                  )}
                </InputGroup>
              </FullWidthGrid>

              <InputGroup>
                <Label htmlFor="address.city">
                  City <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="Bangalore"
                  $hasError={!!errors["address.city"]}
                />
                {errors["address.city"] && (
                  <ErrorMessage>{errors["address.city"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="address.state">
                  State <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="Karnataka"
                  $hasError={!!errors["address.state"]}
                />
                {errors["address.state"] && (
                  <ErrorMessage>{errors["address.state"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="address.pincode">
                  Pincode <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="address.pincode"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  placeholder="560001"
                  $hasError={!!errors["address.pincode"]}
                  maxLength={6}
                />
                {errors["address.pincode"] && (
                  <ErrorMessage>{errors["address.pincode"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="address.country">Country</Label>
                <Input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  placeholder="India"
                />
              </InputGroup>
            </InputGrid>
          </FormSection>

          {/* Academic Information Section */}
          <FormSection>
            <SectionHeader>
              <SectionIcon>
                <FiBook size={20} />
              </SectionIcon>
              <SectionTitle>Academic Information</SectionTitle>
            </SectionHeader>
            <SectionDescription>
              Student's course and academic details
            </SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="academic.course">
                  Course <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  id="academic.course"
                  name="academic.course"
                  value={formData.academic.course}
                  onChange={handleInputChange}
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="BBA">BBA</option>
                  <option value="B.Com">B.Com</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="BCA">BCA</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="PhD">PhD</option>
                  <option value="MCA">MCA</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="academic.specialization">
                  Specialization <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="academic.specialization"
                  name="academic.specialization"
                  value={formData.academic.specialization}
                  onChange={handleInputChange}
                  placeholder="Computer Science"
                  $hasError={!!errors["academic.specialization"]}
                />
                {errors["academic.specialization"] && (
                  <ErrorMessage>
                    {errors["academic.specialization"]}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="academic.academicYear">
                  Academic Year <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="academic.academicYear"
                  name="academic.academicYear"
                  value={formData.academic.academicYear}
                  onChange={handleInputChange}
                  placeholder="2024-2025"
                  $hasError={!!errors["academic.academicYear"]}
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="academic.semester">
                  Semester <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  id="academic.semester"
                  name="academic.semester"
                  value={formData.academic.semester}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="academic.section">
                  Section <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  id="academic.section"
                  name="academic.section"
                  value={formData.academic.section}
                  onChange={handleInputChange}
                >
                  {["A", "B", "C", "D"].map((section) => (
                    <option key={section} value={section}>
                      Section {section}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="academic.rollNumber">
                  Roll Number <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="academic.rollNumber"
                  name="academic.rollNumber"
                  value={formData.academic.rollNumber}
                  onChange={handleInputChange}
                  placeholder="CS2024001"
                  $hasError={!!errors["academic.rollNumber"]}
                />
                {errors["academic.rollNumber"] && (
                  <ErrorMessage>{errors["academic.rollNumber"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="academic.batch">Batch</Label>
                <Input
                  type="text"
                  id="academic.batch"
                  name="academic.batch"
                  value={formData.academic.batch}
                  onChange={handleInputChange}
                  placeholder="2024-2028"
                />
              </InputGroup>
            </InputGrid>
          </FormSection>

          {/* Parent Information Section */}
          <FormSection>
            <SectionHeader>
              <SectionIcon>
                <FiUsers size={20} />
              </SectionIcon>
              <SectionTitle>Parent Information</SectionTitle>
            </SectionHeader>
            <SectionDescription>
              Student's parent/guardian details
            </SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="parentInfo.fatherName">
                  Father's Name <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="parentInfo.fatherName"
                  name="parentInfo.fatherName"
                  value={formData.parentInfo.fatherName}
                  onChange={handleInputChange}
                  placeholder="Father's Full Name"
                  $hasError={!!errors["parentInfo.fatherName"]}
                />
                {errors["parentInfo.fatherName"] && (
                  <ErrorMessage>{errors["parentInfo.fatherName"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="parentInfo.motherName">
                  Mother's Name <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="parentInfo.motherName"
                  name="parentInfo.motherName"
                  value={formData.parentInfo.motherName}
                  onChange={handleInputChange}
                  placeholder="Mother's Full Name"
                  $hasError={!!errors["parentInfo.motherName"]}
                />
                {errors["parentInfo.motherName"] && (
                  <ErrorMessage>{errors["parentInfo.motherName"]}</ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="parentInfo.fatherOccupation">
                  Father's Occupation <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="parentInfo.fatherOccupation"
                  name="parentInfo.fatherOccupation"
                  value={formData.parentInfo.fatherOccupation}
                  onChange={handleInputChange}
                  placeholder="Occupation"
                  $hasError={!!errors["parentInfo.fatherOccupation"]}
                />
                {errors["parentInfo.fatherOccupation"] && (
                  <ErrorMessage>
                    {errors["parentInfo.fatherOccupation"]}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="parentInfo.motherOccupation">
                  Mother's Occupation <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="parentInfo.motherOccupation"
                  name="parentInfo.motherOccupation"
                  value={formData.parentInfo.motherOccupation}
                  onChange={handleInputChange}
                  placeholder="Occupation"
                  $hasError={!!errors["parentInfo.motherOccupation"]}
                />
                {errors["parentInfo.motherOccupation"] && (
                  <ErrorMessage>
                    {errors["parentInfo.motherOccupation"]}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="parentInfo.parentPhone">
                  Parent's Phone <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="tel"
                  id="parentInfo.parentPhone"
                  name="parentInfo.parentPhone"
                  value={formData.parentInfo.parentPhone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  $hasError={!!errors["parentInfo.parentPhone"]}
                />
                {errors["parentInfo.parentPhone"] && (
                  <ErrorMessage>
                    {errors["parentInfo.parentPhone"]}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="parentInfo.parentEmail">Parent's Email</Label>
                <Input
                  type="email"
                  id="parentInfo.parentEmail"
                  name="parentInfo.parentEmail"
                  value={formData.parentInfo.parentEmail}
                  onChange={handleInputChange}
                  placeholder="parents@email.com"
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="parentInfo.annualIncome">
                  Annual Income <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  id="parentInfo.annualIncome"
                  name="parentInfo.annualIncome"
                  value={formData.parentInfo.annualIncome}
                  onChange={handleInputChange}
                >
                  <option value="0-3 LPA">0-3 LPA</option>
                  <option value="3-6 LPA">3-6 LPA</option>
                  <option value="6-10 LPA">6-10 LPA</option>
                  <option value="10-15 LPA">10-15 LPA</option>
                  <option value="15+ LPA">15+ LPA</option>
                </Select>
              </InputGroup>
            </InputGrid>
          </FormSection>

          <CheckboxGroup>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <CheckboxLabel htmlFor="isActive">
              Activate student account immediately
            </CheckboxLabel>
          </CheckboxGroup>

          <ButtonGroup>
            <SecondaryButton type="button" onClick={() => navigate(-1)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Registering Student...
                </>
              ) : (
                "Register Student"
              )}
            </PrimaryButton>
          </ButtonGroup>
        </Form>

        <FormFooter>
          <InfoText>
            Student will receive login credentials via email upon successful
            registration.
          </InfoText>
        </FormFooter>
      </FormCard>
    </FormContainer>
  );
};

export default StudentRegisterForm;
