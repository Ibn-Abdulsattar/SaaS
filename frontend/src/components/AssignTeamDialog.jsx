import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from "@mui/material";
import { avatarColor } from "../utils/projectUtils";

export function AssignTeamDialog({
  open,
  onClose,
  selectedProject,
  teams,
  selectedTeamId,
  setSelectedTeamId,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Assign Team — {selectedProject?.title}
      </DialogTitle>
      <DialogContent sx={{ pt: "12px !important" }}>
        {teams.length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", padding: "16px 0" }}>
            No teams available
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  border: "1px solid",
                  borderRadius: 8,
                  cursor: "pointer",
                  borderColor: selectedTeamId === team.id ? "#bfdbfe" : "#e2e8f0",
                  background: selectedTeamId === team.id ? "#eff6ff" : "#fff",
                }}
              >
                <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: avatarColor(team.name || "") }}>
                  {(team.name || "T")[0].toUpperCase()}
                </Avatar>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{team.name}</div>
                  {team.description && (
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{team.description}</div>
                  )}
                </div>
              </div>
            ))}
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
          onClick={onSubmit}
          disabled={!selectedTeamId}
          style={{
            padding: "8px 18px", borderRadius: 7, border: "none",
            background: selectedTeamId ? "#3b82f6" : "#93c5fd",
            color: "#fff", cursor: selectedTeamId ? "pointer" : "not-allowed", fontWeight: 600,
          }}
        >
          Assign Team
        </button>
      </DialogActions>
    </Dialog>
  );
}