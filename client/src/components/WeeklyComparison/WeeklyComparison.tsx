import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import "./WeeklyComparison.scss";
import { useTranslation } from "react-i18next";
import { useDashboardQuery } from "./dashboardApi";
import { currentMonth } from "../../dates";
import { useMoney } from "../../money";

const WeeklyComparison = () => {
  const { t, i18n } = useTranslation();
  const { format } = useMoney();
  // Twelve months ending with this one, so the request is made once per month and never repeats on empty data
  const { data = [] } = useDashboardQuery(currentMonth());

  // With the year: the twelve months cross a new year, and two "Jan" bars would be ambiguous
  const monthFormat = new Intl.DateTimeFormat(i18n.resolvedLanguage, { month: "short", year: "2-digit" });
  const monthLabel = (month: string) =>
    monthFormat.format(new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1));

  return (
    <>
      <div>
        <h1 className="title">{t("Statistics")}</h1>

        <div className="weekly-comparison">
          <div className="weekly-comparison__header">
            <h3>{t("Monthly Comparison")}</h3>
            <div className="weekly-comparison__legend">
              <span className="legend-item this-week">{t("Expenses")}</span>
            </div>
          </div>

          <ResponsiveContainer width={770} height={502}>
            <BarChart data={data} barSize={30}>
              <XAxis dataKey="month" tickFormatter={monthLabel} />
              <YAxis domain={[0, 'auto']} />
              <Tooltip labelFormatter={monthLabel} formatter={(value) => format(Number(value))} />
              {data.length > 0 && Array.from({ length: 20 }, (_, i) => (
                <ReferenceLine
                  key={i}
                  y={(i + 1) * 50}
                  stroke="#888888"
                  ifOverflow="extendDomain"
                />
              ))}

              <Bar dataKey="expense" fill="#299D91" name={t("Expenses")} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default WeeklyComparison;
