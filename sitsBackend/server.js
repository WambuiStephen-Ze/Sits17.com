// backend/server.js
import dotenv from 'dotenv';
<<<<<<< HEAD
// import { }  from './models/index.js';
import { sequelize, connectDB } from './models/index.js';
=======
import {sequelize, connectDB}  from './config/db.js';
>>>>>>> 0cbaadcae15f56d7d23e4df7d75a52e74b14a243
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