import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  Avatar,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { avatarColor } from "../utils/teamUtils";

export function AddMembersDialog({
  open,
  onClose,
  selectedTeam,
  users,
  filteredUsers,
  selectedUsers,
  searchUser,
  setSearchUser,
  toggleUser,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>
        Add Members — {selectedTeam?.name}
      </DialogTitle>
      <DialogContent sx={{ pt: "12px !important" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          sx={{ mb: 1.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />
        <div
          style={{
            maxHeight: 320,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {filteredUsers.map((u) => {
            const uid = u.user_id || u.id;
            const selected = selectedUsers.includes(uid);
            return (
              <div
                key={uid}
                onClick={() => toggleUser(uid)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: selected ? "#bfdbfe" : "#f1f5f9",
                  background: selected ? "#eff6ff" : "#fff",
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: 14,
                    bgcolor: avatarColor(u.name || ""),
                  }}
                >
                  {(u.name || u.email || "U")[0].toUpperCase()}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "#0f172a",
                    }}
                  >
                    {u.username}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    {u.email}
                  </div>
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

        {selectedUsers.length > 0 && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {selectedUsers.map((id) => {
              const u = (users || []).find((u) => (u.user_id || u.id) === id);
              return u ? (
                <Chip
                  key={id}
                  label={u.username || u.name}
                  size="small"
                  onDelete={() => toggleUser(id)}
                />
              ) : null;
            })}
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
          onClick={onSubmit}
          disabled={!selectedUsers.length}
          style={{
            padding: "8px 18px",
            borderRadius: 7,
            border: "none",
            background: selectedUsers.length ? "#3b82f6" : "#93c5fd",
            color: "#fff",
            cursor: selectedUsers.length ? "pointer" : "not-allowed",
            fontWeight: 600,
          }}
        >
          Add {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
        </button>
      </DialogActions>
    </Dialog>
  );
}