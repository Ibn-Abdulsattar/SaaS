import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ChecklistSection } from "./ChecklistSection";
import { COLUMNS, priorityColor } from "../utils/taskUtils";

export function TaskDetailDialog({ task, checklist, onClose, onToggleChecklist }) {
  if (!task) return null;

  const col = COLUMNS.find((c) => c.key === task.status);
  const pc = priorityColor(task.priority);

  return (
    <Dialog open={!!task} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Task Detail
        <span
          style={{ cursor: "pointer", color: "#94a3b8", fontSize: 20 }}
          onClick={onClose}
        >
          ×
        </span>
      </DialogTitle>

      <DialogContent sx={{ pt: "8px !important" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Title + description */}
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>
              {task.title}
            </p>
            {task.description && (
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                {task.description}
              </p>
            )}
          </div>

          {/* Status + priority badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "3px 12px",
                borderRadius: 20,
                fontSize: "0.78rem",
                fontWeight: 500,
                background: col?.bg,
                color: col?.color,
              }}
            >
              {task.status.replace("_", " ")}
            </span>
            <span
              style={{
                padding: "3px 12px",
                borderRadius: 20,
                fontSize: "0.78rem",
                fontWeight: 500,
                background: pc.bg,
                color: pc.color,
              }}
            >
              {task.priority}
            </span>
          </div>

          {/* Dates */}
          {task.due_date && (
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}>
              <b>Due:</b> {new Date(task.due_date).toLocaleDateString()}
            </p>
          )}
          {task.startDate && (
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}>
              <b>Started:</b> {new Date(task.startDate).toLocaleDateString()}
            </p>
          )}

          <ChecklistSection
            taskId={task.id}
            checklist={checklist}
            onToggle={onToggleChecklist}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}