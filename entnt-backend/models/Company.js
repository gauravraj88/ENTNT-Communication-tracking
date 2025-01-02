const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: String,
  location: String,
  linkedIn: {
    type: String,
    required: [true, "4982898927389758278958238required"],
  },
  emails: [String],
  phoneNumbers: [String],
  comments: String,
  periodicity: { type: String, default: "2 weeks" },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
