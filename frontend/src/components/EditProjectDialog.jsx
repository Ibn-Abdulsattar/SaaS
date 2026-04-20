import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from "@mui/material";

export function EditProjectDialog({ open, onClose, editData, setEditData, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Edit Project</DialogTitle>
      <DialogContent sx={{ pt: "12px !important", display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Project Title"
          fullWidth
          size="small"
          required
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          size="small"
          multiline
          rows={3}
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
        />
        <TextField
          label="Deadline"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={editData.deadline}
          onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
        />
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
          style={{ padding: "8px 18px", borderRadius: 7, border: "none", background: "#3b82f6", color: "#fff", cursor: "pointer", fontWeight: 600 }}
        >
          Save Changes
        </button>
      </DialogActions>
    </Dialog>
  );
}