import { Activity } from "../models/activity.model.js";

export const getRecentActivities = async (req, res) => {
    const activities = await Activity.findAll({
      include: ["User"],
      order: [["createdAt", "DESC"]],
      limit: 20
    });

    res.status(200).json(activities);
};