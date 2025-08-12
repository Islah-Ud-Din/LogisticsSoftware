const express = require('express');
const router = express.Router();

// DB Connection
const { pool } = require('./db.js');

// --------------------------------------------------------------------------------------------------------------------
// Get all orders
// --------------------------------------------------------------------------------------------------------------------
router.get('/orders', async (req, res) => {
    try {
        const connection = await pool();
        const [rows] = await connection.execute(`
            SELECT
                o.id,
                o.customer_name,
                o.customer_email,
                o.customer_phone,
                o.total_amount,
                o.status,
                o.order_date,
                o.delivery_address,
                o.special_instructions,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', oi.menu_item_id,
                        'name', mi.name,
                        'quantity', oi.quantity,
                        'price', oi.price
                    )
                ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            GROUP BY o.id
            ORDER BY o.order_date DESC
        `);

        connection.end();
        res.json({ success: true, orders: rows });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
});

// --------------------------------------------------------------------------------------------------------------------
// Get order by ID
// --------------------------------------------------------------------------------------------------------------------
router.get('/orders/:id', async (req, res) => {
    try {
        const connection = await pool();
        const [rows] = await connection.execute(
            `
            SELECT
                o.id,
                o.customer_name,
                o.customer_email,
                o.customer_phone,
                o.total_amount,
                o.status,
                o.order_date,
                o.delivery_address,
                o.special_instructions,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', oi.menu_item_id,
                        'name', mi.name,
                        'quantity', oi.quantity,
                        'price', oi.price
                    )
                ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE o.id = ?
            GROUP BY o.id
        `,
            [req.params.id]
        );

        connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order: rows[0] });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch order' });
    }
});

// --------------------------------------------------------------------------------------------------------------------
// Create new order
// --------------------------------------------------------------------------------------------------------------------
router.post('/orders', async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, items, deliveryAddress, specialInstructions } = req.body;

        if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        const connection = await pool();

        // Calculate total
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Insert order
        const [orderResult] = await connection.execute(
            `
            INSERT INTO orders (
                customer_name,
                customer_email,
                customer_phone,
                total_amount,
                status,
                delivery_address,
                special_instructions
            ) VALUES (?, ?, ?, ?, 'pending', ?, ?)
        `,
            [customerName, customerEmail, customerPhone, total, deliveryAddress, specialInstructions]
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            await connection.execute(
                `
                INSERT INTO order_items (order_id, menu_item_id, quantity, price)
                VALUES (?, ?, ?, ?)
            `,
                [orderId, item.id, item.quantity, item.price]
            );
        }

        connection.end();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId: orderId,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

// --------------------------------------------------------------------------------------------------------------------
// Update order status
// --------------------------------------------------------------------------------------------------------------------
router.patch('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
            });
        }

        const connection = await pool();
        const [result] = await connection.execute(
            `
            UPDATE orders SET status = ? WHERE id = ?
        `,
            [status, orderId]
        );

        connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
});

// --------------------------------------------------------------------------------------------------------------------
// Update order
// --------------------------------------------------------------------------------------------------------------------
router.put('/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const { customerName, customerEmail, customerPhone, items, deliveryAddress, specialInstructions } = req.body;

        const connection = await pool();

        // Calculate total
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Update order
        const [orderResult] = await connection.execute(
            `
            UPDATE orders SET
                customer_name = ?,
                customer_email = ?,
                customer_phone = ?,
                total_amount = ?,
                delivery_address = ?,
                special_instructions = ?
            WHERE id = ?
        `,
            [customerName, customerEmail, customerPhone, total, deliveryAddress, specialInstructions, orderId]
        );

        if (orderResult.affectedRows === 0) {
            connection.end();
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Delete existing order items
        await connection.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);

        // Insert new order items
        for (const item of items) {
            await connection.execute(
                `
                INSERT INTO order_items (order_id, menu_item_id, quantity, price)
                VALUES (?, ?, ?, ?)
            `,
                [orderId, item.id, item.quantity, item.price]
            );
        }

        connection.end();

        res.json({ success: true, message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, message: 'Failed to update order' });
    }
});

// --------------------------------------------------------------------------------------------------------------------
// Delete order
// --------------------------------------------------------------------------------------------------------------------
router.delete('/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const connection = await pool();

        // Delete order items first (due to foreign key constraint)
        await connection.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);

        // Delete order
        const [result] = await connection.execute('DELETE FROM orders WHERE id = ?', [orderId]);

        connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ success: false, message: 'Failed to delete order' });
    }
});

// --------------------------------------------------------------------------------------------------------------------
// Get order statistics
// --------------------------------------------------------------------------------------------------------------------
router.get('/orders/stats/summary', async (req, res) => {
    try {
        const connection = await pool();

        // Get total orders
        const [totalOrders] = await connection.execute('SELECT COUNT(*) as count FROM orders');

        // Get orders by status
        const [statusCounts] = await connection.execute(`
            SELECT status, COUNT(*) as count
            FROM orders
            GROUP BY status
        `);

        // Get total revenue
        const [revenue] = await connection.execute(`
            SELECT SUM(total_amount) as total
            FROM orders
            WHERE status = 'delivered'
        `);

        // Get today's orders
        const [todayOrders] = await connection.execute(`
            SELECT COUNT(*) as count
            FROM orders
            WHERE DATE(order_date) = CURDATE()
        `);

        // Get average order value
        const [avgOrder] = await connection.execute(`
            SELECT AVG(total_amount) as average
            FROM orders
        `);

        connection.end();

        res.json({
            success: true,
            stats: {
                totalOrders: totalOrders[0].count,
                statusCounts: statusCounts,
                totalRevenue: revenue[0].total || 0,
                todayOrders: todayOrders[0].count,
                averageOrderValue: avgOrder[0].average || 0,
            },
        });
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
    }
});

module.exports = router;
