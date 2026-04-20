export const API_URL = import.meta.env.VITE_API_URL;

export const STATUS_OPTIONS = ["pending", "in_progress", "completed"];
export const PRIORITY_OPTIONS = ["low", "medium", "high"];

export const COLUMNS = [
  { key: "pending", label: "Pending", color: "#64748b", bg: "#f1f5f9" },
  { key: "in_progress", label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
  { key: "completed", label: "Completed", color: "#16a34a", bg: "#dcfce7" },
];

export const roleOf = (user) => user?.role ?? "user";
export const canManage = (role) => role === "admin" || role === "manager";

export const priorityColor = (p) => {
  if (p === "high") return { bg: "#fee2e2", color: "#dc2626" };
  if (p === "medium") return { bg: "#fef9c3", color: "#ca8a04" };
  return { bg: "#f0fdf4", color: "#16a34a" };
};

export const avatarColor = (name = "") => {
  const colors = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};