import {app} from "./app.js";
import { connectDB } from "./config/db.js";
import { startCronJobs, stopCronJobs } from "./services/cronJob.js";
import { EventEmitter } from "events";
import { initSocket } from "./socket/index.js";
import {createServer} from "node:http";
const server = createServer(app);
EventEmitter.defaultMaxListeners = 20;

const PORT = app.get('PORT');

async function startApp() {
  try {
    await connectDB();
    initSocket(server);

    server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
    console.log("CORS Origin:", process.env.FRONTEND_URL);
    // startCronJobs();
  } catch (err) {
    console.error("💥 Shutdown: DB connection failed", err);
    process.exit(1);
    // stopCronJobs();
  }
}

startApp();
