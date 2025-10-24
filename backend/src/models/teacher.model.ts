// src/models/teacher.model.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface ITeacher extends Document {
  teacherId: string;
  username: string;
  fullName: string;
  role: "teacher";

  personalInfo: {
    dateOfBirth: Date;
    age: number;
    gender: "male" | "female" | "other";
    bloodGroup?: string;
    nationality: string;
    profileImage: string;
  };

  contact: {
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyName: string;
  };

  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  professional: {
    employeeId: string;
    mainSubject: string;
    takenSubjects: string[];
    department: string;
    designation: string;
    qualification: string[];
    experience: number;
    joiningDate: Date;
    salary: number;
    isClassTeacher: boolean;
    assignedClasses: string[];
  };

  isActive: boolean;
  password: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const teacherSchema = new Schema<ITeacher>(
  {
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    role: {
      type: String,
      enum: ["teacher"],
      default: "teacher",
    },

    personalInfo: {
      dateOfBirth: {
        type: Date,
        required: [true, "Date of birth is required"],
      },
      age: {
        type: Number,
        required: [true, "Age is required"],
        min: [25, "Age must be at least 25"],
        max: [65, "Age must be less than 65"],
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: [true, "Gender is required"],
      },
      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        uppercase: true,
      },
      nationality: {
        type: String,
        default: "Indian",
        trim: true,
      },
      profileImage: {
        type: String,
        default: "",
        trim: true,
      },
    },

    contact: {
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
      },
      emergencyContact: {
        type: String,
        required: [true, "Emergency contact is required"],
        trim: true,
      },
      emergencyName: {
        type: String,
        required: [true, "Emergency contact name is required"],
        trim: true,
      },
    },

    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
        trim: true,
        match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
      },
      country: {
        type: String,
        default: "India",
        trim: true,
      },
    },

    professional: {
      employeeId: {
        type: String,
        required: [true, "Employee ID is required"],
        unique: true,
        trim: true,
        uppercase: true,
      },
      mainSubject: {
        type: String,
        required: [true, "Main subject is required"],
        trim: true,
      },
      takenSubjects: [
        {
          type: String,
          trim: true,
        },
      ],
      department: {
        type: String,
        required: [true, "Department is required"],
        enum: [
          "Computer Science",
          "Electronics",
          "Mechanical",
          "Civil",
          "Mathematics",
          "Physics",
          "Chemistry",
          "Management",
          "Commerce",
          "Humanities",
        ],
        trim: true,
      },
      designation: {
        type: String,
        required: [true, "Designation is required"],
        enum: [
          "Professor",
          "Associate Professor",
          "Assistant Professor",
          "Lecturer",
          "Visiting Faculty",
        ],
        trim: true,
      },
      qualification: [
        {
          type: String,
          required: [true, "At least one qualification is required"],
          trim: true,
        },
      ],
      experience: {
        type: Number,
        required: [true, "Experience is required"],
        min: [0, "Experience cannot be negative"],
        max: [40, "Experience cannot exceed 40 years"],
      },
      joiningDate: {
        type: Date,
        required: [true, "Joining date is required"],
      },
      salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary cannot be negative"],
      },
      isClassTeacher: {
        type: Boolean,
        default: false,
      },
      assignedClasses: [
        {
          type: String,
          trim: true,
          uppercase: true,
        },
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Auto-calculate age from date of birth
teacherSchema.pre("save", function (next) {
  if (this.personalInfo.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.personalInfo.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    this.personalInfo.age = age;
  }
  next();
});

// Auto-calculate experience from joining date
teacherSchema.pre("save", function (next) {
  if (this.professional.joiningDate) {
    const today = new Date();
    const joiningDate = new Date(this.professional.joiningDate);
    let experience = today.getFullYear() - joiningDate.getFullYear();
    const monthDiff = today.getMonth() - joiningDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < joiningDate.getDate())
    ) {
      experience--;
    }

    this.professional.experience = Math.max(0, experience);
  }
  next();
});

// Compare password method
teacherSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for display name
teacherSchema.virtual("displayName").get(function () {
  return `${this.professional.designation} ${this.fullName}`;
});

// Indexes for performance
teacherSchema.index({ "contact.email": 1 });
teacherSchema.index({ teacherId: 1 });
teacherSchema.index({ "professional.employeeId": 1 });
teacherSchema.index({ "professional.department": 1 });
teacherSchema.index({ "professional.designation": 1 });
teacherSchema.index({ "professional.isClassTeacher": 1 });
teacherSchema.index({ "professional.takenSubjects": 1 });

export const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
