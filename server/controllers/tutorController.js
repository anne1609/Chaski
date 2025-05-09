const { Tutors, Students, Tutors_Students, Grades } = require("../models");

const createTutor = async (req, res) => {
  const { names, last_names, email, phone_number } = req.body;

  try {
    await Tutors.create({
      names,
      last_names,
      email,
      phone_number
    });
    res.status(201).json({ message: "Tutor creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el tutor:", error);
    res.status(500).json({ error: "Error al crear el tutor" });
  }
};


const getEmailTutorsByGrade = async (req, res) => {
  const { gradeId } = req.params;

  try {
   
    const grade = await Grades.findByPk(gradeId, { attributes: ['id', 'name'] });

    if (!grade) {
      return res.status(404).json({ message: `Grado con ID ${gradeId} no encontrado.` });
    }
    const actualGradeName = grade.name;

    
    const studentsInGrade = await Students.findAll({
      where: { grade_id: gradeId },
      attributes: ['id', 'names', 'last_names', 'email']
    });

    
    if (!studentsInGrade || studentsInGrade.length === 0) {
      return res.status(200).json({
        id: gradeId,
        gradeName: actualGradeName,
        tutors: [],
        message: `No se encontraron estudiantes en el grado ${actualGradeName}.`
      });
    }

    const studentIdsInGrade = studentsInGrade.map(student => student.id);
    const studentsInGradeMap = new Map(studentsInGrade.map(s => [s.id, { name: `${s.names} ${s.last_names}`, email: s.email }]));

   
    const tutorStudentRelations = await Tutors_Students.findAll({
      where: { student_id: studentIdsInGrade },
      attributes: ['tutor_id', 'student_id']
    });

    
    if (!tutorStudentRelations || tutorStudentRelations.length === 0) {
      return res.status(200).json({
        id: gradeId,
        gradeName: actualGradeName,
        tutors: [],
        message: `No se encontraron tutores para los estudiantes del grado ${actualGradeName}.`
      });
    }

    const tutorIds = [...new Set(tutorStudentRelations.map(relation => relation.tutor_id))];

   
    const tutorsData = await Tutors.findAll({
      where: { id: tutorIds },
      attributes: ['id', 'names', 'last_names', 'email']
    });

    if (!tutorsData || tutorsData.length === 0) {
      return res.status(200).json({
        id: gradeId,
        gradeName: actualGradeName,
        tutors: [],
        message: `Se encontraron relaciones de tutoría pero no los detalles de los tutores para el grado ${actualGradeName}.`
      });
    }

    const tutorsWithTheirStudentsInGrade = tutorsData.map(tutor => {
      const assignedStudentIdsForThisTutor = tutorStudentRelations
        .filter(relation => relation.tutor_id === tutor.id)
        .map(relation => relation.student_id);

      const studentsOfThisTutorInThisGrade = assignedStudentIdsForThisTutor
        .map(studentId => studentsInGradeMap.get(studentId))
        .filter(student => student); 

      return {
        tutor_id: tutor.id,
        name: `${tutor.names} ${tutor.last_names}`,
        email: tutor.email,
        students: studentsOfThisTutorInThisGrade
      };
    });
    
    res.status(200).json({ 
      id: gradeId,
      gradeName: actualGradeName, 
      tutors: tutorsWithTheirStudentsInGrade 
    });

  } catch (error) {
    console.error("Error al obtener los correos de los tutores por grado:", error);
    res.status(500).json({ error: "Error al obtener los correos de los tutores por grado" });
  }
};

module.exports = { createTutor, getEmailTutors, getTutorById, getEmailTutorsByGrade };