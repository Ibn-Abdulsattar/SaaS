import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";

export function CreateProjectDialog({ open, onClose, newProject, setNewProject, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Create New Project</DialogTitle>
      <DialogContent sx={{ pt: "12px !important", display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Project Title"
          fullWidth
          size="small"
          required
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          size="small"
          multiline
          rows={3}
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        />
        <TextField
          label="Deadline"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={newProject.deadline}
          onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
        />
        <div>
          <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "#64748b" }}>
            Project Document (PDF)
          </p>
          <label
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 14px", border: "1px dashed #cbd5e1",
              borderRadius: 8, cursor: "pointer", color: "#374151", fontSize: "0.875rem",
            }}
          >
            <PictureAsPdf sx={{ fontSize: 18, color: "#dc2626" }} />
            {newProject.pdfFile ? newProject.pdfFile.name : "Upload PDF (optional)"}
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setNewProject({ ...newProject, pdfFile: e.target.files[0] })}
            />
          </label>
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <button
          onClick={onClose}
          style={{ padding: "8px 18px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 500 }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!newProject.title.trim()}
          style={{
            padding: "8px 18px", borderRadius: 7, border: "none",
            background: newProject.title.trim() ? "#3b82f6" : "#93c5fd",
            color: "#fff", cursor: newProject.title.trim() ? "pointer" : "not-allowed", fontWeight: 600,
          }}
        >
          Create
        </button>
      </DialogActions>
    </Dialog>
  );
}