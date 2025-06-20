const {Students_Communications, Students, Communications} = require('../models');

module.exports = {
    async getAllStudentsCommunications(req, res) {
        try {
            const studentsCommunications = await Students_Communications.findAll({
                include: [
                    {
                        model: Students,
                        as: 'students',
                        attributes: ['names', 'last_names', 'email'],
                    },
                    {
                        model: Communications,
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
            const studentCommunication = await Students_Communications.findOne({
                where: {
                    communication_id,
                    student_id,
                },
                include: [
                    {
                        model: Students,
                        as: 'students',
                        attributes: ['names', 'last_names', 'email'],
                    },
                    {
                        model: Communications,
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
        const {student_id, communication_id,  meeting_datetime,} = req.body;
        try {
            const newStudentCommunication = await Students_Communications.create({
                student_id,
                communication_id,
                meeting_datetime,
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
            const deletedCommunication = await Students_Communications.destroy({
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
        const { student_id,communication_id } = req.params;
        const { status } = req.body;

        try {
            const [updated] = await Students_Communications.update(
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
    async confirmAttendance(req, res) {
        const { communication_id,confirmed } = req.query;

        try {
            const attendance = await Students_Communications.findOne({
                where: {
                    communication_id,
                },
            });

            if (!attendance) {
                return res.status(404).json({ message: 'No se encontró la asistencia del estudiante' });
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
            console.error('Error al confirmar la asistencia del estudiante:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};