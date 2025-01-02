// // const express = require('express');
// // const router = express.Router();
// // const Communication = require('../models/Communication');
// // const Company = require('../models/Company');
// // const PDFDocument = require('pdfkit');
// // const json2csv = require('json2csv').parse;

// // // Get communication statistics
// // router.get('/communication-stats', async (req, res) => {
// //     try {
// //         // Get communication methods distribution
// //         const methodStats = await Communication.aggregate([
// //             {
// //                 $group: {
// //                     _id: "$type.name",
// //                     value: { $sum: 1 }
// //                 }
// //             },
// //             {
// //                 $project: {
// //                     name: "$_id",
// //                     value: 1,
// //                     _id: 0
// //                 }
// //             }
// //         ]);

// //         // Get communication frequency trends
// //         const communicationData = await Communication.aggregate([
// //             {
// //                 $group: {
// //                     _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
// //                     count: { $sum: 1 }
// //                 }
// //             },
// //             {
// //                 $project: {
// //                     date: "$_id",
// //                     count: 1,
// //                     _id: 0
// //                 }
// //             },
// //             { $sort: { date: 1 } }
// //         ]);

// //         // Get overdue communications by company
// //         const overdueData = await Company.aggregate([
// //             {
// //                 $lookup: {
// //                     from: "communications",
// //                     localField: "_id",
// //                     foreignField: "company",
// //                     as: "communications"
// //                 }
// //             },
// //             {
// //                 $project: {
// //                     company: "$name",
// //                     overdueCount: {
// //                         $size: {
// //                             $filter: {
// //                                 input: "$communications",
// //                                 as: "comm",
// //                                 cond: {
// //                                     $lt: ["$$comm.date", new Date()]
// //                                 }
// //                             }
// //                         }
// //                     }
// //                 }
// //             }
// //         ]);

// //         res.json({
// //             methodStats,
// //             communicationData,
// //             overdueData
// //         });
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // // Download report endpoint
// // router.get('/download-report', async (req, res) => {
// //     try {
// //         const { format } = req.query;
// //         const data = await Communication.find()
// //             .populate('company')
// //             .populate('type')
// //             .lean();

// //         if (format === 'pdf') {
// //             const doc = new PDFDocument();
// //             res.setHeader('Content-Type', 'application/pdf');
// //             res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
// //             doc.pipe(res);

// //             // Add content to PDF
// //             doc.fontSize(16).text('Communication Report', { align: 'center' });
// //             data.forEach(comm => {
// //                 doc.fontSize(12).text(`
// //           Company: ${comm.company.name}
// //           Type: ${comm.type.name}
// //           Date: ${new Date(comm.date).toLocaleDateString()}
// //           Notes: ${comm.notes}
// //         `);
// //                 doc.moveDown();
// //             });

// //             doc.end();
// //         } else if (format === 'csv') {
// //             const fields = ['company.name', 'type.name', 'date', 'notes'];
// //             const csv = json2csv(data, { fields });
// //             res.setHeader('Content-Type', 'text/csv');
// //             res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
// //             res.send(csv);
// //         }
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // module.exports = router;

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Base route: /api/analytics

// Get communication statistics
router.get('/communication-stats', analyticsController.getCommunicationStats);

// Download reports
router.get('/download-report', analyticsController.downloadReport);

// Get company-specific analytics
router.get('/company/:companyId/stats', analyticsController.getCommunicationStats);

module.exports = router;