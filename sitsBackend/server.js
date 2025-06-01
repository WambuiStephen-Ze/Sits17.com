// backend/server.js
import dotenv from 'dotenv';
import {sequelize, connectDB}  from './config/db.js';
import app from './app.js';

dotenv.config(); 
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();          
    await sequelize.sync();     
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); 
  }
};

startServer();