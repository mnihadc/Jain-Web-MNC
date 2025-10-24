// src/models/admin.model.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  adminId: string;
  username: string;
  fullName: string;
  role: "admin";

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
    department: string;
    designation: string;
    work: string;
    qualification: string[];
    experience: number;
    joiningDate: Date;
    salary: number;
    isMainAdmin: boolean;
    permissions: string[];
    accessLevel: "full" | "limited";
    reportingTo?: string; // For staff admins reporting to main admin
  };

  systemAccess: {
    lastLogin?: Date;
    loginAttempts: number;
    accountLocked: boolean;
    lockedUntil?: Date;
    passwordChangedAt: Date;
  };

  isActive: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  isAccountLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const adminSchema = new Schema<IAdmin>(
  {
    adminId: {
      type: String,
      required: [true, "Admin ID is required"],
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
      enum: ["admin"],
      default: "admin",
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
        max: [70, "Age must be less than 70"],
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
      department: {
        type: String,
        required: [true, "Department is required"],
        enum: [
          "IT",
          "HR",
          "Academic",
          "Finance",
          "Administration",
          "Examination",
          "Admission",
          "Library",
          "Sports",
          "Maintenance",
        ],
        trim: true,
      },
      designation: {
        type: String,
        required: [true, "Designation is required"],
        enum: [
          "System Administrator",
          "HR Manager",
          "Finance Manager",
          "Academic Coordinator",
          "Admission Officer",
          "Examination Controller",
          "Librarian",
          "Support Staff",
        ],
        trim: true,
      },
      work: {
        type: String,
        required: [true, "Work description is required"],
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
        max: [45, "Experience cannot exceed 45 years"],
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
      isMainAdmin: {
        type: Boolean,
        default: false,
      },
      permissions: [
        {
          type: String,
          enum: [
            "user_management",
            "student_management",
            "teacher_management",
            "attendance_management",
            "marks_management",
            "fee_management",
            "reports_view",
            "reports_generate",
            "system_settings",
            "database_backup",
            "notice_management",
            "course_management",
          ],
        },
      ],
      accessLevel: {
        type: String,
        enum: ["full", "limited"],
        default: "limited",
      },
      reportingTo: {
        type: String,
        trim: true,
        // Only for staff admins, main admin has no reportingTo
      },
    },

    systemAccess: {
      lastLogin: {
        type: Date,
      },
      loginAttempts: {
        type: Number,
        default: 0,
        min: 0,
      },
      accountLocked: {
        type: Boolean,
        default: false,
      },
      lockedUntil: {
        type: Date,
      },
      passwordChangedAt: {
        type: Date,
        default: Date.now,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (pass: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
            pass
          );
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Update passwordChangedAt when password is modified
adminSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.systemAccess.passwordChangedAt = new Date();
  next();
});

// Auto-calculate age from date of birth
adminSchema.pre("save", function (next) {
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
adminSchema.pre("save", function (next) {
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

// Auto-set permissions and access level based on isMainAdmin
adminSchema.pre("save", function (next) {
  if (this.professional.isMainAdmin) {
    this.professional.accessLevel = "full";
    this.professional.permissions = [
      "user_management",
      "student_management",
      "teacher_management",
      "attendance_management",
      "marks_management",
      "fee_management",
      "reports_view",
      "reports_generate",
      "system_settings",
      "database_backup",
      "notice_management",
      "course_management",
    ];
    this.professional.reportingTo = undefined; // Main admin reports to no one
  }
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
adminSchema.methods.isAccountLocked = function (): boolean {
  if (!this.systemAccess.accountLocked) return false;
  if (
    this.systemAccess.lockedUntil &&
    this.systemAccess.lockedUntil > new Date()
  ) {
    return true;
  }
  // Auto-unlock if lock time has passed
  this.systemAccess.accountLocked = false;
  this.systemAccess.lockedUntil = undefined;
  return false;
};

// Increment login attempts and lock account if exceeds limit
adminSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  this.systemAccess.loginAttempts += 1;

  if (this.systemAccess.loginAttempts >= 5) {
    this.systemAccess.accountLocked = true;
    const lockTime = new Date();
    lockTime.setMinutes(lockTime.getMinutes() + 30); // Lock for 30 minutes
    this.systemAccess.lockedUntil = lockTime;
  }

  await this.save();
};

// Reset login attempts
adminSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.systemAccess.loginAttempts = 0;
  this.systemAccess.accountLocked = false;
  this.systemAccess.lockedUntil = undefined;
  await this.save();
};

// Virtual for display name
adminSchema.virtual("displayName").get(function () {
  const prefix = this.professional.isMainAdmin ? "Main " : "";
  return `${prefix}${this.professional.designation} ${this.fullName}`;
});

// Virtual for admin type
adminSchema.virtual("adminType").get(function () {
  return this.professional.isMainAdmin
    ? "Main Administrator"
    : "Staff Administrator";
});

// Indexes for performance
adminSchema.index({ "contact.email": 1 });
adminSchema.index({ adminId: 1 });
adminSchema.index({ "professional.employeeId": 1 });
adminSchema.index({ "professional.department": 1 });
adminSchema.index({ "professional.isMainAdmin": 1 });
adminSchema.index({ "professional.accessLevel": 1 });
adminSchema.index({ "systemAccess.accountLocked": 1 });
adminSchema.index({ "systemAccess.lockedUntil": 1 });

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
