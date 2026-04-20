import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export function CreateTeamDialog({ open, onClose, newTeam, setNewTeam, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Create New Team</DialogTitle>
      <DialogContent
        sx={{
          pt: "12px !important",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Team Name"
          fullWidth
          size="small"
          required
          value={newTeam.name}
          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          size="small"
          value={newTeam.description}
          onChange={(e) =>
            setNewTeam({ ...newTeam, description: e.target.value })
          }
        />
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
          onClick={onSubmit}
          disabled={!newTeam.name.trim()}
          style={{
            padding: "8px 18px",
            borderRadius: 7,
            border: "none",
            background: newTeam.name.trim() ? "#3b82f6" : "#93c5fd",
            color: "#fff",
            cursor: newTeam.name.trim() ? "pointer" : "not-allowed",
            fontWeight: 600,
          }}
        >
          Create Team
        </button>
      </DialogActions>
    </Dialog>
  );
}