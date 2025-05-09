const { Grades, Students } = require("../models/index");


const getGrades = async (req, res) => {
  try {
    const grades = await Grades.findAll({
      attributes: ["id", "name"],
    });

    if (grades.length === 0) {
      return res.status(404).json({ message: "No se encontraron grados" });
    }

    res.status(200).json({ grades });
  } catch (error) {
    console.error("Error al obtener los grados:", error);
    res.status(500).json({ error: "Error al obtener los grados" });
  }
}

const getEmailStudents = async (req, res) => {
  const { gradeId } = req.params;

  try {
    
    const grade = await Grades.findOne({
      where: { id: gradeId },
      attributes: ["id", "name"], 
    });

    if (!grade) {
      return res.status(404).json({ message: "Grado no encontrado" });
    }

    
    const students = await Students.findAll({
      where: { grade_id: gradeId },
      attributes: ["names", "last_names", "email"]
    });

    const emails = students.map((student) => ({
      name: `${student.names || ''} ${student.last_names || ''}`.trim(),
      email: student.email
    }));

    
    res.status(200).json({ gradeName: grade.name, emails });

  } catch (error) {
    console.error("Error al obtener los correos de los estudiantes:", error);
    res.status(500).json({ error: "Error al obtener los correos de los estudiantes" });
  }
};

module.exports = { getEmailStudents, getGrades };