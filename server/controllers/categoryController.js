const {Categories} = require('../models');

module.exports = {
    async getCategories(req, res) {
        try {
            const categoriesList = await Categories.findAll();
            res.status(200).json(categoriesList);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Error fetching categories' });
        }
    },
    async getCategoryById(req, res) {
        const { id } = req.params;
        try {
            const category = await Categories.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(category);
        } catch (error) {
            console.error('Error fetching category:', error);
            res.status(500).json({ message: 'Error fetching category' });
        }
    },
    async createCategory(req, res) {
        const { name, description } = req.body;
        try {
            const newCategory = await Categories.create({
                name,
                description
            });
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ message: 'Error creating category' });
        }
    },
    async updateCategory(req, res) {
        const { id } = req.params;
        const { name, description } = req.body;
        try {
            const category = await Categories.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            await category.update({
                name,
                description
            });
            res.status(200).json(category);
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Error updating category' });
        }
    },
    async deleteCategory(req, res) {
        const { id } = req.params;
        try {
            const category = await Categories.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            await category.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Error deleting category' });
        }
    }
};