'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener el ID del profesor demo
    const [teacherResult] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
    );
    
    if (teacherResult.length > 0) {
      const teacherId = teacherResult[0].id;
      
      // Actualizar la especialización del profesor a Filosofía
      await queryInterface.sequelize.query(
        `UPDATE teachers SET specialization = 'Filosofía' WHERE id = ${teacherId}`
      );
      
      // Eliminar todas las asignaciones actuales del profesor demo
      await queryInterface.bulkDelete('subjects_teachers', {
        teacher_id: teacherId
      }, {});
      
      // Eliminar las asignaciones de grados actuales del profesor demo
      await queryInterface.bulkDelete('teachers_grades', {
        teacher_id: teacherId
      }, {});
      
      // Obtener los IDs de las materias de Filosofía que acabamos de crear
      const [philosophySubjects] = await queryInterface.sequelize.query(
        `SELECT id, grade_id FROM subjects WHERE name = 'Filosofía' ORDER BY grade_id`
      );
      
      if (philosophySubjects.length >= 3) {
        // Asignar al profesor demo las 3 materias de filosofía
        const subjectAssignments = philosophySubjects.slice(0, 3).map(subject => ({
          subject_id: subject.id,
          teacher_id: teacherId
        }));
        
        await queryInterface.bulkInsert('subjects_teachers', subjectAssignments);
        
        // Asignar al profesor demo a los grados correspondientes
        const gradeAssignments = philosophySubjects.slice(0, 3).map(subject => ({
          teacher_id: teacherId,
          grade_id: subject.grade_id
        }));
        
        await queryInterface.bulkInsert('teachers_grades', gradeAssignments);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Obtener el ID del profesor demo
    const [teacherResult] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
    );
    
    if (teacherResult.length > 0) {
      const teacherId = teacherResult[0].id;
      
      // Restaurar la especialización original
      await queryInterface.sequelize.query(
        `UPDATE teachers SET specialization = 'Educación General' WHERE id = ${teacherId}`
      );
      
      // Eliminar asignaciones actuales
      await queryInterface.bulkDelete('subjects_teachers', {
        teacher_id: teacherId
      }, {});
      
      await queryInterface.bulkDelete('teachers_grades', {
        teacher_id: teacherId
      }, {});
      
      // Restaurar las asignaciones originales (las 7 materias)
      await queryInterface.bulkInsert('subjects_teachers', [
        {
          subject_id: 1, // Matemáticas Básicas
          teacher_id: teacherId
        },
        {
          subject_id: 2, // Lenguaje y Comunicación
          teacher_id: teacherId
        },
        {
          subject_id: 3, // Ciencias Naturales
          teacher_id: teacherId
        },
        {
          subject_id: 4, // Historia del Perú
          teacher_id: teacherId
        },
        {
          subject_id: 5, // Educación Física
          teacher_id: teacherId
        },
        {
          subject_id: 6, // Álgebra
          teacher_id: teacherId
        },
        {
          subject_id: 7, // Literatura Universal
          teacher_id: teacherId
        }
      ]);
    }
  }
};
