const {tutors_communications, tutors, communications} = require('../models');

module.exports = {
    async getAllTutorsCommunications(req, res) {
        try {
            const tutorsCommunications = await tutors_communications.findAll({
                include: [
                    {
                        model: tutors,
                        as: 'tutors',
                        attributes: ['names', 'last_names', 'email'],
                    },
                    {
                        model: communications,
                        as: 'communications',
                        attributes: ['subject', 'body', 'priority', 'status'],
                    },
                ],
            });
            if (!tutorsCommunications) {
                return res.status(404).json({ message: 'No se encontraron comunicaciones de tutores' });
            }
            return res.status(200).json(tutorsCommunications);
        } catch (error) {
            console.error('Error al obtener las comunicaciones de los tutores:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async getTutorCommunicationById(req, res) {
        const {tutor_id, communication_id} = req.params;
        try {
            const tutorCommunication = await tutors_communications.findOne({
                where: {
                    communication_id,
                    tutor_id,
                },
                include: [
                    {
                        model: tutors,
                        as: 'tutors',
                        attributes: ['names', 'last_names', 'email'],
                    },
                    {
                        model: communications,
                        as: 'communications',
                        attributes: ['subject', 'body', 'priority', 'status'],
                    },
                ],
            });
            if (!tutorCommunication) {
                return res.status(404).json({ message: 'No se encontró la comunicación del tutor' });
            }
            return res.status(200).json(tutorCommunication);
        } catch (error) {
            console.error('Error al obtener la comunicación del tutor:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async createTutorCommunication(req, res) {
        const {tutor_id, communication_id} = req.body;
        try {
            const newTutorCommunication = await tutors_communications.create({
                tutor_id,
                communication_id,
            });
            return res.status(201).json(newTutorCommunication);
        } catch (error) {
            console.error('Error al crear la comunicación del tutor:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async updateTutorCommunication(req, res) {
        const { tutor_id, communication_id } = req.params;
        const { status } = req.body;

        try {
            const [updated] = await tutors_communications.update(
                { status },
                {
                    where: {
                        tutor_id,
                        communication_id,
                    },
                }
            );

            if (updated) {
                const updatedCommunication = await tutors_communications.findOne({
                    where: { tutor_id, communication_id },
                });
                return res.status(200).json(updatedCommunication);
            }
            throw new Error('Communication not found');
        } catch (error) {
            console.error('Error updating tutor communication:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async deleteTutorCommunication(req, res) {
        const { tutor_id, communication_id } = req.params;

        try {
            const deleted = await tutors_communications.destroy({
                where: {
                    tutor_id,
                    communication_id,
                },
            });

            if (deleted) {
                return res.status(204).send();
            }
            throw new Error('Communication not found');
        } catch (error) {
            console.error('Error deleting tutor communication:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
};
