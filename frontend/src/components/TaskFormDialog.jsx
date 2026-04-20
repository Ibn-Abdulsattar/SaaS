import React, { useState, useEffect } from "react";
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
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { toast } from "react-toastify";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, avatarColor } from "../utils/taskUtils";

export function TaskFormDialog({ open, onClose, onSubmit, initialData, allUsersList, mode }) {
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
    if (!open) return;
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        assigned_to: initialData.assigned_to || [],
        status: initialData.status || "pending",
        priority: initialData.priority || "medium",
        due_date: initialData.due_date ? initialData.due_date.split("T")[0] : "",
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
    setForm((f) => ({ ...f, checklist_template: [...f.checklist_template, item] }));
    setChecklistInput("");
  };

  const removeChecklist = (i) =>
    setForm((f) => ({
      ...f,
      checklist_template: f.checklist_template.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.assigned_to.length) return toast.error("Assign at least one user");
    if (!form.due_date) return toast.error("Due date is required");
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>
        {mode === "edit" ? "Edit Task" : "Create New Task"}
      </DialogTitle>

      <DialogContent sx={{ pt: "12px !important", display: "flex", flexDirection: "column", gap: 2 }}>
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{s.replace("_", " ")}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select value={form.priority} label="Priority" onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {PRIORITY_OPTIONS.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
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

        {/* User assignment */}
        <div>
          <p style={{ margin: "0 0 6px", fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
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
          <div style={{ maxHeight: 160, overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: 8 }}>
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
                  <Avatar sx={{ width: 26, height: 26, fontSize: 11, bgcolor: avatarColor(u.name || "") }}>
                    {(u.name || "U")[0].toUpperCase()}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>{u.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: 6 }}>{u.email}</span>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              {form.assigned_to.map((id) => {
                const u = (allUsersList || []).find((u) => (u.user_id || u.id) === id);
                return u ? (
                  <Chip key={id} label={u.name} size="small" onDelete={() => toggleUser(id)} />
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Checklist template (create only) */}
        {mode !== "edit" && (
          <div>
            <p style={{ margin: "0 0 6px", fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
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
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
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
                      style={{ border: "none", background: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16 }}
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
          style={{ padding: "8px 18px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 500 }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{ padding: "8px 18px", borderRadius: 7, border: "none", background: "#3b82f6", color: "#fff", cursor: "pointer", fontWeight: 600 }}
        >
          {mode === "edit" ? "Save Changes" : "Create Task"}
        </button>
      </DialogActions>
    </Dialog>
  );
}