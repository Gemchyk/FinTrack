import { PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { categoryName, useReportQuery } from '../Categories/categoriesApi';

// By position, so any category, the user's own included, gets a colour
const COLORS = ['#1E2A38', '#00C49F', '#4A5A6A', '#738FA7', '#BFA2DB', '#3EDBB3'];

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const GoalsChart = ({ month }: { month: string }) => {
  const {t} = useTranslation();
  // currentData: while another month loads, data would still draw the previous one
  const report = useReportQuery(month).currentData;
  const chartData = [
    ...(report?.categories ?? []).map((category) => ({ name: categoryName(t, category.name), value: category.spent })),
    // Expenses whose category was deleted still belong to the month
    { name: t('Without category'), value: report?.uncategorized ?? 0 },
  ]
    .filter((d) => d.value > 0)
    .map((d, index) => ({ ...d, color: COLORS[index % COLORS.length] }));

  return (
    // Wraps on the narrowest phones: the legend goes above the 200px pie instead of pushing the page wider
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ marginRight: '20px' }}>
        {report && chartData.length === 0 ? (
          <span style={{ color: 'gray', fontSize: 14 }}>{t('No spendings yet')}</span>
        ) : (
          chartData.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: 'black' }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  marginRight: 8,
                  borderRadius: 2,
                }}
              />
              <span className='goals-mini-title' style={{ fontSize: 14 }}>{entry.name}</span>
            </div>
          ))
        )}
      </div>
      {chartData.length > 0 && (
        <PieChart width={200} height={170}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      )}
    </div>
  );
}

export default GoalsChart;
