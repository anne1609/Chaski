'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener el ID del profesor demo
    const [teacherResult] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
    );
    
    if (teacherResult.length > 0) {
      const teacherId = teacherResult[0].id;
      
      // Agregar materias de Filosofía para diferentes grados
      await queryInterface.bulkInsert('subjects', [
        {
          name: 'Filosofía',
          description: 'Introducción al pensamiento filosófico y reflexión crítica',
          grade_id: 9, // Tercero de Secundaria
          teacher_id: teacherId,
        },
        {
          name: 'Filosofía',
          description: 'Filosofía moderna y contemporánea',
          grade_id: 10, // Cuarto de Secundaria
          teacher_id: teacherId,
        },
        {
          name: 'Filosofía',
          description: 'Ética y filosofía práctica',
          grade_id: 11, // Quinto de Secundaria
          teacher_id: teacherId,
        }
      ], {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subjects', {
      name: 'Filosofía'
    }, {});
  }
};
