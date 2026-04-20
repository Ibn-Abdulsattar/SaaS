import React from "react";
import { Menu, MenuItem } from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

export function TaskRowMenu({
  anchorEl,
  onClose,
  onEdit,
  onChecklist,
  onDelete,
}) {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={onEdit}>
        <EditIcon sx={{ mr: 1, fontSize: 16 }} /> Edit
      </MenuItem>
      <MenuItem onClick={onChecklist}>
        <EditDocumentIcon sx={{ mr: 1, fontSize: 16 }} /> Checklist
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: "#dc2626" }}>
        <DeleteIcon sx={{ mr: 1, fontSize: 16 }} /> Delete
      </MenuItem>
    </Menu>
  );
}