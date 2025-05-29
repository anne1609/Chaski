const { Teachers, Secretaries } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Email y contraseña son requeridos' 
        });
      }

      let user = null;
      let userType = null;

      // Check in Secretaries table first
      const secretary = await Secretaries.findOne({ where: { email } });
      if (secretary) {
        user = secretary;
        userType = 'secretary';
      } else {
        // Check in Teachers table
        const teacher = await Teachers.findOne({ where: { email } });
        if (teacher) {
          user = teacher;
          userType = 'teacher';
        }
      }

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Email o contraseña incorrectos' 
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Email o contraseña incorrectos' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: userType,
          names: user.names,
          last_names: user.last_names
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            names: user.names,
            last_names: user.last_names,
            role: userType
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error interno del servidor' 
      });
    }
  },

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: 'Token no proporcionado' 
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: decoded.id,
            email: decoded.email,
            names: decoded.names,
            last_names: decoded.last_names,
            role: decoded.role
          }
        }
      });

    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }
  }
};
