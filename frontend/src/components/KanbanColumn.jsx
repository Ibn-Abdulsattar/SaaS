import React from "react";
import { TaskCard } from "./TaskCard";

export function KanbanColumn({ col, tasks, manage, onView, onEdit, onDelete, onStatusChange, onStartTask }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 12,
        padding: 14,
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: col.color,
          }}
        />
        <span
          style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a" }}
        >
          {col.label}
        </span>
        <span
          style={{
            marginLeft: "auto",
            background: col.bg,
            color: col.color,
            borderRadius: 20,
            padding: "2px 9px",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards or empty state */}
      {tasks.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "0.8rem",
            padding: "20px 0",
          }}
        >
          No tasks
        </p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            manage={manage}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onStartTask={onStartTask}
          />
        ))
      )}
    </div>
  );
}