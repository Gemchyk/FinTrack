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
import { useDispatch,  useSelector  } from "react-redux";




const WeeklyComparison = () => {

  const data = useSelector(state => state.weeklyComparison.data);
  
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
            <Bar dataKey="thisWeek" fill="#299D91" name="This Week" radius={[5, 5, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
      
    </>
  );
};

export default WeeklyComparison;
