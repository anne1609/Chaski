const {Communications, Teachers, Teachers_communications} = require('../models');

module.exports = {
    async getAllTeachersCommunications(req, res) {
        try {
            const teachersCommunications = await Teachers_communications.findAll({
                include: [
                    {
                        model: Teachers,
                        as: 'teachers',
                        attributes: ['id', 'last_names', 'email'],
                    },
                    {
                        model: Communications,
                        as: 'communications',
                        attributes: ['id', 'subject', 'body'],
                    },
                ],
            });
            if (!teachersCommunications) {
                return res.status(404).json({ message: 'No se encontraron comunicaciones de profesores' });
            }
            return res.status(200).json(teachersCommunications);
        } catch (error) {
            console.error('Error al obtener las comunicaciones de los profesores:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async getTeacherCommunicationsById(req, res) {
        const {teacher_id, communication_id} = req.params;
        try {
            const teacherCommunication = await Teachers_communications.findOne({
                where: {
                    communication_id,
                    teacher_id,
                },
                include: [
                    {
                        model: Teachers,
                        as: 'teachers',
                        attributes: ['id', 'last_names', 'email'],
                    },
                    {
                        model: Communications,
                        as: 'communications',
                        attributes: ['id', 'subject', 'body'],
                    },
                ],
            });
            if (!teacherCommunication) {
                return res.status(404).json({ message: 'No se encontró la comunicación del profesor' });
            }
            return res.status(200).json(teacherCommunication);
        } catch (error) {
            console.error('Error al obtener la comunicación del profesor:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async createTeacherCommunication(req, res) {
        const { teacher_id, communication_id } = req.body;
        try {
            const newTeacherCommunication = await Teachers_communications.create({
                teacher_id,
                communication_id,
            });
            return res.status(201).json(newTeacherCommunication);
        } catch (error) {
            console.error('Error al crear la comunicación del profesor:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async updateTeacherCommunication(req, res) {
        const { teacher_id, communication_id } = req.body;
        try {
            const updatedTeacherCommunication = await Teachers_communications.update(
                { teacher_id, communication_id },
                {
                    where: {
                        teacher_id,
                        communication_id,
                    },
                }
            );
            if (!updatedTeacherCommunication[0]) {
                return res.status(404).json({ message: 'No se encontró la comunicación del profesor' });
            }
            return res.status(200).json({ message: 'Comunicación del profesor actualizada exitosamente' });
        }
        catch (error) {
            console.error('Error al actualizar la comunicación del profesor:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async deleteTeacherCommunication(req, res) {
        const { id } = req.params;
        try {
            const deletedTeacherCommunication = await Teachers_communications.destroy({
                where: { id },
            });
            if (!deletedTeacherCommunication) {
                return res.status(404).json({ message: 'No se encontró la comunicación del profesor' });
            }
            return res.status(200).json({ message: 'Comunicación del profesor eliminada exitosamente' });
        } catch (error) {
            console.error('Error al eliminar la comunicación del profesor:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async confirmAttendance(req, res) {
        const { communication_id, teacher_id, confirmed } = req.query;
        try {
            const attendance = await Teachers_communications.findOne({
                where: {
                    communication_id,
                    teacher_id,
                },
            });
            if (!attendance) {
                return res.status(404).json({ message: 'No se encontró la asistencia' });
            }
            attendance.confirmed = confirmed === '1';
            await attendance.save();
            if(attendance.confirmed) {
                return res.status(200).json({ message: 'Asistencia confirmada' });
            }else {
                return res.status(200).json({ message: 'Asistencia rechazada' });
            }
        } catch (error) {
            console.error('Error al confirmar la asistencia:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};