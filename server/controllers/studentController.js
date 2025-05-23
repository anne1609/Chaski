const { Students, Grades, Sequelize } = require('../models'); // Ensure Sequelize is imported


// Get all students with their full name, email, and grade name
const getAllStudentsWithDetails = async (req, res) => {
  try {
    const students = await Students.findAll({
      attributes: [
        'id',
        // Use the imported Sequelize object for fn and col
        [Sequelize.fn('concat', Sequelize.col('Students.names'), ' ', Sequelize.col('Students.last_names')), 'fullName'],
        'email',
        'grade_id'
      ],
      include: [{
        model: Grades,
        attributes: ['name'],
        required: true
      }],
      // raw: true, // Consider removing raw: true and nest: true if you are formatting manually
      // nest: true // Or adjust formatting if kept
    });

    // If raw: true and nest: true are kept, student.Grades.name is correct.
    // If they are removed, you might need to access student.Grade.name (depending on alias) or student.get('Grades').name
    const formattedStudents = students.map(student => {
      // If using raw:true and nest:true, student objects are plain, and nested associations are properties.
      // If not using raw:true, student is a Sequelize instance.
      const plainStudent = student.get ? student.get({ plain: true }) : student; // Get plain object if it's an instance
      return {
        id: plainStudent.id,
        fullName: plainStudent.fullName, // This is an aliased field from attributes
        email: plainStudent.email,
        gradeName: plainStudent.Grades ? plainStudent.Grades.name : (plainStudent.Grade ? plainStudent.Grade.name : null), // Access nested Grade name safely
        grade_id: plainStudent.grade_id
      };
    });

    res.status(200).json(formattedStudents); // Send formatted students
  } catch (error) {
    console.error('Error fetching students with details:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

module.exports = {
  getAllStudentsWithDetails
};