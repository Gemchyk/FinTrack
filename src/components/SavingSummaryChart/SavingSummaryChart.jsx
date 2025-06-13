import styles from './SavingSummaryChart.module.scss';

import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Area,
} from 'recharts';
  
const data = [
    { date: 'May 01', current: 1000, previous: 1200 },
    { date: 'May 05', current: 3000, previous: 1500 },
    { date: 'May 10', current: 1500, previous: 2000 },
    { date: 'May 15', current: 1800, previous: 1200 },
    { date: 'May 20', current: 4000, previous: 1000 },
    { date: 'May 25', current: 3800, previous: 1200 },
    { date: 'May 30', current: 2000, previous: 1100 },
];


export default function SavingSummaryChart() {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.title}>Saving Summary</h2>
        <div className={styles.dateDropdown}>Mar 2025 ▼</div>
        <div className={styles.indicators}>
            <div>
                <span className={styles.thisMonth}></span>
                This month
            </div>
            <div>
                <span className={styles.lastMonth}></span>
                Same period last month
            </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 30, right: 0, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#299D91" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#299D91" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid horizontal={false} strokeDasharray="0 0" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="current"
            stroke="#299D91"
            fillOpacity={1}
            fill="url(#colorCurrent)"
            name="This month"
          />

          <Line
            type="monotone"
            dataKey="previous"
            stroke="#E8E8E8"
            strokeDasharray="5 5"
            strokeWidth={2}
            name="Same period last month"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
