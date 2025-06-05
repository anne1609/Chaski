const { Teachers, Grades, TeacherGrades, Subjects } = require("../models");

const getEmailsTeacher = async (req, res) => {
  const { gradeId } = req.query; // Get gradeId from query parameters

  try {
    let whereClause = {};
    let includeOptions = [
      {
        model: Grades,
        attributes: ['name'],
        through: { attributes: [] } // Don't include attributes from TeacherGrades
      },
      {
        model: Subjects,
        as: 'subjects', // Alias defined in Teachers model
        attributes: ['name'],
        through: { attributes: [] } // Don't include attributes from subjects_teachers
      }
    ];

    if (gradeId) {
      // If gradeId is provided, we need to find teachers associated with that grade.
      // This is a bit more complex due to the many-to-many relationship.
      // We'll find all teacher_ids for the given gradeId from TeacherGrades,
      // then use those ids to filter Teachers.
      const teacherGrades = await TeacherGrades.findAll({
        where: { grade_id: gradeId },
        attributes: ['teacher_id']
      });

      if (!teacherGrades || teacherGrades.length === 0) {
        return res.status(200).json({ teachers: [], message: `No teachers found for grade ID ${gradeId}` });
      }
      const teacherIds = teacherGrades.map(tg => tg.teacher_id);
      whereClause.id = teacherIds;
    }

    const teachers = await Teachers.findAll({
      where: whereClause,
      attributes: ['id', 'names', 'last_names', 'email', 'phone_number', 'specialization'],
      include: includeOptions,
      order: [['last_names', 'ASC'], ['names', 'ASC']] // Optional: order teachers
    });

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: "No se encontraron profesores" + (gradeId ? ` para el curso especificado.` : "") });
    }

    const teachersWithDetails = teachers.map(teacher => ({
      id: teacher.id,
      name: `${teacher.names} ${teacher.last_names}`,
      email: teacher.email,
      phone_number: teacher.phone_number,
      specialization: teacher.specialization,
      grades: teacher.Grades ? teacher.Grades.map(g => g.name) : [], // Grade names
      subjects: teacher.subjects ? teacher.subjects.map(s => s.name) : [] // Subject names
    }));

    res.status(200).json({ teachers: teachersWithDetails });
  } catch (error) {
    console.error("Error al obtener los correos de los profesores:", error);
    res.status(500).json({ error: "Error al obtener los correos de los profesores" });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teachers.findAll({
      attributes: ['id', 'names', 'last_names', 'email', 'phone_number', 'specialization'],
      order: [['last_names', 'ASC'], ['names', 'ASC']] // Optional: order teachers
    });

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: "No se encontraron profesores" });
    }

    const teachersWithDetails = teachers.map(teacher => ({
      id: teacher.id,
      name: `${teacher.names} ${teacher.last_names}`,
      email: teacher.email,
      phone_number: teacher.phone_number,
      specialization: teacher.specialization
    }));

    res.status(200).json({ teachers: teachersWithDetails });
  } catch (error) {
    console.error("Error al obtener los profesores:", error);
    res.status(500).json({ error: "Error al obtener los profesores" });
  }
};

module.exports = { getEmailsTeacher, getAllTeachers };