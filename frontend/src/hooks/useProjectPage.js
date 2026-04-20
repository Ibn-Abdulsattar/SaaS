import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, canManage, isAdmin, roleOf } from "../utils/projectUtils";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProject,
  setCurrentProject,
} from "../redux/slices/projectSlice";
import { getAllTeams } from "../redux/slices/teamSlice";


export function useProjectPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: projects } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);

  const role = roleOf(user);
  const admin = isAdmin(role);
  const manage = canManage(role);

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  // Selection state
  const [selectedProject, setSelectedProject] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // Form state
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
    pdfFile: null,
  });
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // ── Handlers 
  const handleCreate = async () => {
    if (!newProject.title.trim()) return toast.error("Title is required");
    try {
      const formData = new FormData();
      formData.append("title", newProject.title);
      formData.append("description", newProject.description);
      formData.append("deadline", newProject.deadline);
      if (newProject.pdfFile) formData.append("media", newProject.pdfFile);
      await dispatch(createProject(formData)).unwrap();
      toast.success("Project created successfully");
      setCreateOpen(false);
      setNewProject({ title: "", description: "", deadline: "", pdfFile: null });
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleEdit = async () => {
    if (!editData.title.trim()) return toast.error("Title is required");
    try {
      await dispatch(updateProject({ id: selectedProject.id, data: editData })).unwrap();
      toast.success("Project updated");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleAssignTeam = async () => {
    if (!selectedTeamId) return toast.error("Select a team");
    try {
      await axios.post(
        `${API_URL}/project/${selectedProject.id}/assign-team`,
        { teamId: selectedTeamId },
        { withCredentials: true },
      );
      toast.success("Team assigned successfully");
      setAssignOpen(false);
      setSelectedTeamId("");
    } catch {
      toast.error("Failed to assign team");
    }
  };

  const handleView = (project) => {
    dispatch(setCurrentProject(project));
    navigate(`/projects/${project.id}`);
  };

  const openEdit = (project) => {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      description: project.description || "",
      deadline: project.deadline || "",
    });
    setEditOpen(true);
  };

  const openAssign = async (project) => {
    setSelectedProject(project);
    // Fix: use unwrap result directly to avoid stale closure
    const result = await dispatch(getAllTeams()).unwrap();
    setTeams(result.teams || []);
    setAssignOpen(true);
  };

  return {
    // Data
    projects,
    teams,
    // Permissions
    admin,
    manage,
    // Dialog state
    createOpen, setCreateOpen,
    editOpen, setEditOpen,
    assignOpen, setAssignOpen,
    // Selection
    selectedProject,
    selectedTeamId, setSelectedTeamId,
    // Form state
    newProject, setNewProject,
    editData, setEditData,
    // Handlers
    handleCreate,
    handleEdit,
    handleDelete,
    handleAssignTeam,
    handleView,
    openEdit,
    openAssign,
  };
}