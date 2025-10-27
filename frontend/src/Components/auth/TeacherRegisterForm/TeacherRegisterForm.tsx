// src/components/teachers/TeacherRegisterForm/TeacherRegisterForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBook,
  FiAward,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiPlus,
  FiTrash2,
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
  TagsContainer,
  Tag,
  RemoveTagButton,
  ButtonGroup,
  SecondaryButton,
  PrimaryButton,
  ErrorMessage,
  SuccessMessage,
  FormFooter,
  InfoText,
} from "./TeacherRegisterForm.styles";

interface TeacherFormData {
  // Basic Information
  teacherId: string;
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

  // Professional Information
  professional: {
    employeeId: string;
    mainSubject: string;
    takenSubjects: string[];
    department: string;
    designation: string;
    qualification: string[];
    experience: number;
    joiningDate: string;
    salary: number;
    isClassTeacher: boolean;
    assignedClasses: string[];
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

const TeacherRegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TeacherFormData>({
    teacherId: "",
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
    professional: {
      employeeId: "",
      mainSubject: "",
      takenSubjects: [],
      department: "Computer Science",
      designation: "Assistant Professor",
      qualification: [],
      experience: 0,
      joiningDate: "",
      salary: 0,
      isClassTeacher: false,
      assignedClasses: [],
    },
    isActive: true,
  });

  const [currentSubject, setCurrentSubject] = useState("");
  const [currentQualification, setCurrentQualification] = useState("");
  const [currentClass, setCurrentClass] = useState("");
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
          ...prev[parent as keyof TeacherFormData],
          [child]: type === "number" ? parseFloat(value) || 0 : value,
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

  const calculateExperience = (joiningDate: string): number => {
    const today = new Date();
    const joinDate = new Date(joiningDate);
    let experience = today.getFullYear() - joinDate.getFullYear();
    const monthDiff = today.getMonth() - joinDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < joinDate.getDate())
    ) {
      experience--;
    }

    return Math.max(0, experience);
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

