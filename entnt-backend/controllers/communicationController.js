const Communication = require('../models/Communication');

const communicationController = {
    // Get all communications
    getAllCommunications: async (req, res) => {
        try {
            const comms = await Communication.find().sort('-date');
            res.status(200).json(comms);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch communications' });
        }
    }
};

module.exports = communicationController;