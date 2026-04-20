export const roleOf = (user) => user?.role ?? "user";
export const canManage = (role) => role === "admin" || role === "manager";

export const avatarColor = (name = "") => {
  const colors = [
    "#4f46e5",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
    "#7c3aed",
    "#db2777",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};