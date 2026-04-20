import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export function ProjectStatsBar({ tasks }) {
  const total = tasks?.length || 0;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status !== "completed").length;

  const stats = [
    { label: "Total Tasks", value: total, color: undefined },
    { label: "Completed", value: completed, color: "#16a34a" },
    { label: "Pending", value: pending, color: "#ea580c" },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map(({ label, value, color }) => (
        <Grid key={label} size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {label}
              </Typography>
              <Typography variant="h4" sx={color ? { color } : {}}>
                {value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}