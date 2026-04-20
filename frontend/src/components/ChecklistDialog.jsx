import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, List, ListItem, ListItemIcon,
  ListItemText, ListItemSecondaryAction, IconButton,
  Checkbox, Divider, Box, Typography, CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  CheckBoxOutlineBlank as UncheckedIcon,
  CheckBox as CheckedIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";

export function ChecklistDialog({
  open,
  onClose,
  task,
  checklists,
  checklistLoading,
  newChecklistItem,
  setNewChecklistItem,
  addingItem,
  onAddItem,
  onToggleItem,
  onDeleteItem,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        Checklist — {task?.title}
      </DialogTitle>

      <DialogContent>
        <Divider sx={{ mb: 1 }} />

        {checklistLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : checklists.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 3, fontSize: 14 }}>
            No checklist items yet. Add one below.
          </Typography>
        ) : (
          <List dense disablePadding>
            {checklists.map((item) => (
              <ListItem key={item.id} disableGutters sx={{ px: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox
                    edge="start"
                    checked={!!item.isCompeleted}
                    onChange={() => onToggleItem(item)}
                    icon={<UncheckedIcon />}
                    checkedIcon={<CheckedIcon color="success" />}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    sx: {
                      textDecoration: item.isCompeleted ? "line-through" : "none",
                      color: item.isCompeleted ? "text.disabled" : "text.primary",
                      fontSize: 14,
                    },
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" size="small" onClick={() => onDeleteItem(item.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ mt: 1, mb: 2 }} />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="New checklist item"
            size="small"
            fullWidth
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onAddItem(); }}
            disabled={addingItem}
            placeholder="Type and press Enter or click Add"
          />
          <Button
            variant="contained"
            onClick={onAddItem}
            disabled={!newChecklistItem.trim() || addingItem}
            startIcon={addingItem ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}