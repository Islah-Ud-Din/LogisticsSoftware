require('dotenv').config();

const express = require('express');
const { console } = require('inspector');

// Db
const { DbConnection } = require('./routes/db.js');

const app = express();
// --------------------------------------------------------------------------------------------------------------------
// Middleware
// --------------------------------------------------------------------------------------------------------------------
const corsMiddleware = require('./middleware/corsMiddleware');
const customMiddle = require('./middleware/customMiddleware');

// Apply Middlewares
app.use(corsMiddleware);
app.use(customMiddle);
app.use(express.json());

// Call the DB connection
DbConnection();


/*-------------------------------------------------------------------
   Login and Registration API
--------------------------------------------------------------------*/
const LoginRoutes = require('./routes/login');
app.use('/api', LoginRoutes);


/*-------------------------------------------------------------------
    Sales Stats
--------------------------------------------------------------------*/

const SaleRoutes = require('./routes/sale.js');
app.use('/api', SaleRoutes);


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
