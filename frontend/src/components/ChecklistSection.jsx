import React from "react";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

export function ChecklistSection({ taskId, checklist, onToggle }) {
  const completed = checklist.filter((i) => i.isCompeleted).length;

  return (
    <div style={{ marginTop: 12 }}>
      <p
        style={{
          margin: "0 0 8px",
          fontWeight: 600,
          fontSize: "0.82rem",
          color: "#374151",
        }}
      >
        Checklist ({completed}/{checklist.length})
      </p>

      {checklist.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
          No checklist items
        </p>
      ) : (
        checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggle(taskId, item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 0",
              cursor: "pointer",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {item.isCompeleted ? (
              <CheckBox sx={{ fontSize: 17, color: "#3b82f6" }} />
            ) : (
              <CheckBoxOutlineBlank sx={{ fontSize: 17, color: "#94a3b8" }} />
            )}
            <span
              style={{
                fontSize: "0.82rem",
                color: item.isCompeleted ? "#94a3b8" : "#374151",
                textDecoration: item.isCompeleted ? "line-through" : "none",
              }}
            >
              {item.title}
            </span>
          </div>
        ))
      )}
    </div>
  );
}