import React, {useEffect} from "react";
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
import {useDispatch, useSelector  } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchTransactionsToDashboard } from "./weeklyComprasionSlice";




const WeeklyComparison = () => {

  const data = useSelector(state => state.weeklyComparison.data);
  const dispatch = useDispatch();
  const {t} = useTranslation();


  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(fetchTransactionsToDashboard());
    }
  }, [dispatch, data]);
  
  
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
              {data.length && Array.from({ length: 20 }, (_, i) => (
                <ReferenceLine
                  key={i}
                  y={(i + 1) * 50}
                  stroke="#888888"
                  alwaysShow
                  ifOverflow="extendDomain"
                />
              ))}


              <Bar dataKey="thisWeek" fill="#299D91" name={t("This Month")} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </>
  );
};

export default WeeklyComparison;
