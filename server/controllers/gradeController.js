const { Grades, Students } = require("../models/index");



const getEmailStudents = async (req, res) => {
  const { gradeId } = req.params;

  try {
    const students = await Students.findAll({
      where: { grade_id: gradeId, 
        
      }       

    });

    if (students.length === 0) {
      return res.status(404).json({ message: "No se encontraron estudiantes" });
    }

    const gradeName = await Grades.findOne({
        where: { id: gradeId },
        attributes: ["name"],
        });

    const emails = students.map((student) => ({ name: student.names, email: student.email}));
    res.status(200).json({ gradeName,emails });
  } catch (error) {
    console.error("Error al obtener los correos de los estudiantes:", error);
    res.status(500).json({ error: "Error al obtener los correos de los estudiantes" });
  }
};

module.exports = { getEmailStudents };