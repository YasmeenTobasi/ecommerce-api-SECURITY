const pool = require('../config/database');

const getAllCategories = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const query = 'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *';
        const values = [name, description || null];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ error: 'Category name already exists' });
        }
        next(error);
    }
};

module.exports = {
    getAllCategories,
    createCategory
};