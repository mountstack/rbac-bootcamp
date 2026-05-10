const express = require('express');
require('dotenv').config();
const cors = require('cors'); 
const colors = require('colors');
const connectDB = require('./config/dbConnection');
const ErrorHandler = require('./utils/ErrorHandler');
const errorMiddleware = require('./utils/errorMiddleware'); 

// Import Routes
const userRoutes = require('./routes/user'); 
const authRoutes = require('./routes/auth'); 
const roleRoutes = require('./routes/role'); 
const permissionRoutes = require('./routes/permission'); 

// Enable colors
colors.enable();

// Create Express app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Mount Routes
app.use('/api/user', userRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/role', roleRoutes); 
app.use('/api/permission', permissionRoutes); 

// Basic route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'App is healthy!'
    });
}); 

// Non-Standard Routes 
app.use(function (req, res, next) {
    next(ErrorHandler.notFound('Route Not Found'));
});

// Error Handling Middleware 
// Only use production error middleware if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.use(errorMiddleware);
}

const PORT = process.env.PORT || 8000;

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`.yellow.bold);
        });
    }
    catch (error) {
        console.error(`Error starting server: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};

startServer(); 

module.exports = app; 