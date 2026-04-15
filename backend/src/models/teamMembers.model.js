import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class TeamMembers extends Model {}

TeamMembers.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    teamId: {
      type: DataTypes.UUID,
      references: {
        model: "teams",
        key: "id",
      },
    },
    role: {
      type: DataTypes.ENUM("Leader", "Member"),
      defaultValue: "Member",
    },
  },
  {
    sequelize,
    modelName: "TeamMember",
    tableName: "team_members",
    underscored: true,
  },
);

export { TeamMembers };
