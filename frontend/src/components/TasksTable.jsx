import React from "react";
import {
  Card, CardContent, Typography, Button,
  Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Select, MenuItem, Chip, IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as PendingIcon,
  Schedule as InProgressIcon,
} from "@mui/icons-material";

const getStatusIcon = (status) => {
  switch (status) {
    case "completed": return <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 18 }} />;
    case "in_progress": return <InProgressIcon sx={{ color: "#2563eb", fontSize: 18 }} />;
    default: return <PendingIcon sx={{ color: "#94a3b8", fontSize: 18 }} />;
  }
};

export function TasksTable({ tasks, onAddTask, onMenuOpen, onStatusChange }) {
  return (
    <Card>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Typography variant="h6">Tasks</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAddTask}>
            Add Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Typography color="textSecondary" gutterBottom>No tasks yet</Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={onAddTask} sx={{ mt: 1 }}>
              Create your first task
            </Button>
          </div>
        ) : (
          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell sx={{ color: "red" }}>Deadline</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {getStatusIcon(task.status)}
                        <span style={{ textDecoration: task.status === "completed" ? "line-through" : "none", color: task.status === "completed" ? "#94a3b8" : "inherit" }}>
                          {task.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{task.description || "-"}</TableCell>
                    <TableCell>
                      {task.assigned_users?.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {task.assigned_users.map((user) => (
                            <Chip key={user.user_id} label={user.username} size="small" variant="outlined" />
                          ))}
                        </div>
                      ) : "-"}
                    </TableCell>
                    <TableCell sx={{ color: "red" }}>{task.due_date || "-"}</TableCell>
                    <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => onMenuOpen(e, task)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}