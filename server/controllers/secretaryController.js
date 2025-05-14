const {Secretaries} = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
    async getAllSecretaries(req, res) {
        try {
        const secretaries = await Secretaries.findAll();
        if (secretaries.length === 0) {
            return res.status(404).json({ message: 'No se encontraron secretarios' });
        }
        return res.status(200).json(secretaries);
        }
        catch (error) {
            console.error('Error fetching secretaries:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getSecretaryById(req, res) {
        const { id } = req.params;
        try {
            const secretary = await Secretaries.findByPk(id);
            if (!secretary) {
                return res.status(404).json({ message: 'Secretary not found' });
            }
            return res.status(200).json(secretary);
        } catch (error) {
            console.error('Error fetching secretary:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async createSecretary(req, res) {
        const { names, last_names, email, password, phone_number } = req.body;
        try {
            const existingSecretary = await Secretaries.findOne({ where: { email } });
            if (existingSecretary) {
                return res.status(409).json({ message: 'Secretary already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newSecretary = await Secretaries.create({
                names,
                last_names,
                email,
                password: hashedPassword,
                phone_number
            });
            return res.status(201).json(newSecretary);
        } catch (error) {
            console.error('Error creating secretary:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async updateSecretary(req, res) {
        const { id } = req.params;
        const { names, last_names, email, password, phone_number } = req.body;
        try {
            const secretary = await Secretaries.findByPk(id);
            if (!secretary) {
                return res.status(404).json({ message: 'Secretary not found' });
            }
            if (email) {
                const existingSecretary = await Secretaries.findOne({ where: { email } });
                if (existingSecretary && existingSecretary.id !== id) {
                    return res.status(409).json({ message: 'Email already in use' });
                }
            }
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                secretary.password = hashedPassword;
            }
            secretary.names = names || secretary.names;
            secretary.last_names = last_names || secretary.last_names;
            secretary.email = email || secretary.email;
            secretary.phone_number = phone_number || secretary.phone_number;
            await secretary.save();
            return res.status(200).json(secretary);
        } catch (error) {
            console.error('Error updating secretary:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async deleteSecretary(req, res) {
        const { id } = req.params;
        try {
            const secretary = await Secretaries.findByPk(id);
            if (!secretary) {
                return res.status(404).json({ message: 'Secretary not found' });
            }
            await secretary.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting secretary:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
}