  const handleJoiningDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const joiningDate = e.target.value;
    const experience = calculateExperience(joiningDate);

    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        joiningDate,
        experience,
      },
    }));
  };

  const addSubject = () => {
    if (
      currentSubject.trim() &&
      !formData.professional.takenSubjects.includes(currentSubject.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        professional: {
          ...prev.professional,
          takenSubjects: [
            ...prev.professional.takenSubjects,
            currentSubject.trim(),
          ],
        },
      }));
      setCurrentSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        takenSubjects: prev.professional.takenSubjects.filter(
          (s) => s !== subject
        ),
      },
    }));
  };

  const addQualification = () => {
    if (
      currentQualification.trim() &&
      !formData.professional.qualification.includes(currentQualification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        professional: {
          ...prev.professional,
          qualification: [
            ...prev.professional.qualification,
            currentQualification.trim(),
          ],
        },
      }));
      setCurrentQualification("");
    }
  };

  const removeQualification = (qual: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        qualification: prev.professional.qualification.filter(
          (q) => q !== qual
        ),
      },
    }));
  };

  const addClass = () => {
    if (
      currentClass.trim() &&
      !formData.professional.assignedClasses.includes(
        currentClass.trim().toUpperCase()
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        professional: {
          ...prev.professional,
          assignedClasses: [
            ...prev.professional.assignedClasses,
            currentClass.trim().toUpperCase(),
          ],
        },
      }));
      setCurrentClass("");
    }
  };

  const removeClass = (className: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        assignedClasses: prev.professional.assignedClasses.filter(
          (c) => c !== className
        ),
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic Information Validation
    if (!formData.teacherId.trim())
      newErrors.teacherId = "Teacher ID is required";
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
    if (formData.personalInfo.age < 25)
      newErrors["personalInfo.dateOfBirth"] =
        "Teacher must be at least 25 years old";
    if (formData.personalInfo.age > 65)
      newErrors["personalInfo.dateOfBirth"] =
        "Teacher must be less than 65 years old";

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

    // Professional Information Validation
    if (!formData.professional.employeeId.trim())
      newErrors["professional.employeeId"] = "Employee ID is required";
    if (!formData.professional.mainSubject.trim())
      newErrors["professional.mainSubject"] = "Main subject is required";
    if (!formData.professional.joiningDate)
      newErrors["professional.joiningDate"] = "Joining date is required";
    if (formData.professional.salary <= 0)
      newErrors["professional.salary"] = "Salary must be greater than 0";
    if (formData.professional.qualification.length === 0)
      newErrors["professional.qualification"] =
        "At least one qualification is required";

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
        role: "teacher",
      };

      const response = await axios.post(
        "http://localhost:5000/api/teachers/register",
        submitData
      );

      setSuccess("Teacher registered successfully!");
      console.log("Registration successful:", response.data);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          teacherId: "",
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
          professional: {
            employeeId: "",
            mainSubject: "",
            takenSubjects: [],
            department: "Computer Science",
            designation: "Assistant Professor",
            qualification: [],
            experience: 0,
            joiningDate: "",
            salary: 0,
            isClassTeacher: false,
            assignedClasses: [],
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

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <FormContainer>
      <FormCard>
        <FormHeader>
          <FormTitle>Register New Teacher</FormTitle>
          <FormSubtitle>
            Fill in the teacher details to create a new faculty account
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
              Core account details for teacher access
            </SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="teacherId">
                  Teacher ID <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="teacherId"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  placeholder="TCH20240001"
                  $hasError={!!errors.teacherId}
                />
                {errors.teacherId && (
                  <ErrorMessage>{errors.teacherId}</ErrorMessage>
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
                    placeholder="Dr. John Doe"
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
              Teacher's personal details and identification
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
              Teacher's contact details and emergency information
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
                  placeholder="teacher@jain.edu"
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
              Teacher's permanent residential address
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

          {/* Professional Information Section */}
          <FormSection>
            <SectionHeader>
              <SectionIcon>
                <FiBriefcase size={20} />
              </SectionIcon>
              <SectionTitle>Professional Information</SectionTitle>
            </SectionHeader>
            <SectionDescription>
              Teacher's professional and employment details
            </SectionDescription>

            <InputGrid>
              <InputGroup>
                <Label htmlFor="professional.employeeId">
                  Employee ID <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="professional.employeeId"
                  name="professional.employeeId"
                  value={formData.professional.employeeId}
                  onChange={handleInputChange}
                  placeholder="EMP20240001"
                  $hasError={!!errors["professional.employeeId"]}
                />
                {errors["professional.employeeId"] && (
                  <ErrorMessage>
                    {errors["professional.employeeId"]}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="professional.department">
                  Department <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  id="professional.department"
                  name="professional.department"
                  value={formData.professional.department}
                  onChange={handleInputChange}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Management">Management</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Humanities">Humanities</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="professional.designation">
                  Designation <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  id="professional.designation"
                  name="professional.designation"
                  value={formData.professional.designation}
                  onChange={handleInputChange}
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">
                    Associate Professor
                  </option>
                  <option value="Assistant Professor">
                    Assistant Professor
                  </option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Visiting Faculty">Visiting Faculty</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="professional.mainSubject">
                  Main Subject <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  id="professional.mainSubject"
                  name="professional.mainSubject"
                  value={formData.professional.mainSubject}
                  onChange={handleInputChange}
                  placeholder="Computer Science"
                  $hasError={!!errors["professional.mainSubject"]}
                />
                {errors["professional.mainSubject"] && (
                  <ErrorMessage>
                    {errors["professional.mainSubject"]}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="professional.joiningDate">
                  Joining Date <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="date"
                  id="professional.joiningDate"
                  name="professional.joiningDate"
                  value={formData.professional.joiningDate}
                  onChange={handleJoiningDateChange}
                  $hasError={!!errors["professional.joiningDate"]}
                />
                {errors["professional.joiningDate"] && (
                  <ErrorMessage>
                    {errors["professional.joiningDate"]}
                  </ErrorMessage>
                )}
                {formData.professional.experience > 0 && (
                  <InfoText>
                    Experience: {formData.professional.experience} years
                  </InfoText>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="professional.salary">
                  Salary (₹) <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="number"
                  id="professional.salary"
                  name="professional.salary"
                  value={formData.professional.salary}
                  onChange={handleInputChange}
                  placeholder="50000"
                  $hasError={!!errors["professional.salary"]}
                  min="0"
                />
                {errors["professional.salary"] && (
                  <ErrorMessage>{errors["professional.salary"]}</ErrorMessage>
                )}
              </InputGroup>
            </InputGrid>

            {/* Taken Subjects */}
            <InputGroup>
              <Label>Taken Subjects</Label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Input
                  type="text"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addSubject)}
                  placeholder="Add subject (e.g., Data Structures)"
                />
                <button
                  type="button"
                  onClick={addSubject}
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
                  <FiPlus size={16} />
                </button>
              </div>
              <TagsContainer>
                {formData.professional.takenSubjects.map((subject, index) => (
                  <Tag key={index}>
                    <FiBook size={12} />
                    {subject}
                    <RemoveTagButton onClick={() => removeSubject(subject)}>
                      <FiTrash2 size={12} />
                    </RemoveTagButton>
                  </Tag>
                ))}
              </TagsContainer>
            </InputGroup>

            {/* Qualifications */}
            <InputGroup>
              <Label>
                Qualifications <RequiredStar>*</RequiredStar>
              </Label>
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
                  onKeyPress={(e) => handleKeyPress(e, addQualification)}
                  placeholder="Add qualification (e.g., M.Tech)"
                  $hasError={!!errors["professional.qualification"]}
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
                  <FiPlus size={16} />
                </button>
              </div>
              {errors["professional.qualification"] && (
                <ErrorMessage>
                  {errors["professional.qualification"]}
                </ErrorMessage>
              )}
              <TagsContainer>
                {formData.professional.qualification.map((qual, index) => (
                  <Tag key={index}>
                    <FiAward size={12} />
                    {qual}
                    <RemoveTagButton onClick={() => removeQualification(qual)}>
                      <FiTrash2 size={12} />
                    </RemoveTagButton>
                  </Tag>
                ))}
              </TagsContainer>
            </InputGroup>

            {/* Assigned Classes */}
            <InputGroup>
              <Label>Assigned Classes</Label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Input
                  type="text"
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addClass)}
                  placeholder="Add class (e.g., 10A)"
                />
                <button
                  type="button"
                  onClick={addClass}
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
                  <FiPlus size={16} />
                </button>
              </div>
              <TagsContainer>
                {formData.professional.assignedClasses.map(
                  (className, index) => (
                    <Tag key={index}>
                      <FiBook size={12} />
                      {className}
                      <RemoveTagButton onClick={() => removeClass(className)}>
                        <FiTrash2 size={12} />
                      </RemoveTagButton>
                    </Tag>
                  )
                )}
              </TagsContainer>
            </InputGroup>

            <CheckboxGroup>
              <input
                type="checkbox"
                id="professional.isClassTeacher"
                name="professional.isClassTeacher"
                checked={formData.professional.isClassTeacher}
                onChange={handleInputChange}
              />
              <CheckboxLabel htmlFor="professional.isClassTeacher">
                Assign as Class Teacher
              </CheckboxLabel>
            </CheckboxGroup>
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
              Activate teacher account immediately
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
                  Registering Teacher...
                </>
              ) : (
                "Register Teacher"
              )}
            </PrimaryButton>
          </ButtonGroup>
        </Form>

        <FormFooter>
          <InfoText>
            Teacher will receive login credentials via email upon successful
            registration.
          </InfoText>
        </FormFooter>
      </FormCard>
    </FormContainer>
  );
};

export default TeacherRegisterForm;
