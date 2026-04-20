import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { avatarColor } from "../utils/teamUtils";

export function ViewMembersDialog({
  open,
  onClose,
  selectedTeam,
  currentTeamMembers,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {selectedTeam?.name} — Members
        <Close
          sx={{ cursor: "pointer", color: "#94a3b8" }}
          onClick={onClose}
        />
      </DialogTitle>
      <DialogContent sx={{ pt: "8px !important" }}>
        {!currentTeamMembers.length ? (
          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              padding: "24px 0",
            }}
          >
            No members yet
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {currentTeamMembers.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: 14,
                    bgcolor: avatarColor(m.user.username || ""),
                  }}
                >
                  {(m.user.username || m.user.email || "U")[0].toUpperCase()}
                </Avatar>
                <div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "#0f172a",
                    }}
                  >
                    {m.user.username}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    {m.user.email}
                  </div>
                </div>
                <Chip
                  label={m.user.jobTitle || "user"}
                  size="small"
                  sx={{ ml: "auto" }}
                />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}