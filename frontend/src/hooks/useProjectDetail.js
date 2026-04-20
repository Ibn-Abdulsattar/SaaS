import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchTeamMembers } from "../redux/slices/teamSlice";
import socket from "../utils/socket";
import { API_URL, EMPTY_TASK_FORM } from "../utils/projectDetailUtils";

export function useProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTeamMembers } = useSelector((s) => s.team);

  // Project + tasks
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Task dialog
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Task row menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Checklist dialog
  const [openChecklistDialog, setOpenChecklistDialog] = useState(false);
  const [checklistTask, setChecklistTask] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  // ── Data fetching
  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/project/${id}`, { withCredentials: true }),
        axios.get(`${API_URL}/project/${id}/tasks`, { withCredentials: true }),
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
    } catch {
      toast.error("Failed to load project details");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjectData(); }, [id]);

  // ── Socket
  useEffect(() => {
    if (!project?.id) return;

    socket.emit("join_project", project.id);

    socket.on("TASK_CREATED", (task) => {
      if ((task.projectId ?? task.project_id) !== project.id) return;
      setTasks((prev) => [...prev, task]);
    });

    socket.on("TASK_UPDATED", (updatedTask) => {
      if ((updatedTask.projectId ?? updatedTask.project_id) !== project.id) return;
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    });

    socket.on("TASK_STATUS_CHANGED", (task) => {
      if ((task.projectId ?? task.project_id) !== project.id) return;
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    });

    return () => {
      socket.off("TASK_CREATED");
      socket.off("TASK_UPDATED");
      socket.off("TASK_STATUS_CHANGED");
    };
  }, [project?.id]);

  // ── Task form helpers
  const resetTaskForm = () => {
    setTaskForm(EMPTY_TASK_FORM);
    setEditingTask(null);
    setSelectedUsers([]);
  };

  const handleAddTaskBtn = async (teamId) => {
    setOpenTaskDialog(true);
    await dispatch(fetchTeamMembers(teamId));
  };

  const handleEditBtn = async (teamId) => {
    openEditDialog(selectedTask);
    await dispatch(fetchTeamMembers(teamId));
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      due_date: task.due_date.split("T")[0],
      priority: task.priority,
      assigned_to: task.assigned_users?.map((u) => u.user_id) || [],
    });
    setSelectedUsers(task.assigned_users?.map((u) => u.user_id) || []);
    setOpenTaskDialog(true);
    handleMenuClose();
  };

  // ── Task CRUD 
  const handleCreateTask = async () => {
    try {
      await axios.post(
        `${API_URL}/project/${id}/tasks`,
        { ...taskForm, assigned_to: selectedUsers },
        { withCredentials: true },
      );
      await fetchProjectData();
      setOpenTaskDialog(false);
      resetTaskForm();
      toast.success("Task created successfully");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async () => {
    try {
      await axios.put(
        `${API_URL}/project/${id}/tasks/${editingTask.id}`,
        { ...taskForm, assigned_to: selectedUsers },
        { withCredentials: true },
      );
      await fetchProjectData();
      setOpenTaskDialog(false);
      resetTaskForm();
      toast.success("Task updated successfully");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/project/${id}/tasks/${taskId}`, {
        withCredentials: true,
      });
      await fetchProjectData();
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    }
    handleMenuClose();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/project/${id}/tasks/${taskId}`,
        { status: newStatus },
        { withCredentials: true },
      );
      await fetchProjectData();
      toast.success("Task status updated");
    } catch {
      toast.error("Failed to update task status");
    }
  };

  // ── Task row menu 
  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  // ── Checklist
  const handleOpenChecklist = async (task) => {
    handleMenuClose();
    setChecklistTask(task);
    setOpenChecklistDialog(true);
    setChecklistLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/project/${id}/tasks/${task.id}/checklists`,
        { withCredentials: true },
      );
      setChecklists(res.data.data || []);
    } catch {
      toast.error("Failed to load checklist");
    } finally {
      setChecklistLoading(false);
    }
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;
    setAddingItem(true);
    try {
      const res = await axios.post(
        `${API_URL}/project/${id}/tasks/${checklistTask.id}/checklists`,
        { title: newChecklistItem.trim() },
        { withCredentials: true },
      );
      setChecklists((prev) => [...prev, res.data.data]);
      setNewChecklistItem("");
      toast.success("Checklist item added");
    } catch {
      toast.error("Failed to add checklist item");
    } finally {
      setAddingItem(false);
    }
  };

  const handleToggleChecklistItem = async (item) => {
    try {
      const res = await axios.put(
        `${API_URL}/project/${id}/tasks/${checklistTask.id}/checklists/${item.id}`,
        { isCompeleted: !item.isCompeleted },
        { withCredentials: true },
      );
      setChecklists((prev) => prev.map((c) => (c.id === item.id ? res.data.data : c)));
    } catch {
      toast.error("Failed to update checklist item");
    }
  };

  const handleDeleteChecklistItem = async (itemId) => {
    try {
      await axios.delete(
        `${API_URL}/project/${id}/tasks/${checklistTask.id}/checklists/${itemId}`,
        { withCredentials: true },
      );
      setChecklists((prev) => prev.filter((c) => c.id !== itemId));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to delete checklist item");
    }
  };

  const handleCloseChecklistDialog = () => {
    setOpenChecklistDialog(false);
    setChecklistTask(null);
    setChecklists([]);
    setNewChecklistItem("");
  };

  return {
    // Data
    id,
    project,
    tasks,
    loading,
    currentTeamMembers,
    // Task dialog
    openTaskDialog,
    setOpenTaskDialog,
    editingTask,
    taskForm,
    setTaskForm,
    selectedUsers,
    setSelectedUsers,
    resetTaskForm,
    handleAddTaskBtn,
    handleEditBtn,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleStatusChange,
    // Row menu
    anchorEl,
    selectedTask,
    handleMenuOpen,
    handleMenuClose,
    // Checklist dialog
    openChecklistDialog,
    checklistTask,
    checklists,
    checklistLoading,
    newChecklistItem,
    setNewChecklistItem,
    addingItem,
    handleOpenChecklist,
    handleAddChecklistItem,
    handleToggleChecklistItem,
    handleDeleteChecklistItem,
    handleCloseChecklistDialog,
  };
}