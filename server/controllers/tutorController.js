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
    const tutors = await Tutors.findAll();

    if (tutors.length === 0) {
      return res.status(200).json({ message: "No se encontraron tutores" });
    }

    const tutorsWithStudents = [];

    // Para cada tutor, obtener sus estudiantes asignados
    for (const tutor of tutors) {
      const tutorStudentRelations = await Tutors_Students.findAll({
        where: { tutor_id: tutor.id }
      });
      
      const studentIds = tutorStudentRelations.map(relation => relation.student_id);
      
      let studentsData = [];
      if (studentIds.length > 0) {
        studentsData = await Students.findAll({
          where: { id: studentIds },
          include: [{
            model: Grades,
            attributes: ['name']
          }]
        });
      }
      
      const students = studentsData.map(student => ({
        name: `${student.names} ${student.last_names}`,
        email: student.email,
        grade: student.Grade ? student.Grade.name : 'No asignado'
      }));
      
      tutorsWithStudents.push({
        name: `${tutor.names} ${tutor.last_names}`,
        email: tutor.email,
        phone_number: tutor.phone_number,
        students
      });
    }

    res.status(200).json({ tutors: tutorsWithStudents });
  } catch (error) {
    console.error("Error al obtener los correos de los tutores y estudiantes:", error);
    res.status(500).json({ error: "Error al obtener los correos de los tutores y estudiantes" });
  }
};

const getTutorById = async (req, res) => {
  const { tutorId } = req.params;

  try {
    const tutor = await Tutors.findByPk(tutorId);
    
    if (!tutor) {
      return res.status(404).json({ message: "Tutor no encontrado" });
    }
    
    const tutorStudentRelations = await Tutors_Students.findAll({
      where: { tutor_id: tutorId }
    });
    
    const studentIds = tutorStudentRelations.map(relation => relation.student_id);
    
    let studentsData = [];
    if (studentIds.length > 0) {
      studentsData = await Students.findAll({
        where: { id: studentIds },
        include: [{
          model: Grades,
          attributes: ['name']
        }]
      });
    }
    
    const students = studentsData.map(student => ({
      id: student.id,
      name: `${student.names} ${student.last_names}`,
      email: student.email,
      grade: student.Grade ? student.Grade.name : 'No asignado'
    }));
    
    const tutorData = {
      id: tutor.id,
      name: `${tutor.names} ${tutor.last_names}`,
      email: tutor.email,
      phone_number: tutor.phone_number,
      students
    };

    res.status(200).json({ tutor: tutorData });
  } catch (error) {
    console.error("Error al obtener el tutor:", error);
    res.status(500).json({ error: "Error al obtener el tutor" });
  }
};

const getEmailTutorsByGrade = async (req, res) => {
  const { gradeId } = req.params;

  try {
    // 1. Fetch the grade first to get its name.
    const grade = await Grades.findByPk(gradeId, { attributes: ['id', 'name'] });

    if (!grade) {
      return res.status(404).json({ message: `Grado con ID ${gradeId} no encontrado.` });
    }
    const actualGradeName = grade.name;

    // Find all students in the given grade
    const studentsInGrade = await Students.findAll({
      where: { grade_id: gradeId },
      attributes: ['id', 'names', 'last_names', 'email']
    });

    // If no students in this grade, then no tutors can be associated via students of this grade.
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

    // Find all tutor-student relationships for these students
    const tutorStudentRelations = await Tutors_Students.findAll({
      where: { student_id: studentIdsInGrade },
      attributes: ['tutor_id', 'student_id']
    });

    // If no tutors are related to students of this grade.
    if (!tutorStudentRelations || tutorStudentRelations.length === 0) {
      return res.status(200).json({
        id: gradeId,
        gradeName: actualGradeName,
        tutors: [],
        message: `No se encontraron tutores para los estudiantes del grado ${actualGradeName}.`
      });
    }

    const tutorIds = [...new Set(tutorStudentRelations.map(relation => relation.tutor_id))];

    // Find all tutors with these IDs
    const tutorsData = await Tutors.findAll({
      where: { id: tutorIds },
      attributes: ['id', 'names', 'last_names', 'email']
    });

    // If tutor records themselves are not found (e.g., data inconsistency)
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
        .filter(student => student); // Filter out any undefined

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