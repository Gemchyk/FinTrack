import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./WeeklyComparison.scss";

const data = [
  { day: "Sun", thisWeek: 240000, lastWeek: 200000 },
  { day: "Mon", thisWeek: 100000, lastWeek: 120000 },
  { day: "Tue", thisWeek: 80000, lastWeek: 90000 },
  { day: "Wed", thisWeek: 120000, lastWeek: 110000 },
  { day: "Thu", thisWeek: 130000, lastWeek: 100000 },
  { day: "Fri", thisWeek: 220000, lastWeek: 210000 },
  { day: "Sat", thisWeek: 150000, lastWeek: 170000 },
];

const WeeklyComparison = () => {
  return (
    <div className="weekly-comparison">
      <div className="weekly-comparison__header">
        <h3>Weekly Comparison</h3>
        <div className="weekly-comparison__legend">
          <span className="legend-item this-week">This week</span>
          <span className="legend-item last-week">Last week</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="thisWeek" fill="#00C49F" name="This Week" />
          <Bar dataKey="lastWeek" fill="#ccc" name="Last Week" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyComparison;
