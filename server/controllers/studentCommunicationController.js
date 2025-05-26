const {students_communications, students, communications} = require('../models');

module.exports = {
    async getAllStudentsCommunications(req, res) {
        try {
            const studentsCommunications = await students_communications.findAll({
                include: [
                    {
                        model: students,
                        as: 'students',
                        attributes: ['names', 'last_names', 'email'],
                    },
                    {
                        model: communications,
                        as: 'communications',
                        attributes: ['subject', 'body', 'priority', 'status'],
                    },
                ],
            });
            if (!studentsCommunications) {
                return res.status(404).json({ message: 'No se encontraron comunicaciones de estudiantes' });
            }
            return res.status(200).json(studentsCommunications);
        } catch (error) {
            console.error('Error al obtener las comunicaciones de los estudiantes:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async getStudentCommunicationById(req, res) {
        const {student_id, communication_id} = req.params;
        try {
            const studentCommunication = await students_communications.findOne({
                where: {
                    communication_id,
                    student_id,
                },
                include: [
                    {
                        model: students,
                        as: 'students',
                        attributes: ['names', 'last_names', 'email'],
                    },
                    {
                        model: communications,
                        as: 'communications',
                        attributes: ['subject', 'body', 'priority', 'status'],
                    },
                ],
            });
            if (!studentCommunication) {
                return res.status(404).json({ message: 'No se encontró la comunicación del estudiante' });
            }
            return res.status(200).json(studentCommunication);
        } catch (error) {
            console.error('Error al obtener la comunicación del estudiante:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async createStudentCommunication(req, res) {
        const {student_id, communication_id} = req.body;
        try {
            const newStudentCommunication = await students_communications.create({
                student_id,
                communication_id,
            });
            return res.status(201).json(newStudentCommunication);
        } catch (error) {
            console.error('Error al crear la comunicación del estudiante:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async deleteStudentCommunication(req, res) {
        const {student_id, communication_id} = req.params;
        try {
            const deletedCommunication = await students_communications.destroy({
                where: {
                    student_id,
                    communication_id,
                },
            });
            if (!deletedCommunication) {
                return res.status(404).json({ message: 'No se encontró la comunicación del estudiante para eliminar' });
            }
            return res.status(200).json({ message: 'Comunicación del estudiante eliminada exitosamente' });
        } catch (error) {
            console.error('Error al eliminar la comunicación del estudiante:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async updateStudentCommunication(req, res) {
        const { student_id, communication_id } = req.params;
        const { status } = req.body;

        try {
            const [updated] = await students_communications.update(
                { status },
                {
                    where: {
                        student_id,
                        communication_id,
                    },
                }
            );
            if (!updated) {
                return res.status(404).json({ message: 'No se encontró la comunicación del estudiante' });
            }
            return res.status(200).json({ message: 'Comunicación del estudiante actualizada exitosamente' });
        } catch (error) {
            console.error('Error al actualizar la comunicación del estudiante:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
};