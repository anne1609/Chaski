const {Communications, Categories, Users} = require('../models');

module.exports = {
    async getCommunications(req, res) {
        try {
            const communicationsList = await Communications.findAll({
                include: [
                    { model: Categories, as: 'category' },
                    { model: Users, as: 'user' }
                ]
            });
            res.status(200).json(communicationsList);
        } catch (error) {
            console.error('Error fetching communications:', error);
            res.status(500).json({ message: 'Error fetching communications' });
        }
    },
    async getCommunicationById(req, res) {
        const { id } = req.params;
        try {
            const communication = await Communications.findByPk(id, {
                include: [
                    { model: Categories, as: 'category' },
                    { model: Users, as: 'user' }
                ]
            });
            if (!communication) {
                return res.status(404).json({ message: 'Communication not found' });
            }
            res.status(200).json(communication);
        } catch (error) {
            console.error('Error fetching communication:', error);
            res.status(500).json({ message: 'Error fetching communication' });
        }
    },
    async createCommunication(req, res) {
        const { category_id, user_id, subject, body, status, priority } = req.body;
        try {
            const newCommunication = await Communications.create({
                category_id,
                user_id,
                subject,
                body,
                status,
                priority
            });
            res.status(201).json(newCommunication);
        } catch (error) {
            console.error('Error creating communication:', error);
            res.status(500).json({ message: 'Error creating communication' });
        }
    },
    async updateCommunication(req, res) {
        const { id } = req.params;
        const { category_id, user_id, subject, body, status, priority } = req.body;
        try {
            const communication = await Communications.findByPk(id);
            if (!communication) {
                return res.status(404).json({ message: 'Communication not found' });
            }
            await communication.update({
                category_id,
                user_id,
                subject,
                body,
                status,
                priority
            });
            res.status(200).json(communication);
        } catch (error) {
            console.error('Error updating communication:', error);
            res.status(500).json({ message: 'Error updating communication' });
        }
    },
    async deleteCommunication(req, res) {
        const { id } = req.params;
        try {
            const communication = await Communications.findByPk(id);
            if (!communication) {
                return res.status(404).json({ message: 'Communication not found' });
            }
            await communication.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting communication:', error);
            res.status(500).json({ message: 'Error deleting communication' });
        }
    }
}