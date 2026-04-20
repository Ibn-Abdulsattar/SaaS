import React from "react";
import { Groups } from "@mui/icons-material";

export function TeamsEmptyState({ manage, onCreateClick }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 0",
        background: "#fff",
        borderRadius: 12,
        border: "1px dashed #cbd5e1",
      }}
    >
      <Groups sx={{ fontSize: 48, color: "#94a3b8" }} />
      <p style={{ color: "#64748b", marginTop: 12 }}>No teams yet</p>
      {manage && (
        <button
          onClick={onCreateClick}
          style={{
            marginTop: 12,
            padding: "9px 22px",
            borderRadius: 8,
            border: "1px solid #3b82f6",
            background: "#fff",
            color: "#3b82f6",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Create your first team
        </button>
      )}
    </div>
  );
}