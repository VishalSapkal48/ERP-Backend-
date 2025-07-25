const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  manager: { type: String, trim: true, default: "" },
  workLocation: { type: String, trim: true, default: "" },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  workPhone: { type: String, required: true, trim: true },
  homePhone: { type: String, required: true, trim: true },
  emergencyPhone: { type: String, required: true, trim: true },
  gender: { type: String, enum: ["Male", "Female", "Other", ""], trim: true, default: "" },
  dob: { type: Date, default: null },
  address: { type: String, trim: true, default: "" },
  city: { type: String, trim: true, default: "" },
  country: { type: String, trim: true, default: "" },
  hireDate: { type: Date, default: null },
  joiningDate: { type: Date, default: null },
  netSalary: { type: Number, required: true },
  hra: { type: Number, required: true, default: 0 }, // New field
  specialBonus: { type: Number, required: true, default: 0 }, // New field
  conveyance: { type: Number, required: true, default: 0 }, // New field
  travelAllowances: { type: Number, required: true, default: 0 }, // New field
  shiftAllowances: { type: Number, required: true, default: 0 }, // New field
  overtime: { type: Number, required: true, default: 0 }, // New field
  taxRate: { type: Number, required: true, default: 0 }, // New field
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Bank Transfer", "NFT", "RTGS", "Cash"],
    trim: true,
  },
  employeeType: {
    type: String,
    required: true,
    enum: ["Permanent", "Contract"],
    trim: true,
  },
  bankName: { type: String, trim: true, default: "" },
  accountTitle: { type: String, trim: true, default: "" },
  accountNo: { type: String, trim: true, default: "" },
  IFSCCode: { type: String, trim: true, default: "" },
  location: { type: String, trim: true, default: "" },
  designation: { type: String, trim: true, default: "" },
  CNIC: { type: String, trim: true, default: "" },




  
  pfAccountNumber: { type: String, trim: true, default: "" },
  pfType: { type: String, enum: ["PF", ""], trim: true, default: "" },
  employerContributionPf: { type: Number, default: null },
  employeeContributionPf: { type: Number, default: null },
  ssesType: { type: String, enum: ["SSES", ""], trim: true, default: "" },
  employerContributionSses: { type: Number, default: null },
  employeeContributionSses: { type: Number, default: null },
  eobiType: { type: String, enum: ["EOBI", ""], trim: true, default: "" },
  employerContributionEobi: { type: Number, default: null },
  employeeContributionEobi: { type: Number, default: null },
  esicType: { type: String, enum: ["ESIC", ""], trim: true, default: "" },
  employerContributionEsic: { type: Number, default: null },
  employeeContributionEsic: { type: Number, default: null },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
    trim: true,
  },
  separationDate: { type: Date, default: null },
  username: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, trim: true, default: "" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);