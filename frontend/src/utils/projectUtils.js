export const API_URL = import.meta.env.VITE_API_URL;

export const roleOf = (user) => user?.role ?? "user";
export const isAdmin = (role) => role === "admin";
export const canManage = (role) => role === "admin" || role === "manager";

export const avatarColor = (name = "") => {
  const colors = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};