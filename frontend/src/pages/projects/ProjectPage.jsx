import React from "react";
import { Add } from "@mui/icons-material";
import { useProjectPage } from "../../hooks/useProjectPage";
import { ProjectsEmptyState } from "../../components/ProjectsEmptyState";
import { ProjectCard } from "../../components/ProjectCard";
import { CreateProjectDialog } from "../../components/CreateProjectDialog";
import { EditProjectDialog } from "../../components/EditProjectDialog";
import { AssignTeamDialog } from "../../components/AssignTeamDialog";

export default function ProjectPage() {
  const {
    projects,
    teams,
    admin,
    manage,
    createOpen, setCreateOpen,
    editOpen, setEditOpen,
    assignOpen, setAssignOpen,
    selectedProject,
    selectedTeamId, setSelectedTeamId,
    newProject, setNewProject,
    editData, setEditData,
    handleCreate,
    handleEdit,
    handleDelete,
    handleAssignTeam,
    handleView,
    openEdit,
    openAssign,
  } = useProjectPage();

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        padding: "28px 32px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>
            Projects
          </h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.875rem" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        {admin && (
          <button
            onClick={() => setCreateOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 8, border: "none",
              background: "#3b82f6", color: "#fff", fontWeight: 600,
              fontSize: "0.9rem", cursor: "pointer",
            }}
          >
            <Add sx={{ fontSize: 18 }} /> New Project
          </button>
        )}
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <ProjectsEmptyState admin={admin} onCreateClick={() => setCreateOpen(true)} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              role={admin ? "admin" : manage ? "manager" : "user"}
              onView={handleView}
              onEdit={openEdit}
              onDelete={handleDelete}
              onAssignTeam={openAssign}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      {admin && (
        <CreateProjectDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          newProject={newProject}
          setNewProject={setNewProject}
          onSubmit={handleCreate}
        />
      )}

      {admin && (
        <EditProjectDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          editData={editData}
          setEditData={setEditData}
          onSubmit={handleEdit}
        />
      )}

      {manage && (
        <AssignTeamDialog
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          selectedProject={selectedProject}
          teams={teams}
          selectedTeamId={selectedTeamId}
          setSelectedTeamId={setSelectedTeamId}
          onSubmit={handleAssignTeam}
        />
      )}
    </div>
  );
}