import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, canManage, roleOf } from "../utils/taskUtils";
import { allUsers } from "../redux/slices/authSlice";
import socket from "../utils/socket";

export function useTaskPage() {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { user, allUsers: users } = useSelector((s) => s.auth);

  const role = roleOf(user);
  const manage = canManage(role);

  // Task state
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [checklist, setChecklist] = useState([]);

  // Data fetching
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      if (projectId) {
        const res = await axios.get(`${API_URL}/project/${projectId}/tasks`, {
          withCredentials: true,
        });
        setTasks(res.data.data || []);
      } else {
        const res = await axios.get(`${API_URL}/search/task`, {
          withCredentials: true,
        });
        setTasks(res.data.tasks || []);
      }
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  useEffect(() => {
    if (manage) dispatch(allUsers());
  }, [dispatch, manage]);

  // Socket
useEffect(() => {
  if (projectId) {
    socket.emit("join_project", projectId);
  } else if (user?.user_id) {
    socket.emit("join_user", user.user_id);
  }

  socket.on("TASK_CREATED", (task) => {
    if (projectId && (task.projectId ?? task.project_id) !== projectId) return;
    setTasks((prev) => [...prev, task]);
  });

  socket.on("TASK_UPDATED", (updatedTask) => {
    if (projectId && (updatedTask.projectId ?? updatedTask.project_id) !== projectId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
  });

  socket.on("TASK_STATUS_CHANGED", (task) => {
    if (projectId && (task.projectId ?? task.project_id) !== projectId) return;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  });

  socket.on("TASK_DELETED", (data) => {
    if (projectId && data.projectId !== projectId) return;
    setTasks((prev) => prev.filter((t) => t.id !== data.id));
  });

  return () => {
    socket.off("TASK_CREATED");
    socket.off("TASK_UPDATED");
    socket.off("TASK_STATUS_CHANGED");
    socket.off("TASK_DELETED");
  };
}, [projectId, user?.user_id]);

  const handleCreate = async (form) => {
    try {
      await axios.post(`${API_URL}/project/${projectId}/tasks`, form, {
        withCredentials: true,
      });
      fetchTasks();
      toast.success("Task created");
      setFormOpen(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdate = async (form) => {
    try {
      await axios.put(
        `${API_URL}/project/${editTask.project_id || projectId}/tasks/${editTask.id}`,
        form,
        { withCredentials: true },
      );
      fetchTasks();
      toast.success("Task updated");
      setEditTask(null);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(
        `${API_URL}/project/${task.project_id || projectId}/tasks/${task.id}`,
        { withCredentials: true },
      );
      fetchTasks();
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    if (task.status === newStatus) return;
    const startDate =
      newStatus === "in_progress" && !task.startDate
        ? new Date().toISOString()
        : task.startDate || null;
    try {
      await axios.patch(
        `${API_URL}/project/${task.project_id || projectId}/tasks/${task.id}/status`,
        { status: newStatus, startDate },
        { withCredentials: true },
      );
      fetchTasks();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleStartTask = (task) => handleStatusChange(task, "in_progress");

  const openDetail = async (task) => {
    setDetailTask(task);
    try {
      const res = await axios.get(
        `${API_URL}/project/${task.project_id || projectId}/tasks/${task.id}`,
        { withCredentials: true },
      );
      setChecklist(res.data?.data?.checklistItems || []);
    } catch {
      setChecklist([]);
    }
  };

  const handleToggleChecklist = async (taskId, itemId) => {
    try {
      const res = await axios.put(
        `${API_URL}/project/${detailTask.project_id || projectId}/tasks/${taskId}/checklists/${itemId}`,
        { isCompeleted: !checklist.find((i) => i.id === itemId)?.isCompeleted },
        { withCredentials: true },
      );
      setChecklist((prev) =>
        prev.map((i) => (i.id === itemId ? res.data.data : i)),
      );
    } catch {
      toast.error("Failed to toggle item");
    }
  };

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  return {
    // Meta
    projectId,
    manage,
    users,
    // Task data
    tasks,
    loading,
    tasksByStatus,
    // Dialog state
    formOpen,
    setFormOpen,
    editTask,
    setEditTask,
    detailTask,
    setDetailTask,
    checklist,
    // Handlers
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
    handleStartTask,
    openDetail,
    handleToggleChecklist,
  };
}
