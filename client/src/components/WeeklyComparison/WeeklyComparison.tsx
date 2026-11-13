import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./WeeklyComparison.scss";
import { useTranslation } from "react-i18next";
import { useDashboardQuery } from "./dashboardApi";
import { useMoney } from "../../money";

const WeeklyComparison = ({ month }: { month: string }) => {
  const { t, i18n } = useTranslation();
  const { format } = useMoney();
  // Twelve months ending with the chosen one; currentData, so a new month never shows the previous bars
  const { currentData = [] } = useDashboardQuery(month);

  // With the year: the twelve months cross a new year, and two "Jan" bars would be ambiguous
  const monthFormat = new Intl.DateTimeFormat(i18n.resolvedLanguage, { month: "short", year: "2-digit" });
  const monthLabel = (bar: string) =>
    monthFormat.format(new Date(Number(bar.slice(0, 4)), Number(bar.slice(5, 7)) - 1));

  return (
    <>
      <div className="weekly-comparison-block">
        <h1 className="title">{t("Statistics")}</h1>

        <div className="weekly-comparison">
          <div className="weekly-comparison__header">
            <h3>{t("Monthly Comparison")}</h3>
            <div className="weekly-comparison__legend">
              <span className="legend-item this-week">{t("Expenses")}</span>
            </div>
          </div>

          {/* The chart takes the width of the card and the height set in CSS (lower on phones) */}
          <div className="weekly-comparison__chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData} barSize={30}>
                {/* Grid lines follow the axis scale, whatever the amounts */}
                <CartesianGrid vertical={false} stroke="#888888" strokeOpacity={0.3} />
                {/* preserveStartEnd skips labels that would overlap on a narrow screen */}
                <XAxis dataKey="month" tickFormatter={monthLabel} interval="preserveStartEnd" />
                <YAxis domain={[0, 'auto']} />
                <Tooltip labelFormatter={monthLabel} formatter={(value) => format(Number(value))} />
                <Bar dataKey="expense" fill="#299D91" name={t("Expenses")} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeeklyComparison;
