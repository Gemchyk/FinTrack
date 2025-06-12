import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
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
    <>
    <div>
      <h1 className="title">Statistics</h1>
      <div className="weekly-comparison">
        <div className="weekly-comparison__header">
          <h3>Weekly Comparison</h3>
          <div className="weekly-comparison__legend">
            <span className="legend-item this-week">This week</span>
            <span className="legend-item last-week">Last week</span>
          </div>
        </div>

        <ResponsiveContainer width={770} height={502}>
          <BarChart data={data} barSize={20}>
            <XAxis dataKey="day" />
            <YAxis domain={[0, 'auto']}/>
            <Tooltip />
            <ReferenceLine y={30000} stroke="#888888"  alwaysShow ifOverflow="extendDomain"/>
            <ReferenceLine y={60000} stroke="#888888"  alwaysShow ifOverflow="extendDomain"/>
            <ReferenceLine y={90000} stroke="#888888"  alwaysShow ifOverflow="extendDomain"/>
            <ReferenceLine y={120000} stroke="#888888" alwaysShow ifOverflow="extendDomain"/>
            <ReferenceLine y={150000} stroke="#888888" alwaysShow ifOverflow="extendDomain"/>
            <ReferenceLine y={180000} stroke="#888888" alwaysShow ifOverflow="extendDomain"/>
            <ReferenceLine y={210000} stroke="#888888" alwaysShow ifOverflow="extendDomain"/>
            <ReferenceLine y={240000} stroke="#888888" alwaysShow ifOverflow="extendDomain"/>

            <Bar dataKey="lastWeek" fill="#ccc" name="Last Week" radius={[5, 5, 0, 0]}/>
            <Bar dataKey="thisWeek" fill="#00C49F" name="This Week" radius={[5, 5, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
      
    </>
  );
};

export default WeeklyComparison;
