const express = require('express');
const router = express.Router();

// DB Connection
const { pool } = require('./db.js');

// --------------------------------------------------------------------------------------------------------------------
// Add a new sale
// --------------------------------------------------------------------------------------------------------------------
router.post('/api/sales', async (req, res) => {
    const { customerName, productId, quantity, price, date } = req.body;

    if (!customerName || !productId || !quantity || !price || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Insert into sales table
        const result = await pool.query(
            `INSERT INTO sales (customer_name, product_id, quantity, price, sale_date)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [customerName, productId, quantity, price, date]
        );

        res.status(201).json({
            message: 'Sale recorded successfully',
            sale: result.rows[0],
        });
    } catch (error) {
        console.error('Error adding sale:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------
// AGet all sales
// --------------------------------------------------------------------------------------------------------------------
router.get('/api/sales', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.*, p.name AS product_name
             FROM sales s
             JOIN products p ON s.product_id = p.id
             ORDER BY sale_date DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching sales:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});
// --------------------------------------------------------------------------------------------------------------------
// Get a sale by ID
// --------------------------------------------------------------------------------------------------------------------
router.get('/api/sales/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`SELECT * FROM sales WHERE id = $1`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching sale:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------
// Update a sale
// --------------------------------------------------------------------------------------------------------------------
router.put('/api/sales/:id', async (req, res) => {
    const { id } = req.params;
    const { customerName, productId, quantity, price, date } = req.body;

    try {
        const result = await pool.query(
            `UPDATE sales
             SET customer_name = $1, product_id = $2, quantity = $3, price = $4, sale_date = $5
             WHERE id = $6
             RETURNING *`,
            [customerName, productId, quantity, price, date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json({
            message: 'Sale updated successfully',
            sale: result.rows[0],
        });
    } catch (error) {
        console.error('Error updating sale:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});
// --------------------------------------------------------------------------------------------------------------------
// Delete a sale
// --------------------------------------------------------------------------------------------------------------------
router.delete('/api/sales/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`DELETE FROM sales WHERE id = $1 RETURNING *`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Error deleting sale:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
