import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Avatar,
  Chip,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Search,
  CheckBoxOutlineBlank,
  CheckBox,
  Edit,
  Delete,
  PlayArrow,
} from "@mui/icons-material";
import { allUsers } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const roleOf = (user) => user?.role ?? "user";
const canManage = (role) => role === "admin" || role === "manager";

const STATUS_OPTIONS = ["pending", "in_progress", "completed"];
const PRIORITY_OPTIONS = ["low", "medium", "high"];

const COLUMNS = [
  { key: "pending", label: "Pending", color: "#64748b", bg: "#f1f5f9" },
  { key: "in_progress", label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
  { key: "completed", label: "Completed", color: "#16a34a", bg: "#dcfce7" },
];

const priorityColor = (p) => {
  if (p === "high") return { bg: "#fee2e2", color: "#dc2626" };
  if (p === "medium") return { bg: "#fef9c3", color: "#ca8a04" };
  return { bg: "#f0fdf4", color: "#16a34a" };
};

const avatarColor = (name = "") => {
  const colors = [
    "#4f46e5",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
    "#7c3aed",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

/* ── Checklist Section ── */
const ChecklistSection = ({ taskId, checklist, onToggle }) => {
  return (
    <div style={{ marginTop: 12 }}>
      <p
        style={{
          margin: "0 0 8px",
          fontWeight: 600,
          fontSize: "0.82rem",
          color: "#374151",
        }}
      >
        Checklist ({checklist.filter((i) => i.isCompeleted).length}/{checklist.length})
      </p>
      {checklist.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
          No checklist items
        </p>
      ) : (
        checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggle(taskId, item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 0",
              cursor: "pointer",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {item.isCompeleted ? (
              <CheckBox sx={{ fontSize: 17, color: "#3b82f6" }} />
            ) : (
              <CheckBoxOutlineBlank sx={{ fontSize: 17, color: "#94a3b8" }} />
            )}
            <span
              style={{
                fontSize: "0.82rem",
                color: item.isCompeleted ? "#94a3b8" : "#374151",
                textDecoration: item.isCompeleted ? "line-through" : "none",
              }}
            >
              {item.title}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

/* ── Task Form Dialog ── */
const TaskFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  allUsersList,
  mode,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: [],
    status: "pending",
    priority: "medium",
    due_date: "",
    checklist_template: [],
  });
  const [checklistInput, setChecklistInput] = useState("");
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setForm({
          title: initialData.title || "",
          description: initialData.description || "",
          assigned_to: initialData.assigned_to || [],
          status: initialData.status || "pending",
          priority: initialData.priority || "medium",
          due_date: initialData.due_date
            ? initialData.due_date.split("T")[0]
            : "",
          checklist_template: [],
        });
      } else {
        setForm({
          title: "",
          description: "",
          assigned_to: [],
          status: "pending",
          priority: "medium",
          due_date: "",
          checklist_template: [],
        });
      }
      setChecklistInput("");
      setUserSearch("");
    }
  }, [open, mode, initialData]);

  const filteredUsers = (allUsersList || []).filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const toggleUser = (id) =>
    setForm((f) => ({
      ...f,
      assigned_to: f.assigned_to.includes(id)
        ? f.assigned_to.filter((u) => u !== id)
        : [...f.assigned_to, id],
    }));

  const addChecklist = () => {
    const item = checklistInput.trim();
    if (!item) return;
    setForm((f) => ({
      ...f,
      checklist_template: [...f.checklist_template, item],
    }));
    setChecklistInput("");
  };

  const removeChecklist = (i) =>
    setForm((f) => ({
      ...f,
      checklist_template: f.checklist_template.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.assigned_to.length)
      return toast.error("Assign at least one user");
    if (!form.due_date) return toast.error("Due date is required");
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>
        {mode === "edit" ? "Edit Task" : "Create New Task"}
      </DialogTitle>
      <DialogContent
        sx={{
          pt: "12px !important",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Title"
          fullWidth
          size="small"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          size="small"
          multiline
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={form.priority}
              label="Priority"
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <TextField
          label="Due Date"
          type="date"
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
        />

        <div>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Assign Users *
          </p>
          <TextField
            fullWidth
            size="small"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 16, color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />
          <div
            style={{
              maxHeight: 160,
              overflowY: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
            }}
          >
            {filteredUsers.map((u) => {
              const uid = u.user_id || u.id;
              const selected = form.assigned_to.includes(uid);
              return (
                <div
                  key={uid}
                  onClick={() => toggleUser(uid)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 12px",
                    cursor: "pointer",
                    background: selected ? "#eff6ff" : "#fff",
                    borderBottom: "1px solid #f8fafc",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 26,
                      height: 26,
                      fontSize: 11,
                      bgcolor: avatarColor(u.name || ""),
                    }}
                  >
                    {(u.name || "U")[0].toUpperCase()}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                      {u.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginLeft: 6,
                      }}
                    >
                      {u.email}
                    </span>
                  </div>
                  <Checkbox
                    checked={selected}
                    size="small"
                    sx={{ p: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleUser(uid)}
                  />
                </div>
              );
            })}
          </div>
          {form.assigned_to.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginTop: 8,
              }}
            >
              {form.assigned_to.map((id) => {
                const u = (allUsersList || []).find(
                  (u) => (u.user_id || u.id) === id,
                );
                return u ? (
                  <Chip
                    key={id}
                    label={u.name}
                    size="small"
                    onDelete={() => toggleUser(id)}
                  />
                ) : null;
              })}
            </div>
          )}
        </div>

        {mode !== "edit" && (
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Checklist (optional)
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Add item..."
                value={checklistInput}
                onChange={(e) => setChecklistInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChecklist()}
              />
              <button
                onClick={addChecklist}
                style={{
                  padding: "0 14px",
                  borderRadius: 7,
                  border: "none",
                  background: "#3b82f6",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Add
              </button>
            </div>
            {form.checklist_template.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {form.checklist_template.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 10px",
                      background: "#f8fafc",
                      borderRadius: 6,
                      fontSize: "0.82rem",
                    }}
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => removeChecklist(i)}
                      style={{
                        border: "none",
                        background: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <button
          onClick={onClose}
          style={{
            padding: "8px 18px",
            borderRadius: 7,
            border: "1px solid #e2e8f0",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: "8px 18px",
            borderRadius: 7,
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {mode === "edit" ? "Save Changes" : "Create Task"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

/* ── Task Card ── */
const TaskCard = ({
  task,
  manage,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onStartTask,
}) => {
  const pc = priorityColor(task.priority);
  const isStartable = task.status === "pending";

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: "0.88rem",
            color: "#0f172a",
            flex: 1,
            paddingRight: 8,
          }}
        >
          {task.title}
        </p>
        <span
          style={{
            padding: "2px 9px",
            borderRadius: 20,
            fontSize: "0.72rem",
            fontWeight: 500,
            background: pc.bg,
            color: pc.color,
            flexShrink: 0,
          }}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "0.78rem",
            color: "#64748b",
            lineHeight: 1.4,
          }}
        >
          {task.description.substring(0, 80)}
          {task.description.length > 80 ? "…" : ""}
        </p>
      )}

      {task.due_date && (
        <p
          style={{
            margin: "0 0 6px",
            fontSize: "0.75rem",
            color: task.isOverDue ? "#dc2626" : "#64748b",
          }}
        >
          Due: {new Date(task.due_date).toLocaleDateString()}
          {task.isOverDue ? " · Overdue" : ""}
        </p>
      )}

      {/* Show startDate on in_progress and completed cards */}
      {task.startDate && (
        <p
          style={{ margin: "0 0 10px", fontSize: "0.75rem", color: "#64748b" }}
        >
          Started: {new Date(task.startDate).toLocaleDateString()}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
          style={{
            fontSize: "0.75rem",
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            cursor: "pointer",
            color: "#374151",
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        {isStartable && (
          <button
            onClick={() => onStartTask(task)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <PlayArrow sx={{ fontSize: 13 }} /> Start
          </button>
        )}

        <div style={{ flex: 1 }} />

        <button
          onClick={() => onView(task)}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            background: "#fff",
            cursor: "pointer",
            fontSize: "0.75rem",
            color: "#374151",
          }}
        >
          View
        </button>

        {manage && (
          <>
            <button
              onClick={() => onEdit(task)}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Edit sx={{ fontSize: 13, color: "#3b82f6" }} />
            </button>
            <button
              onClick={() => onDelete(task)}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #fee2e2",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Delete sx={{ fontSize: 13, color: "#dc2626" }} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Main TaskPage ── */
export default function TaskPage() {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { user, allUsers: users } = useSelector((s) => s.auth);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [checklist, setChecklist] = useState([]);

  const role = roleOf(user);
  const manage = canManage(role);

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

  const handleCreate = async (form) => {
    try {
      await axios.post(`${API_URL}/project/${projectId}/tasks`, form, {
        withCredentials: true,
      });
      toast.success("Task created");
      setFormOpen(false);
      fetchTasks();
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
      toast.success("Task updated");
      setEditTask(null);
      fetchTasks();
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
      toast.success("Task deleted");
      fetchTasks();
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
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: newStatus, startDate } : t,
        ),
      );
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
        {isCompeleted: !checklist.find((i) => i.id === itemId)?.isCompeleted},
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

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        padding: "24px 28px",
        maxWidth: 1300,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {projectId ? "Project Tasks" : "My Tasks"}
          </h1>
          <p
            style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.85rem" }}
          >
            {tasks.length} tasks total
          </p>
        </div>
        {manage && projectId && (
          <button
            onClick={() => setFormOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              borderRadius: 8,
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            <Add sx={{ fontSize: 17 }} /> New Task
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <CircularProgress />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {COLUMNS.map((col) => {
            const colTasks = tasksByStatus(col.key);
            return (
              <div
                key={col.key}
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: 14,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: col.color,
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#0f172a",
                    }}
                  >
                    {col.label}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      background: col.bg,
                      color: col.color,
                      borderRadius: 20,
                      padding: "2px 9px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {colTasks.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "0.8rem",
                      padding: "20px 0",
                    }}
                  >
                    No tasks
                  </p>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      manage={manage}
                      onView={openDetail}
                      onEdit={setEditTask}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      onStartTask={handleStartTask}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {manage && (
        <TaskFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreate}
          allUsersList={users}
          mode="create"
        />
      )}

      {manage && (
        <TaskFormDialog
          open={!!editTask}
          onClose={() => setEditTask(null)}
          onSubmit={handleUpdate}
          initialData={editTask}
          allUsersList={users}
          mode="edit"
        />
      )}

      <Dialog
        open={!!detailTask}
        onClose={() => setDetailTask(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Task Detail
          <span
            style={{ cursor: "pointer", color: "#94a3b8", fontSize: 20 }}
            onClick={() => setDetailTask(null)}
          >
            ×
          </span>
        </DialogTitle>
        <DialogContent sx={{ pt: "8px !important" }}>
          {detailTask && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#0f172a",
                  }}
                >
                  {detailTask.title}
                </p>
                {detailTask.description && (
                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#64748b",
                      fontSize: "0.85rem",
                    }}
                  >
                    {detailTask.description}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(() => {
                  const col = COLUMNS.find((c) => c.key === detailTask.status);
                  return (
                    <span
                      style={{
                        padding: "3px 12px",
                        borderRadius: 20,
                        fontSize: "0.78rem",
                        fontWeight: 500,
                        background: col?.bg,
                        color: col?.color,
                      }}
                    >
                      {detailTask.status.replace("_", " ")}
                    </span>
                  );
                })()}
                {(() => {
                  const pc = priorityColor(detailTask.priority);
                  return (
                    <span
                      style={{
                        padding: "3px 12px",
                        borderRadius: 20,
                        fontSize: "0.78rem",
                        fontWeight: 500,
                        background: pc.bg,
                        color: pc.color,
                      }}
                    >
                      {detailTask.priority}
                    </span>
                  );
                })()}
              </div>

              {detailTask.due_date && (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}>
                  <b>Due:</b>{" "}
                  {new Date(detailTask.due_date).toLocaleDateString()}
                </p>
              )}
              {detailTask.startDate && (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}>
                  <b>Started:</b>{" "}
                  {new Date(detailTask.startDate).toLocaleDateString()}
                </p>
              )}

              <ChecklistSection
                taskId={detailTask.id}
                checklist={checklist}
                onToggle={handleToggleChecklist}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
