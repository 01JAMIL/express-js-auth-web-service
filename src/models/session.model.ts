import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config";

export const SessionModel = sequelize.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "sessions",
  }
);
