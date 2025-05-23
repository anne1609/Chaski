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

const getEmailTutors = async (req, res) => {
  try {
    const tutors = await Tutors.findAll({
      attributes: ['id', 'names', 'last_names', 'email', 'phone_number']
    });

    if (!tutors || tutors.length === 0) {
      return res.status(404).json({ message: "No se encontraron tutores" });
    }

    const tutorsWithStudents = await Promise.all(tutors.map(async (tutor) => {
      const tutorStudentRelations = await Tutors_Students.findAll({
        where: { tutor_id: tutor.id },
        attributes: ['student_id']
      });

      const studentIds = tutorStudentRelations.map(relation => relation.student_id);
      const studentsData = await Students.findAll({
        where: { id: studentIds },
        include: [{
          model: Grades,
          attributes: ['name']
        }],
        attributes: ['id', 'names', 'last_names', 'email']
      });

      const students = studentsData.map(student => ({
        id: student.id,
        name: `${student.names} ${student.last_names}`,
        email: student.email,
        gradeName: student.Grade ? student.Grade.name : 'Grado no asignado' // Include grade name
      }));

      return {
        id: tutor.id,
        name: `${tutor.names} ${tutor.last_names}`,
        email: tutor.email,
        phone_number: tutor.phone_number,
        students
      };
    }));

    res.status(200).json({ tutors: tutorsWithStudents });
  }
  catch (error) {
    console.error("Error al obtener los correos de los tutores:", error);
    res.status(500).json({ error: "Error al obtener los correos de los tutores" });
  }
}

const getEmailTutorsByGrade = async (req, res) => {
  const { gradeId } = req.params;

  try {
    if (!gradeId) { // If no gradeId is provided, call getEmailTutors
      return getEmailTutors(req, res);
    }

    const grade = await Grades.findByPk(gradeId, { attributes: ['id', 'name'] });

    if (!grade) {
      return res.status(404).json({ message: `Grado con ID ${gradeId} no encontrado.` });
    }
    const actualGradeName = grade.name;


    const studentsInGrade = await Students.findAll({
      where: { grade_id: gradeId },
      attributes: ['id', 'names', 'last_names', 'email'] // grade_id is implicitly here
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
    // Store gradeName along with other student details
    const studentsInGradeMap = new Map(studentsInGrade.map(s => [s.id, { name: `${s.names} ${s.last_names}`, email: s.email, gradeName: actualGradeName }]));


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
        .map(studentId => {
          const studentData = studentsInGradeMap.get(studentId);
          // Ensure studentData exists and add gradeName
          return studentData ? { ...studentData, gradeName: actualGradeName } : null;
        })
        .filter(student => student);

      return {
        id: tutor.id, // Changed from tutor_id to id to match frontend expectations
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

module.exports = { createTutor, getEmailTutorsByGrade, getEmailTutors };