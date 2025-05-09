const {Users} = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
    async getUsers(req, res) {
        try {
            const usersList = await Users.findAll();
            res.status(200).json(usersList);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Error fetching users' });
        }
    },
    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await Users.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Error fetching user' });
        }
    },
    async createUser(req, res) {
        const { names, lastNames, email, password, role, phone_number } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            const newUser = await Users.create({
                names,
                lastNames,
                email,
                password: hashedPassword,
                role,
                phone_number
            });
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Error creating user' });
        }
    },
    async updateUser(req, res) {
        const { id } = req.params;
        const { names, lastNames, email, password, role, phone_number } = req.body;
        try {
            const user = await Users.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            await user.update({
                names,
                lastNames,
                email,
                password: hashedPassword,
                role,
                phone_number
            });
            res.status(200).json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user' });
        }
    },
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const user = await Users.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.destroy();
            res.status(204).send(); // No content
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    },
}