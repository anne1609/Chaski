const {Tutors_Communications, Tutors, Communications} = require('../models');

module.exports = {
    async getAllTutorsCommunications(req, res) {
        try {
            const tutorsCommunications = await Tutors_Communications.findAll({
                include: [
                    {
                        model: Tutors,
                        as: 'tutors',
                        attributes: ['names', 'last_names', 'email'],
                    },
                    {
                        model: Communications,
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
            const tutorCommunication = await Tutors_Communications.findOne({
                where: {
                    communication_id,
                    tutor_id,
                },
                include: [
                    {
                        model: Tutors,
                        as: 'tutors',
                        attributes: ['names', 'last_names', 'email'],
                    },
                    {
                        model: Communications,
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
        const {tutor_id, communication_id,meeting_datetime} = req.body;
        try {
            const newTutorCommunication = await Tutors_Communications.create({
                tutor_id,
                communication_id,
                meeting_datetime
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
            const [updated] = await Tutors_Communications.update(
                { status },
                {
                    where: {
                        tutor_id,
                        communication_id,
                    },
                }
            );

            if (updated) {
                const updatedCommunication = await Tutors_Communications.findOne({
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
            const deleted = await Tutors_Communications.destroy({
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
    async confirmAttendance(req, res) {
        const { communication_id,confirmed } = req.query;
        try {
            const attendance = await Tutors_Communications.findOne({
                where: {
                    communication_id,
                },
            });

            if (!attendance) {
                return res.status(404).json({ message: 'No se encontró la asistencia del tutor' });
            }
            if (confirmed === '1') {
            attendance.confirmed = 'confirmado';
            } else if (confirmed === '0') {
                attendance.confirmed = 'rechazado';
            } else {
                attendance.confirmed = 'pendiente';
            }
            await attendance.save();
           
            if (attendance.confirmed === 'confirmado') {
            return res.status(200).json({ message: 'Asistencia confirmada' });
            } else if (attendance.confirmed === 'rechazado') {
                return res.status(200).json({ message: 'Asistencia rechazada' });
            } else {
                return res.status(200).json({ message: 'Asistencia pendiente' });
            }
        } catch (error) {
            console.error('Error confirming attendance:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
};
