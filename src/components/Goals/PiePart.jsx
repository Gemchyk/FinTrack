import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';


const data = [
  { name: 'Shopping', value: 0, color: '#1E2A38' },
  { name: 'Fun', value: 0, color: '#00C49F' },
  { name: 'Food', value: 0, color: '#4A5A6A' },
  { name: 'Other', value: 0, color: '#738FA7'},
  { name: 'Health', value: 0, color: '#BFA2DB'},
  { name: 'Transport', value: 0, color: '#3EDBB3'}
];


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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

const GoalsChart = () => {
  const {t} = useTranslation();
  const store = useSelector((state) => state.categories); 
  const chartData = data
    .map((d) => {
      const storeCategory = store.find((i) => i.name == d.name);
      const value = storeCategory && storeCategory.expenses
        ? storeCategory.expenses.reduce((sum, el) => sum + el.amount, 0)
        : 0;
      return { ...d, value };
    })
    .filter((d) => d.value > 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '20px' }}>
        {chartData.length === 0 ? (
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
              <span className='goals-mini-title' style={{ fontSize: 14 }}>{t(`${entry.name}`)}</span>
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