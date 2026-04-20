import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, FormControl,
  InputLabel, Autocomplete, Checkbox, Avatar, Chip,
} from "@mui/material";
import { avatarColor, getMemberUser, getMemberLabel, getMemberId } from "../utils/projectDetailUtils";

export function TaskFormDialogue({
  open,
  onClose,
  editingTask,
  taskForm,
  setTaskForm,
  selectedUsers,
  setSelectedUsers,
  currentTeamMembers,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        {editingTask ? "Edit Task" : "Create New Task"}
      </DialogTitle>

      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 16 }}>
          <TextField
            label="Title"
            fullWidth
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />

          <div style={{ display: "flex", gap: 16 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskForm.priority}
                label="Priority"
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Due Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={taskForm.due_date}
              onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
            />
          </div>

          <Autocomplete
            multiple
            options={currentTeamMembers}
            disableCloseOnSelect
            getOptionLabel={getMemberLabel}
            isOptionEqualToValue={(option, value) =>
              getMemberId(option) === getMemberId(value)
            }
            value={currentTeamMembers.filter((m) =>
              selectedUsers.includes(getMemberId(m)),
            )}
            onChange={(_, newValue) => {
              setSelectedUsers(newValue.map((m) => getMemberId(m)));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Assign Team Members" placeholder="Select members" />
            )}
            renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              const u = getMemberUser(option);
              const uid = getMemberId(option);
              return (
                <li key={uid ?? key} {...rest}>
                  <Checkbox checked={selected} style={{ marginRight: 8 }} />
                  <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: 12, bgcolor: avatarColor(u?.username || u?.name || "") }}>
                    {(u?.username || u?.name || "U")[0].toUpperCase()}
                  </Avatar>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{u?.username || u?.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{u?.email}</span>
                    {u?.jobTitle && <span style={{ fontSize: "0.75rem", color: "#3b82f6" }}>{u.jobTitle}</span>}
                  </div>
                </li>
              );
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const u = getMemberUser(option);
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={getMemberId(option) ?? key}
                    size="small"
                    label={u?.username || u?.name || u?.email}
                    avatar={
                      <Avatar sx={{ bgcolor: avatarColor(u?.username || "") }}>
                        {(u?.username || "U")[0].toUpperCase()}
                      </Avatar>
                    }
                    {...tagProps}
                  />
                );
              })
            }
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!taskForm.title}
        >
          {editingTask ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}