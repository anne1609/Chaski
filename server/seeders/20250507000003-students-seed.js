'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('students', [
      { id: 1, names: 'Ana', last_names: 'López', email: 'ana.lopez@estudiante.chaski.edu', grade_id: 1 },
      { id: 2, names: 'Pedro', last_names: 'García', email: 'pedro.garcia@estudiante.chaski.edu', grade_id: 1 },
      { id: 3, names: 'Lucía', last_names: 'Ramírez', email: 'lucia.ramirez@estudiante.chaski.edu', grade_id: 2 },
      { id: 4, names: 'Miguel', last_names: 'Torres', email: 'miguel.torres@estudiante.chaski.edu', grade_id: 3 },
      { id: 5, names: 'Carmen', last_names: 'Díaz', email: 'carmen.diaz@estudiante.chaski.edu', grade_id: 4 },
      { id: 6, names: 'Javier', last_names: 'Herrera', email: 'javier.herrera@estudiante.chaski.edu', grade_id: 5 },
      { id: 7, names: 'Sofía', last_names: 'Castro', email: 'sofia.castro@estudiante.chaski.edu', grade_id: 6 },
      { id: 8, names: 'Daniel', last_names: 'Flores', email: 'daniel.flores@estudiante.chaski.edu', grade_id: 7 },
      { id: 9, names: 'Valeria', last_names: 'Vargas', email: 'valeria.vargas@estudiante.chaski.edu', grade_id: 8 },
      { id: 10, names: 'Alejandro', last_names: 'Rojas', email: 'alejandro.rojas@estudiante.chaski.edu', grade_id: 9 },
      { id: 11, names: 'María', last_names: 'Fernández', email: 'maria.fernandez@estudiante.chaski.edu', grade_id: 10 },
      { id: 12, names: 'José', last_names: 'Martínez', email: 'jose.martinez@estudiante.chaski.edu', grade_id: 10 },
      { id: 13, names: 'Paula', last_names: 'Gómez', email: 'paula.gomez@estudiante.chaski.edu', grade_id: 10 },
      { id: 14, names: 'Luis', last_names: 'Ruiz', email: 'luis.ruiz@estudiante.chaski.edu', grade_id: 10 },
      { id: 15, names: 'Andrea', last_names: 'Santos', email: 'andrea.santos@estudiante.chaski.edu', grade_id: 10 },
      { id: 16, names: 'Camila', last_names: 'Morales', email: 'camila.morales@estudiante.chaski.edu', grade_id: 11 },
      { id: 17, names: 'Diego', last_names: 'Silva', email: 'diego.silva@estudiante.chaski.edu', grade_id: 11 },
      { id: 18, names: 'Valentina', last_names: 'Paredes', email: 'valentina.paredes@estudiante.chaski.edu', grade_id: 11 },
      { id: 19, names: 'Mateo', last_names: 'Ortega', email: 'mateo.ortega@estudiante.chaski.edu', grade_id: 11 },
      { id: 20, names: 'Gabriela', last_names: 'Vera', email: 'gabriela.vera@estudiante.chaski.edu', grade_id: 11 },
      // Nuevos estudiantes para completar 6 por curso
      // Primero de Primaria (faltan 4)
      { id: 21, names: 'Lucas', last_names: 'Salas', email: 'lucas.salas@estudiante.chaski.edu', grade_id: 1 },
      { id: 22, names: 'Martina', last_names: 'Reyes', email: 'martina.reyes@estudiante.chaski.edu', grade_id: 1 },
      { id: 23, names: 'Emilia', last_names: 'Vargas', email: 'emilia.vargas@estudiante.chaski.edu', grade_id: 1 },
      { id: 24, names: 'Tomás', last_names: 'Cruz', email: 'tomas.cruz@estudiante.chaski.edu', grade_id: 1 },
      // Segundo de Primaria (faltan 5)
      { id: 25, names: 'Isabella', last_names: 'Moreno', email: 'isabella.moreno@estudiante.chaski.edu', grade_id: 2 },
      { id: 26, names: 'Santiago', last_names: 'Peña', email: 'santiago.pena@estudiante.chaski.edu', grade_id: 2 },
      { id: 27, names: 'Valeria', last_names: 'Navarro', email: 'valeria.navarro@estudiante.chaski.edu', grade_id: 2 },
      { id: 28, names: 'Sebastián', last_names: 'Ríos', email: 'sebastian.rios@estudiante.chaski.edu', grade_id: 2 },
      { id: 29, names: 'Renata', last_names: 'Guzmán', email: 'renata.guzman@estudiante.chaski.edu', grade_id: 2 },
      // Tercero de Primaria (faltan 5)
      { id: 30, names: 'Agustín', last_names: 'Molina', email: 'agustin.molina@estudiante.chaski.edu', grade_id: 3 },
      { id: 31, names: 'Victoria', last_names: 'Soto', email: 'victoria.soto@estudiante.chaski.edu', grade_id: 3 },
      { id: 32, names: 'Gabriel', last_names: 'Ortega', email: 'gabriel.ortega@estudiante.chaski.edu', grade_id: 3 },
      { id: 33, names: 'Antonia', last_names: 'Ramos', email: 'antonia.ramos@estudiante.chaski.edu', grade_id: 3 },
      { id: 34, names: 'Samuel', last_names: 'Vega', email: 'samuel.vega@estudiante.chaski.edu', grade_id: 3 },
      // Cuarto de Primaria (faltan 5)
      { id: 35, names: 'Marcos', last_names: 'Paz', email: 'marcos.paz@estudiante.chaski.edu', grade_id: 4 },
      { id: 36, names: 'Julieta', last_names: 'Campos', email: 'julieta.campos@estudiante.chaski.edu', grade_id: 4 },
      { id: 37, names: 'Damián', last_names: 'Luna', email: 'damian.luna@estudiante.chaski.edu', grade_id: 4 },
      { id: 38, names: 'Mía', last_names: 'Cordero', email: 'mia.cordero@estudiante.chaski.edu', grade_id: 4 },
      { id: 39, names: 'Benjamín', last_names: 'Acosta', email: 'benjamin.acosta@estudiante.chaski.edu', grade_id: 4 },
      // Quinto de Primaria (faltan 5)
      { id: 40, names: 'Juan', last_names: 'Bravo', email: 'juan.bravo@estudiante.chaski.edu', grade_id: 5 },
      { id: 41, names: 'Camila', last_names: 'Rivas', email: 'camila.rivas@estudiante.chaski.edu', grade_id: 5 },
      { id: 42, names: 'Nicolás', last_names: 'Méndez', email: 'nicolas.mendez@estudiante.chaski.edu', grade_id: 5 },
      { id: 43, names: 'Valentina', last_names: 'Ponce', email: 'valentina.ponce@estudiante.chaski.edu', grade_id: 5 },
      { id: 44, names: 'Facundo', last_names: 'Silva', email: 'facundo.silva@estudiante.chaski.edu', grade_id: 5 },
      // Sexto de Primaria (faltan 5)
      { id: 45, names: 'Luciana', last_names: 'Serrano', email: 'luciana.serrano@estudiante.chaski.edu', grade_id: 6 },
      { id: 46, names: 'Martín', last_names: 'Carrillo', email: 'martin.carrillo@estudiante.chaski.edu', grade_id: 6 },
      { id: 47, names: 'Florencia', last_names: 'Arias', email: 'florencia.arias@estudiante.chaski.edu', grade_id: 6 },
      { id: 48, names: 'Thiago', last_names: 'Ramos', email: 'thiago.ramos@estudiante.chaski.edu', grade_id: 6 },
      { id: 49, names: 'Josefina', last_names: 'Mora', email: 'josefina.mora@estudiante.chaski.edu', grade_id: 6 },
      // Primero de Secundaria (faltan 5)
      { id: 50, names: 'Pedro', last_names: 'Sánchez', email: 'pedro.sanchez@estudiante.chaski.edu', grade_id: 7 },
      { id: 51, names: 'María', last_names: 'García', email: 'maria.garcia@estudiante.chaski.edu', grade_id: 7 },
      { id: 52, names: 'Joaquín', last_names: 'López', email: 'joaquin.lopez@estudiante.chaski.edu', grade_id: 7 },
      { id: 53, names: 'Sofía', last_names: 'Martínez', email: 'sofia.martinez@estudiante.chaski.edu', grade_id: 7 },
      { id: 54, names: 'Felipe', last_names: 'Torres', email: 'felipe.torres@estudiante.chaski.edu', grade_id: 7 },
      // Segundo de Secundaria (faltan 5)
      { id: 55, names: 'Carla', last_names: 'Vega', email: 'carla.vega@estudiante.chaski.edu', grade_id: 8 },
      { id: 56, names: 'Andrés', last_names: 'Morales', email: 'andres.morales@estudiante.chaski.edu', grade_id: 8 },
      { id: 57, names: 'Juliana', last_names: 'Pérez', email: 'juliana.perez@estudiante.chaski.edu', grade_id: 8 },
      { id: 58, names: 'Maximiliano', last_names: 'Gómez', email: 'maximiliano.gomez@estudiante.chaski.edu', grade_id: 8 },
      { id: 59, names: 'Ariana', last_names: 'Herrera', email: 'ariana.herrera@estudiante.chaski.edu', grade_id: 8 },
      // Tercero de Secundaria (faltan 5)
      { id: 60, names: 'Bruno', last_names: 'Navarro', email: 'bruno.navarro@estudiante.chaski.edu', grade_id: 9 },
      { id: 61, names: 'Daniela', last_names: 'Cruz', email: 'daniela.cruz@estudiante.chaski.edu', grade_id: 9 },
      { id: 62, names: 'Franco', last_names: 'Sosa', email: 'franco.sosa@estudiante.chaski.edu', grade_id: 9 },
      { id: 63, names: 'Micaela', last_names: 'López', email: 'micaela.lopez@estudiante.chaski.edu', grade_id: 9 },
      { id: 64, names: 'Iván', last_names: 'Paredes', email: 'ivan.paredes@estudiante.chaski.edu', grade_id: 9 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('students', null, {});
  }
};
