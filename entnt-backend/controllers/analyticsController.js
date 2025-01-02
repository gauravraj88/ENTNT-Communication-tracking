const Communication = require('../models/Communication');
const Company = require('../models/Company');
const CommunicationMethod = require('../models/CommunicationMethod');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const json2csv = require('json2csv').parse;

const getTimeframeFilter = (timeframe) => {
    const now = new Date();
    switch (timeframe) {
        case 'week':
            return new Date(now.setDate(now.getDate() - 7));
        case 'month':
            return new Date(now.setMonth(now.getMonth() - 1));
        case 'quarter':
            return new Date(now.setMonth(now.getMonth() - 3));
        case 'year':
            return new Date(now.setFullYear(now.getFullYear() - 1));
        default:
            return new Date(now.setMonth(now.getMonth() - 1));
    }
};

exports.getCommunicationStats = async (req, res) => {
    try {
        const { timeframe, companyId } = req.query;
        const startDate = getTimeframeFilter(timeframe);

        // Base match condition
        const baseMatch = {
            date: { $gte: startDate }
        };

        // Add company filter if provided
        if (companyId) {
            baseMatch.company = new mongoose.Types.ObjectId(companyId);
        }

        // 1. Communication Methods Distribution
        const methodStats = await Communication.aggregate([
            {
                $match: baseMatch
            },
            {
                $lookup: {
                    from: 'communicationmethods',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'typeInfo'
                }
            },
            {
                $unwind: '$typeInfo'
            },
            {
                $group: {
                    _id: '$typeInfo.name',
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: '$_id',
                    value: 1,
                    _id: 0
                }
            },
            {
                $sort: { value: -1 }
            }
        ]);

        // 2. Communication Frequency Trends
        const communicationData = await Communication.aggregate([
            {
                $match: baseMatch
            },
            {
                $group: {
                    _id: {
                        $dateToString: { 
                            format: '%Y-%m-%d', 
                            date: '$date'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    date: '$_id',
                    count: 1,
                    _id: 0
                }
            },
            { 
                $sort: { date: 1 } 
            }
        ]);

        // 3. Company Communication Summary
        const companyStats = await Company.aggregate([
            {
                $lookup: {
                    from: 'communications',
                    localField: '_id',
                    foreignField: 'company',
                    as: 'communications'
                }
            },
            {
                $project: {
                    name: 1,
                    totalCommunications: { $size: '$communications' },
                    lastCommunication: { 
                        $max: '$communications.date'
                    },
                    periodicityDays: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$periodicity', '1 week'] }, then: 7 },
                                { case: { $eq: ['$periodicity', '2 weeks'] }, then: 14 },
                                { case: { $eq: ['$periodicity', '1 month'] }, then: 30 },
                                { case: { $eq: ['$periodicity', '2 months'] }, then: 60 }
                            ],
                            default: 14
                        }
                    }
                }
            },
            {
                $addFields: {
                    daysOverdue: {
                        $ceil: {
                            $divide: [
                                { $subtract: [new Date(), { $ifNull: ['$lastCommunication', new Date()] }] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                }
            }
        ]);

        // 4. Overdue Communications
        const overdueData = companyStats
            .filter(company => company.daysOverdue > company.periodicityDays)
            .map(company => ({
                company: company.name,
                overdueCount: 1,
                daysOverdue: Math.max(company.daysOverdue - company.periodicityDays, 0)
            }))
            .sort((a, b) => b.daysOverdue - a.daysOverdue);

        // 5. Method Performance Analysis
        const methodPerformance = await Communication.aggregate([
            {
                $match: baseMatch
            },
            {
                $lookup: {
                    from: 'communicationmethods',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'methodInfo'
                }
            },
            {
                $unwind: '$methodInfo'
            },
            {
                $group: {
                    _id: '$methodInfo.name',
                    totalUsed: { $sum: 1 },
                    avgNotesLength: { 
                        $avg: { $strLenCP: { $ifNull: ['$notes', ''] } }
                    },
                    withNotes: {
                        $sum: { 
                            $cond: [
                                { $and: [
                                    { $ne: ['$notes', null] },
                                    { $ne: ['$notes', ''] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    method: '$_id',
                    totalUsed: 1,
                    avgNotesLength: { $round: ['$avgNotesLength', 1] },
                    notesPercentage: {
                        $round: [
                            { $multiply: [
                                { $divide: ['$withNotes', '$totalUsed'] },
                                100
                            ]},
                            1
                        ]
                    },
                    _id: 0
                }
            },
            {
                $sort: { totalUsed: -1 }
            }
        ]);

        // 6. Calculate Engagement Metrics
        const engagementMetrics = {
            totalCompanies: companyStats.length,
            activeCompanies: companyStats.filter(c => c.totalCommunications > 0).length,
            overdueCompanies: overdueData.length,
            averageCommunicationsPerCompany: Math.round(
                companyStats.reduce((acc, curr) => acc + curr.totalCommunications, 0) / 
                Math.max(companyStats.length, 1)
            )
        };

        res.json({
            methodStats,
            communicationData,
            overdueData,
            companyStats,
            methodPerformance,
            engagementMetrics
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch analytics data',
            details: error.message 
        });
    }
};

exports.downloadReport = async (req, res) => {
    try {
        const { format, timeframe } = req.query;
        const startDate = getTimeframeFilter(timeframe);

        const data = await Communication.find({ date: { $gte: startDate } })
            .populate('company', 'name')
            .populate('type', 'name')
            .sort('-date')
            .lean();

        if (format === 'pdf') {
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=communication-report.pdf');
            
            doc.pipe(res);

            // Add header
            doc.fontSize(20).text('Communication Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.fontSize(12).text(`Time Period: ${timeframe || 'Last Month'}`, { align: 'right' });
            doc.moveDown();

            // Add content
            data.forEach((comm, index) => {
                doc.fontSize(14).text(`Communication #${index + 1}`, { underline: true });
                doc.fontSize(12)
                   .text(`Company: ${comm.company?.name || 'N/A'}`)
                   .text(`Type: ${comm.type?.name || 'N/A'}`)
                   .text(`Date: ${new Date(comm.date).toLocaleDateString()}`)
                   .text(`Notes: ${comm.notes || 'N/A'}`);
                doc.moveDown();
            });

            doc.end();
        } else if (format === 'csv') {
            const csvData = data.map(comm => ({
                'Company': comm.company?.name || 'N/A',
                'Communication Type': comm.type?.name || 'N/A',
                'Date': new Date(comm.date).toLocaleDateString(),
                'Notes': comm.notes || 'N/A'
            }));

            const csv = json2csv(csvData);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=communication-report.csv');
            res.send(csv);
        } else {
            res.status(400).json({ error: 'Invalid format specified' });
        }
    } catch (error) {
        console.error('Download Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate report',
            details: error.message 
        });
    }
};