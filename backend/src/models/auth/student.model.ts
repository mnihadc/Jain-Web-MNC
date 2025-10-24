// src/models/student.model.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IStudent extends Document {
  admissionId: string;
  username: string;
  fullName: string;
  role: "student";

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

  academic: {
    course: string;
    specialization: string;
    academicYear: string;
    semester: number;
    section: string;
    rollNumber: string;
    batch: string;
    cgpa: number;
    attendance: number;
  };

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
  password: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const studentSchema = new Schema<IStudent>(
  {
    admissionId: {
      type: String,
      required: [true, "Admission ID is required"],
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
      enum: ["student"],
      default: "student",
    },

    personalInfo: {
      dateOfBirth: {
        type: Date,
        required: [true, "Date of birth is required"],
      },
      age: {
        type: Number,
        required: [true, "Age is required"],
        min: [15, "Age must be at least 15"],
        max: [30, "Age must be less than 30"],
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

    academic: {
      course: {
        type: String,
        required: [true, "Course is required"],
        enum: [
          "B.Tech",
          "MBA",
          "BBA",
          "B.Com",
          "B.Sc",
          "Bca",
          "M.Tech",
          "PhD",
          "MCA",
        ],
        trim: true,
      },
      specialization: {
        type: String,
        required: [true, "Specialization is required"],
        trim: true,
      },
      academicYear: {
        type: String,
        required: [true, "Academic year is required"],
        match: [/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"],
      },
      semester: {
        type: Number,
        required: [true, "Semester is required"],
        min: [1, "Semester must be at least 1"],
        max: [12, "Semester cannot exceed 12"],
      },
      section: {
        type: String,
        required: [true, "Section is required"],
        uppercase: true,
        maxlength: 1,
      },
      rollNumber: {
        type: String,
        required: [true, "Roll number is required"],
        unique: true,
        trim: true,
        uppercase: true,
      },
      batch: {
        type: String,
        trim: true,
      },
      cgpa: {
        type: Number,
        default: 0,
        min: [0, "CGPA cannot be negative"],
        max: [10, "CGPA cannot exceed 10"],
      },
      attendance: {
        type: Number,
        default: 0,
        min: [0, "Attendance cannot be negative"],
        max: [100, "Attendance cannot exceed 100%"],
      },
    },

    parentInfo: {
      fatherName: {
        type: String,
        required: [true, "Father name is required"],
        trim: true,
      },
      motherName: {
        type: String,
        required: [true, "Mother name is required"],
        trim: true,
      },
      fatherOccupation: {
        type: String,
        required: [true, "Father occupation is required"],
        trim: true,
      },
      motherOccupation: {
        type: String,
        required: [true, "Mother occupation is required"],
        trim: true,
      },
      parentPhone: {
        type: String,
        required: [true, "Parent phone is required"],
        trim: true,
      },
      parentEmail: {
        type: String,
        lowercase: true,
        trim: true,
      },
      annualIncome: {
        type: String,
        required: [true, "Annual income is required"],
        enum: ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10-15 LPA", "15+ LPA"],
      },
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
studentSchema.pre("save", async function (next) {
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
studentSchema.pre("save", function (next) {
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

// Compare password method
studentSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes for performance
studentSchema.index({ email: 1 });
studentSchema.index({ admissionId: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ "academic.course": 1, "academic.semester": 1 });
studentSchema.index({ "academic.academicYear": 1, "academic.section": 1 });

export const Student = mongoose.model<IStudent>("Student", studentSchema);
