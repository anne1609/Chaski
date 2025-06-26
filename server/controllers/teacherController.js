const { Teachers, Grades, TeacherGrades, Subjects, Students, Tutors, Tutors_Students, SubjectsTeachers } = require("../models");

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
const getTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teachers.findByPk(id, {
      attributes: ['id', 'names', 'last_names', 'email', 'phone_number', 'specialization']
    });

    if (!teacher) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    const teacherDetails = {
      id: teacher.id,
      name: `${teacher.names} ${teacher.last_names}`,
      email: teacher.email,
      phone_number: teacher.phone_number,
      specialization: teacher.specialization
    };

    res.status(200).json({ teacher: teacherDetails });
  } catch (error) {
    console.error("Error al obtener el profesor:", error);
    res.status(500).json({ error: "Error al obtener el profesor" });
  }
};

const getTeacherCoursesWithStudentsAndTutors = async (req, res) => {
  try {
    const teacherId = req.user.id; // Obtener el ID del profesor autenticado

    // Obtener todas las materias que enseña el profesor
    const teacherSubjects = await SubjectsTeachers.findAll({
      where: { teacher_id: teacherId },
      include: [
        {
          model: Subjects,
          as: 'subject',
          include: [
            {
              model: Grades,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!teacherSubjects || teacherSubjects.length === 0) {
      return res.status(200).json({ 
        courses: [], 
        message: "No se encontraron materias asignadas a este profesor" 
      });
    }

    // Procesar cada materia para obtener estudiantes y tutores
    const coursesWithDetails = await Promise.all(
      teacherSubjects.map(async (teacherSubject) => {
        const subject = teacherSubject.subject;
        const grade = subject.Grade;

        // Obtener todos los estudiantes del grado
        const students = await Students.findAll({
          where: { grade_id: grade.id },
          attributes: ['id', 'names', 'last_names', 'email'],
          order: [['last_names', 'ASC'], ['names', 'ASC']]
        });

        // Obtener tutores para cada estudiante
        const studentsWithTutors = await Promise.all(
          students.map(async (student) => {
            // Buscar relaciones tutor-estudiante
            const tutorStudentRelations = await Tutors_Students.findAll({
              where: { student_id: student.id },
              include: [
                {
                  model: Tutors,
                  as: 'tutor',
                  attributes: ['id', 'names', 'last_names', 'email', 'phone_number']
                }
              ]
            });

            const tutors = tutorStudentRelations.map(relation => ({
              id: relation.tutor.id,
              name: `${relation.tutor.names} ${relation.tutor.last_names}`,
              email: relation.tutor.email,
              phone_number: relation.tutor.phone_number
            }));

            return {
              id: student.id,
              name: `${student.names} ${student.last_names}`,
              email: student.email,
              tutors: tutors
            };
          })
        );

        return {
          courseId: `${grade.name}-${subject.name}`,
          courseName: `${grade.name} - ${subject.name}`,
          grade: {
            id: grade.id,
            name: grade.name
          },
          subject: {
            id: subject.id,
            name: subject.name,
            description: subject.description
          },
          students: studentsWithTutors,
          totalStudents: studentsWithTutors.length
        };
      })
    );

    res.status(200).json({ 
      teacherId: teacherId,
      courses: coursesWithDetails,
      totalCourses: coursesWithDetails.length
    });

  } catch (error) {
    console.error("Error al obtener los cursos del profesor:", error);
    res.status(500).json({ error: "Error al obtener los cursos del profesor" });
  }
};

module.exports = { getEmailsTeacher, getAllTeachers, getTeacherCoursesWithStudentsAndTutors, getTeacher };