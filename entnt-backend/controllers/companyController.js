const Company = require('../models/Company');

const companyController = {
  // Get all companies
  getAllCompanies: async (req, res) => {
    try {
      const companies = await Company.find();
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  },

  // Add new company
  addCompany: async (req, res) => {
    const { name, location, linkedIn, emails, phoneNumbers, comments, periodicity } = req.body;
    try {
      const newCompany = new Company({ 
        name, 
        location, 
        linkedIn, 
        emails, 
        phoneNumbers, 
        comments, 
        periodicity 
      });
      await newCompany.save();
      res.status(201).json({ message: "Company added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add company" });
    }
  },

  // Edit company
  updateCompany: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedCompany = await Company.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedCompany);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company" });
    }
  },

  // Delete company
  deleteCompany: async (req, res) => {
    const { id } = req.params;
    try {
      await Company.findByIdAndDelete(id);
      res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete company" });
    }
  }
};

module.exports = companyController;