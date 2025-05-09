const { Subjects, Teachers, Grades, SubjectsTeachers } = require("../models");

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subjects.findAll({
      attributes: ["id", "name"],
    });

    if (subjects.length === 0) {
      return res.status(200).json({ message: "No se encontraron materias" });
    }

    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error al obtener las materias:", error);
    res.status(500).json({ error: "Error al obtener las materias" });
  }
}

const getSubjectTeachersEmails = async (req, res) => {
  const { subjectId } = req.params;

  try {
    
    const subject = await Subjects.findByPk(subjectId);
    
    if (!subject) {
      return res.status(200).json({ message: "Materia no encontrada" });
    }

    
    const teacherRelations = await SubjectsTeachers.findAll({
      where: { subject_id: subjectId }
    });
    
    if (teacherRelations.length === 0) {
      return res.status(200).json({ 
        subject: { id: subject.id, name: subject.name },
        message: "No hay profesores asignados a esta materia" 
      });
    }

    
    const teacherIds = teacherRelations.map(relation => relation.teacher_id);
    
   
    const teachers = await Teachers.findAll({
      where: { id: teacherIds }
    });

   
    const teachersEmails = teachers.map(teacher => ({
      name: `${teacher.names} ${teacher.last_names}`,
      email: teacher.email,
      phone_number: teacher.phone_number,
    }));

    
    res.status(200).json({
      subject: {
        id: subject.id,
        name: subject.name,
        description: subject.description
      },
      teachers: teachersEmails
    });
  } catch (error) {
    console.error("Error al obtener los correos de profesores por materia:", error);
    res.status(500).json({ error: "Error al obtener los correos de profesores por materia" });
  }
};

module.exports = { 
  getSubjectTeachersEmails,
  getSubjects
};