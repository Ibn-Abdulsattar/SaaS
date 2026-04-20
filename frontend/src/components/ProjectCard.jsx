import React, { useEffect, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  MoreVert,
  Delete,
  Edit,
  Visibility,
  PictureAsPdf,
  FolderOpen,
  GroupAdd,
} from "@mui/icons-material";
import socket from "../utils/socket";
import { isAdmin, canManage } from "../utils/projectUtils";

export function ProjectCard({ project, role, onView, onEdit, onDelete, onAssignTeam }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const admin = isAdmin(role);
  const manage = canManage(role);

  useEffect(() => {
    socket.emit("join_project", project.id);
  }, [project.id]);

  const closeMenu = () => setAnchorEl(null);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: "#3b82f6" }} />

      <div style={{ padding: 20, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Clickable info area */}
          <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onView(project)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "#eff6ff", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <FolderOpen sx={{ fontSize: 18, color: "#3b82f6" }} />
              </div>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#0f172a" }}>
                {project.title}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: "0.83rem", color: "#64748b", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {project.description || "No description provided"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "0.83rem", color: "#64748b" }}>
              Deadline: {project.deadline || "Not set"}
            </p>
          </div>

          {/* Context menu trigger */}
          {(admin || manage) && (
            <button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: "#94a3b8" }}
            >
              <MoreVert sx={{ fontSize: 18 }} />
            </button>
          )}
        </div>

        {/* PDF link */}
        {project.pdf && (
          <button
            onClick={(e) => { e.stopPropagation(); window.open(project.pdf, "_blank"); }}
            style={{
              marginTop: 12, display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 6, border: "1px solid #e2e8f0",
              background: "#fff", cursor: "pointer", fontSize: "0.8rem", color: "#374151",
            }}
          >
            <PictureAsPdf sx={{ fontSize: 15, color: "#dc2626" }} /> View Document
          </button>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 20px", borderTop: "1px solid #f1f5f9",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
          {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
        </span>
        <button
          onClick={() => onView(project)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, border: "none",
            background: "#eff6ff", color: "#3b82f6", fontSize: "0.8rem",
            fontWeight: 500, cursor: "pointer",
          }}
        >
          <Visibility sx={{ fontSize: 14 }} /> Open
        </button>
      </div>

      {/* Context menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => { onView(project); closeMenu(); }}>
          <Visibility sx={{ fontSize: 16, mr: 1 }} /> View Details
        </MenuItem>
        {admin && (
          <MenuItem onClick={() => { onEdit(project); closeMenu(); }}>
            <Edit sx={{ fontSize: 16, mr: 1 }} /> Edit Project
          </MenuItem>
        )}
        {(admin || manage) && (
          <MenuItem onClick={() => { onAssignTeam(project); closeMenu(); }}>
            <GroupAdd sx={{ fontSize: 16, mr: 1 }} /> Assign Team
          </MenuItem>
        )}
        {admin && (
          <MenuItem onClick={() => { onDelete(project.id); closeMenu(); }} sx={{ color: "#dc2626" }}>
            <Delete sx={{ fontSize: 16, mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}