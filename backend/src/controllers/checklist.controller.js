import ChecklistItem from "../models/checklistItem.model.js";
import ExpressError from "../utils/expressError.js";

export const getChecklistsByTask = async (req, res, next) => {
  const { taskId } = req.params;
  const checklists = await ChecklistItem.findAll({
    where: { taskId: taskId },
  });

  return res.status(200).json({ success: true, data: checklists });
};

export const createChecklist = async (req, res, next) => {
  const { taskId } = req.params;
  const { title } = req.body;

  const checklist = await ChecklistItem.create({
    title: title,
    taskId: taskId,
    isCompeleted: false,
  });

  return res.status(201).json({ success: true, data: checklist });
};

export const updateChecklistStatus = async (req, res, next) => {
  const { checklistId } = req.params;
  const { isCompeleted } = req.body;

  const item = await ChecklistItem.findByPk(checklistId);
  if (!item) return next(new ExpressError("Checklist item not found", 404));

  await item.update({ isCompeleted });

  return res.status(200).json({ success: true, data: item });
};

export const deleteChecklist = async (req, res, next) => {
  const { checklistId } = req.params;

  const item = await ChecklistItem.findByPk(checklistId);
  if (!item) return next(new ExpressError("Checklist item not found", 404));

  await item.destroy();

  return res.status(200).json({ message: "Deleted successfully" });
};
