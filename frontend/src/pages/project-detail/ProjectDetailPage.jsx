import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Typography, CircularProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useProjectDetail } from "../../hooks/useProjectDetail";
import { ProjectStatsBar } from "../../components/ProjectStatsBar";
import { TasksTable } from "../../components/TasksTable";
import { TaskRowMenu } from "../../components/TaskRowMenu";
import { TaskFormDialogue } from "../../components/TaskFormDialogue";
import { ChecklistDialog } from "../../components/ChecklistDialog";

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const {
    project,
    tasks,
    loading,
    currentTeamMembers,
    // Task dialog
    openTaskDialog,
    setOpenTaskDialog,
    editingTask,
    taskForm,
    setTaskForm,
    selectedUsers,
    setSelectedUsers,
    resetTaskForm,
    handleAddTaskBtn,
    handleEditBtn,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleStatusChange,
    // Row menu
    anchorEl,
    selectedTask,
    handleMenuOpen,
    handleMenuClose,
    // Checklist
    openChecklistDialog,
    checklistTask,
    checklists,
    checklistLoading,
    newChecklistItem,
    setNewChecklistItem,
    addingItem,
    handleOpenChecklist,
    handleAddChecklistItem,
    handleToggleChecklistItem,
    handleDeleteChecklistItem,
    handleCloseChecklistDialog,
  } = useProjectDetail();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 256 }}>
        <CircularProgress />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <Typography variant="h6" color="textSecondary">Project not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/projects")} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <IconButton onClick={() => navigate("/projects")}>
          <ArrowBackIcon />
        </IconButton>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, color: "#111827" }}>
            {project.title}
          </h1>
          <p style={{ margin: "4px 0 0", color: "#4b5563" }}>
            {project.description || "No description"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <ProjectStatsBar tasks={tasks} />

      {/* Tasks table */}
      <TasksTable
        tasks={tasks}
        onAddTask={() => handleAddTaskBtn(project.teamId)}
        onMenuOpen={handleMenuOpen}
        onStatusChange={handleStatusChange}
      />

      {/* Row context menu */}
      <TaskRowMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onEdit={() => handleEditBtn(project.teamId)}
        onChecklist={() => handleOpenChecklist(selectedTask)}
        onDelete={() => handleDeleteTask(selectedTask?.id)}
      />

      {/* Create / Edit task dialog */}
      <TaskFormDialogue
        open={openTaskDialog}
        onClose={() => { setOpenTaskDialog(false); resetTaskForm(); }}
        editingTask={editingTask}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        currentTeamMembers={currentTeamMembers}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />

      {/* Checklist dialog */}
      <ChecklistDialog
        open={openChecklistDialog}
        onClose={handleCloseChecklistDialog}
        task={checklistTask}
        checklists={checklists}
        checklistLoading={checklistLoading}
        newChecklistItem={newChecklistItem}
        setNewChecklistItem={setNewChecklistItem}
        addingItem={addingItem}
        onAddItem={handleAddChecklistItem}
        onToggleItem={handleToggleChecklistItem}
        onDeleteItem={handleDeleteChecklistItem}
      />
    </div>
  );
}