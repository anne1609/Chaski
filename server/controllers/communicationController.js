const {Communications, Categories, Secretaries, Teachers} = require('../models');

module.exports = {
    async getAllCommunications(req, res) {
        try {
            const communications = await Communications.findAll({
                include: [
                    {
                        model: Secretaries,
                        as: 'secretaries',
                        attributes: ['id', 'names', 'last_names'],
                    },
                    {
                        model: Teachers,
                        as: 'teachers',
                        attributes: ['id', 'names', 'last_names'],
                    },
                    {
                        model: Categories,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                    
                ],
            });
            if (communications.length === 0) {
                return res.status(404).json({ message: 'No communications found' });
            }
            res.status(200).json(communications);
        } catch (error) {
            console.error('Error fetching communications:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getCommunicationById(req, res) {
        const { id } = req.params;
        try {
            const communication = await Communications.findByPk(id, {
                include: [
                    {
                        model: Secretaries,
                        as: 'secretaries',
                        attributes: ['id', 'names', 'last_names'],
                    },
                    {
                        model: Teachers,
                        as: 'teachers',
                        attributes: ['id', 'names', 'last_names'],
                    },
                    {
                        model: Categories,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },                    
                ],
            });
            if (!communication) {
                return res.status(404).json({ message: 'Communication not found' });
            }
            res.status(200).json(communication);
        } catch (error) {
            console.error('Error fetching communication:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async createCommunication(req, res) {
        const { category_id, secretary_id, teacher_id, subject, body, status, priority,meeting_datetime,  attendance_status,attachment } = req.body;
        console.log("borrame: ln 68: ", req.body);
        try {
            const newCommunication = await Communications.create({
                category_id,
                secretary_id,
                teacher_id,
                subject,
                body,
                status,
                priority,
                meeting_datetime,
                attendance_status,
                attachment 
            });
            console.log("borrame: ln 82: ", newCommunication);
            res.status(201).json(newCommunication);
        } catch (error) {
            console.error('Error creating communication:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async updateCommunication(req, res) {
        const { id } = req.params;
        const { category_id, secretary_id, teacher_id, subject, body, status, priority, meeting_datetime,  attendance_status,attachment } = req.body;
        try {
            const communication = await Communications.findByPk(id);
            if (!communication) {
                return res.status(404).json({ message: 'Communication not found' });
            }
            await communication.update({
                category_id,
                secretary_id,
                teacher_id,
                subject,
                body,
                status,
                priority,
                meeting_datetime,
                attendance_status,
                attachment 
            });
            res.status(200).json(communication);
        } catch (error) {
            console.error('Error updating communication:', error);
            res.status(500).json({ error: 'Internal server error' });
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
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}