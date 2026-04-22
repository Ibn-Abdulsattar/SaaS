import { Server } from "socket.io";
import { subClient } from "../config/redis.js";
import dotenv from "dotenv";
dotenv.config();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join_project", (projectId) => {
      socket.join(`project_${projectId}`);
    });

    socket.on("join_team", (teamId) => {
      socket.join(`team_${teamId}`);
    });

    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
    });
  });

  subClient.subscribe("TASK_CREATED", (message) => {
    const data = JSON.parse(message);
    io.to(`project_${data.projectId}`).emit("TASK_CREATED", data);

    (data.assigned_to || []).forEach((userId) => {
      io.to(`user_${userId}`).emit("TASK_CREATED", data);
    });
  });

  subClient.subscribe("TASK_UPDATED", (message) => {
    const data = JSON.parse(message);
    io.to(`project_${data.projectId}`).emit("TASK_UPDATED", data);

    (data.assigned_to || []).forEach((userId) => {
      io.to(`user_${userId}`).emit("TASK_UPDATED", data);
    });
  });

  subClient.subscribe("TASK_STATUS_CHANGED", (message) => {
    const data = JSON.parse(message);
    io.to(`project_${data.projectId}`).emit("TASK_STATUS_CHANGED", data);

    (data.assigned_to || []).forEach((userId) => {
      io.to(`user_${userId}`).emit("TASK_STATUS_CHANGED", data);
    });
  });

  subClient.subscribe("TASK_DELETED", (message) => {
    const data = JSON.parse(message);
    io.to(`project_${data.projectId}`).emit("TASK_DELETED", data);

    (data.assigned_to || []).forEach((userId) => {
      io.to(`user_${userId}`).emit("TASK_DELETED", data);
    });
  });

  subClient.subscribe("TEAM_MEMBER_ADDED", (message) => {
    const data = JSON.parse(message);
    io.to(`project_${data.teamId}`).emit("TEAM_MEMBER_ADDED", data);
  });

  return io;
};
