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
      return res.status(404).json({ message: "No se encontraron tutores" });
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

module.exports = { createTutor, getEmailTutors, getTutorById };