import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { allUsers } from "../redux/slices/authSlice";
import { addMembersToTeam, createTeam, fetchTeamMembers, getAllTeams } from "../redux/slices/teamSlice";

import { canManage, roleOf } from "../utils/teamUtils";

export function useTeamPage() {
  const dispatch = useDispatch();
  const { user, allUsers: users } = useSelector((s) => s.auth);
  const { teams, currentTeamMembers, loading } = useSelector((s) => s.team);

  const role = roleOf(user);
  const manage = canManage(role);

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [viewMembersOpen, setViewMembersOpen] = useState(false);

  // Selection state
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    if (manage) dispatch(allUsers());
    dispatch(getAllTeams());
  }, [dispatch, manage]);

  const handleCreate = async () => {
    if (!newTeam.name.trim()) return toast.error("Team name is required");
    try {
      await dispatch(createTeam(newTeam)).unwrap();
      toast.success("Team created successfully");
      setCreateOpen(false);
      setNewTeam({ name: "", description: "" });
    } catch {
      toast.error("Failed to create team");
    }
  };

  const handleAddMembers = async () => {
    if (!selectedUsers.length) return toast.error("Select at least one user");
    try {
      await dispatch(
        addMembersToTeam({ teamId: selectedTeam.id, userIds: selectedUsers }),
      ).unwrap();
      toast.success("Members added successfully");
      setAddMembersOpen(false);
      setSelectedUsers([]);
    } catch {
      toast.error("Failed to add members");
    }
  };

  const openViewMembers = async (team) => {
    setSelectedTeam(team);
    await dispatch(fetchTeamMembers(team.id));
    setViewMembersOpen(true);
  };

  const openAddMembers = (team) => {
    setSelectedTeam(team);
    setSelectedUsers([]);
    setSearchUser("");
    setAddMembersOpen(true);
  };

  const toggleUser = (id) =>
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );

  const filteredUsers = (users || []).filter(
    (u) =>
      u.username?.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUser.toLowerCase()),
  );

  return {
    // Data
    user,
    users,
    teams,
    currentTeamMembers,
    loading,
    manage,

    // Dialog state
    createOpen,
    setCreateOpen,
    addMembersOpen,
    setAddMembersOpen,
    viewMembersOpen,
    setViewMembersOpen,

    // Selection state
    selectedTeam,
    newTeam,
    setNewTeam,
    selectedUsers,
    searchUser,
    setSearchUser,
    filteredUsers,

    // Handlers
    handleCreate,
    handleAddMembers,
    openViewMembers,
    openAddMembers,
    toggleUser,
  };
}