import React from "react";
import { CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useTaskPage } from "../../hooks/useTaskPage";
import { KanbanColumn } from "../../components/KanbanColumn";
import { TaskFormDialog } from "../../components/TaskFormDialog";
import { TaskDetailDialog } from "../../components/TaskDetailDialog";
import { COLUMNS } from "../../utils/taskUtils";


export default function TaskPage() {
  const {
    projectId,
    manage,
    users,
    tasks,
    loading,
    tasksByStatus,
    formOpen,
    setFormOpen,
    editTask,
    setEditTask,
    detailTask,
    setDetailTask,
    checklist,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
    handleStartTask,
    openDetail,
    handleToggleChecklist,
  } = useTaskPage();
  
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        padding: "24px 28px",
        maxWidth: 1300,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#0f172a" }}>
            {projectId ? "Project Tasks" : "My Tasks"}
          </h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.85rem" }}>
            {tasks.length} tasks total
          </p>
        </div>
        {manage && projectId && (
          <button
            onClick={() => setFormOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              borderRadius: 8,
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            <Add sx={{ fontSize: 17 }} /> New Task
          </button>
        )}
      </div>

      {/* Board */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.key}
              col={col}
              tasks={tasksByStatus(col.key)}
              manage={manage}
              onView={openDetail}
              onEdit={setEditTask}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onStartTask={handleStartTask}
            />
          ))}
        </div>
      )}

      {/* Create dialog */}
      {manage && (
        <TaskFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreate}
          allUsersList={users}
          mode="create"
        />
      )}

      {/* Edit dialog */}
      {manage && (
        <TaskFormDialog
          open={!!editTask}
          onClose={() => setEditTask(null)}
          onSubmit={handleUpdate}
          initialData={editTask}
          allUsersList={users}
          mode="edit"
        />
      )}

      {/* Detail dialog */}
      <TaskDetailDialog
        task={detailTask}
        checklist={checklist}
        onClose={() => setDetailTask(null)}
        onToggleChecklist={handleToggleChecklist}
      />
    </div>
  );
}