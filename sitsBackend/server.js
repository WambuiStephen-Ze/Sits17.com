// server & Clustering entry point 
import cluster from 'cluster';
import os from 'os';
import app from './app.js';
import { connectDB } from './config/config.js';

const PORT = process.env.PORT || 3000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`🧠 Primary ${process.pid} is running`);
  console.log(`🔁 Spawning ${numCPUs} workers...`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // When a worker dies, log and respawn.
  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Respawning...`);
    cluster.fork();
  });

} else {
  // Worker processes run the Express app
  const startServer = async () => {
    try {
      await connectDB(); // Connect to MySQL
      app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT} (PID: ${process.pid})`);
      });
    } catch (err) {
      console.error('❌ Failed to start server:', err);
      process.exit(1);
    }
  };

  startServer();
}
