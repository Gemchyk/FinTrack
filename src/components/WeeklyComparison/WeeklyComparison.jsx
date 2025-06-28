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
import {useSelector  } from "react-redux";
import { useTranslation } from "react-i18next";




const WeeklyComparison = () => {

  const data = useSelector(state => state.weeklyComparison.data);
  const {t} = useTranslation();
  
  return (
    <>
      <div>
        <h1 className="title">{t("Statistics")}</h1>

        <div className="weekly-comparison">
          <div className="weekly-comparison__header">
            <h3>{t("Monthly Comparison")}</h3>
            <div className="weekly-comparison__legend">
              <span className="legend-item this-week">{t("This month")}</span>
            </div>
          </div>

          <ResponsiveContainer width={770} height={502}>
            <BarChart data={data} barSize={30}>
              <XAxis dataKey="day" />
              <YAxis domain={[0, 'auto']} />
              <Tooltip />
              <ReferenceLine y={4000} stroke="#888888" alwaysShow ifOverflow="extendDomain" />
              <ReferenceLine y={8000} stroke="#888888" alwaysShow ifOverflow="extendDomain" />
              <ReferenceLine y={12000} stroke="#888888" alwaysShow ifOverflow="extendDomain" />
              <ReferenceLine y={16000} stroke="#888888" alwaysShow ifOverflow="extendDomain" />
              <ReferenceLine y={20000} stroke="#888888" alwaysShow ifOverflow="extendDomain" />
              <ReferenceLine y={24000} stroke="#888888" alwaysShow ifOverflow="extendDomain" />
              <ReferenceLine y={28000} stroke="#888888" alwaysShow ifOverflow="extendDomain" />
              <ReferenceLine y={32000} stroke="#888888" alwaysShow ifOverflow="extendDomain" />

              <Bar dataKey="thisWeek" fill="#299D91" name={t("This Month")} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </>
  );
};

export default WeeklyComparison;
