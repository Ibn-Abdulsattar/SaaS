import React from "react";
import { FolderOpen } from "@mui/icons-material";

export function ProjectsEmptyState({ admin, onCreateClick }) {
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
      <FolderOpen sx={{ fontSize: 48, color: "#94a3b8" }} />
      <p style={{ color: "#64748b", marginTop: 12 }}>No projects yet</p>
      {admin && (
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
          Create your first project
        </button>
      )}
    </div>
  );
}