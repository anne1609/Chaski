const { Teachers, Grades, TeacherGrades } = require("../models");

const getEmailsTeacher = async (req, res) => {
  try {
    const teachers = await Teachers.findAll();

    if (teachers.length === 0) {
      return res.status(404).json({ message: "No se encontraron profesores" });
    }

    const teachersWithGrades = [];

    // Para cada profesor, obtener sus grados asignados
    for (const teacher of teachers) {
      const teacherGradeRelations = await TeacherGrades.findAll({
        where: { teacher_id: teacher.id }
      });
      
      const gradeIds = teacherGradeRelations.map(relation => relation.grade_id);
      
      let gradesData = [];
      if (gradeIds.length > 0) {
        gradesData = await Grades.findAll({
          where: { id: gradeIds }
        });
      }
      
      const grades = gradesData.map(grade => ({
        name: grade.name,
      }));
      
      teachersWithGrades.push({
        name: `${teacher.names} ${teacher.last_names}`,
        email: teacher.email,
        phone_number: teacher.phone_number,
        specialization: teacher.specialization,
        grades: grades
      });
    }

    res.status(200).json({ teachers: teachersWithGrades });
  } catch (error) {
    console.error("Error al obtener los correos de los profesores y sus grados:", error);
    res.status(500).json({ error: "Error al obtener los correos de los profesores y sus grados" });
  }
};


module.exports = {  getEmailsTeacher };