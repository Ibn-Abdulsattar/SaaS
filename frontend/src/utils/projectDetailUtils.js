export const API_URL = import.meta.env.VITE_API_URL;

export const avatarColor = (name = "") => {
  const colors = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed", "#db2777"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

export const getMemberUser = (option) => option?.user || option;

export const getMemberLabel = (option) => {
  const u = getMemberUser(option);
  return u?.username || u?.name || u?.email || "";
};

export const getMemberId = (option) =>
  option?.userId || option?.user_id || option?.id || "";

export const EMPTY_TASK_FORM = {
  title: "",
  description: "",
  status: "pending",
  due_date: "",
  priority: "",
  assigned_to: [],
};