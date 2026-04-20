import React from "react";
import { Edit, Delete, PlayArrow } from "@mui/icons-material";
import { STATUS_OPTIONS, priorityColor } from "../utils/taskUtils";

export function TaskCard({
  task,
  manage,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onStartTask,
}) {
  const pc = priorityColor(task.priority);
  const isStartable = task.status === "pending";

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 10,
      }}
    >
      {/* Title + Priority badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: "0.88rem",
            color: "#0f172a",
            flex: 1,
            paddingRight: 8,
          }}
        >
          {task.title}
        </p>
        <span
          style={{
            padding: "2px 9px",
            borderRadius: 20,
            fontSize: "0.72rem",
            fontWeight: 500,
            background: pc.bg,
            color: pc.color,
            flexShrink: 0,
          }}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "0.78rem",
            color: "#64748b",
            lineHeight: 1.4,
          }}
        >
          {task.description.substring(0, 80)}
          {task.description.length > 80 ? "…" : ""}
        </p>
      )}

      {/* Due date */}
      {task.due_date && (
        <p
          style={{
            margin: "0 0 6px",
            fontSize: "0.75rem",
            color: task.isOverDue ? "#dc2626" : "#64748b",
          }}
        >
          Due: {new Date(task.due_date).toLocaleDateString()}
          {task.isOverDue ? " · Overdue" : ""}
        </p>
      )}

      {/* Start date */}
      {task.startDate && (
        <p style={{ margin: "0 0 10px", fontSize: "0.75rem", color: "#64748b" }}>
          Started: {new Date(task.startDate).toLocaleDateString()}
        </p>
      )}

      {/* Actions row */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
          style={{
            fontSize: "0.75rem",
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            cursor: "pointer",
            color: "#374151",
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        {isStartable && (
          <button
            onClick={() => onStartTask(task)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <PlayArrow sx={{ fontSize: 13 }} /> Start
          </button>
        )}

        <div style={{ flex: 1 }} />

        <button
          onClick={() => onView(task)}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            background: "#fff",
            cursor: "pointer",
            fontSize: "0.75rem",
            color: "#374151",
          }}
        >
          View
        </button>

        {manage && (
          <>
            <button
              onClick={() => onEdit(task)}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Edit sx={{ fontSize: 13, color: "#3b82f6" }} />
            </button>
            <button
              onClick={() => onDelete(task)}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #fee2e2",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Delete sx={{ fontSize: 13, color: "#dc2626" }} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}