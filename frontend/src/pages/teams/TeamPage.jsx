import React from "react";
import { CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useTeamPage } from "../../hooks/useTeamPage";
import { TeamsEmptyState } from "../../components/TeamsEmptyState";
import { TeamCard } from "../../components/TeamCard";
import { CreateTeamDialog } from "../../components/CreateTeamDialog";
import { AddMembersDialog } from "../../components/AddMembersDialog";
import { ViewMembersDialog } from "../../components/ViewMembersDialog";

export default function TeamPage() {
  const {
    user,
    users,
    teams,
    currentTeamMembers,
    loading,
    manage,
    createOpen,
    setCreateOpen,
    addMembersOpen,
    setAddMembersOpen,
    viewMembersOpen,
    setViewMembersOpen,
    selectedTeam,
    newTeam,
    setNewTeam,
    selectedUsers,
    searchUser,
    setSearchUser,
    filteredUsers,
    handleCreate,
    handleAddMembers,
    openViewMembers,
    openAddMembers,
    toggleUser,
  } = useTeamPage();

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        padding: "28px 32px",
        maxWidth: 1100,
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
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Teams
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              color: "#64748b",
              fontSize: "0.875rem",
            }}
          >
            {teams.length} team{teams.length !== 1 ? "s" : ""} total
          </p>
        </div>
        {manage && (
          <button
            onClick={() => setCreateOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            <Add sx={{ fontSize: 18 }} /> New Team
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <CircularProgress />
        </div>
      ) : teams.length === 0 ? (
        <TeamsEmptyState manage={manage} onCreateClick={() => setCreateOpen(true)} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              currentUser={user}
              onAddMembers={openAddMembers}
              onViewMembers={openViewMembers}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateTeamDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        newTeam={newTeam}
        setNewTeam={setNewTeam}
        onSubmit={handleCreate}
      />

      <AddMembersDialog
        open={addMembersOpen}
        onClose={() => setAddMembersOpen(false)}
        selectedTeam={selectedTeam}
        users={users}
        filteredUsers={filteredUsers}
        selectedUsers={selectedUsers}
        searchUser={searchUser}
        setSearchUser={setSearchUser}
        toggleUser={toggleUser}
        onSubmit={handleAddMembers}
      />

      <ViewMembersDialog
        open={viewMembersOpen}
        onClose={() => setViewMembersOpen(false)}
        selectedTeam={selectedTeam}
        currentTeamMembers={currentTeamMembers}
      />
    </div>
  );
}