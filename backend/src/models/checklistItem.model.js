import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class ChecklistItem extends Model {}

ChecklistItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taskId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    isCompeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "ChecklistItem",
    tableName: "checklist_items",
    underscored: true,
  },
);

export default ChecklistItem;
