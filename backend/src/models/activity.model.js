import { Model, DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../config/db.js";

class Activity extends Model {}

(async () => {
  Activity.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
            model: "users",
            key: "user_id"
        }
      },
      action: { type: DataTypes.STRING },
      entity_type: { type: DataTypes.STRING },
      entity_id: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Activity",
      tableName: "activities",
      underscored: true,
      indexes: [
        {
          fields: ["action"],
          name: "idx_activities_action",
        },
        {
          fields: ["entity_id"],
          name: "idx_activities_entity_id",
        },
      ],
    },
  );
})();

export { Activity };
