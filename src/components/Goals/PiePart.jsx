import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const RADIAN = Math.PI / 180;

const data = [
  { name: 'Filled', value: 100, color: '#299D91'},
];



const cx = 73;
const cy = 100;
const iR = 60;
const oR = 70;
const value = 80;

const total = data.reduce((sum, v) => sum + v.value, 0);
const filledAngle = (value / total) * 180; // Угол заполненной части
const emptyAngle = 180 - filledAngle;

const needle = (value, data, cx, cy, iR, oR, color) => {
  console.log(total);
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3.9;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 8;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin + 7;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin - 7;
  const ybb = y0 + r * cos ;
  const xp = x0 + length * cos ;
  const yp = y0 + length * sin;

  return [
    <circle key="circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path key="needle" d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} />,
  ];
};

const PiePart = () => {
  console.log(value / data.reduce((sum, v) => sum + v.value, 0) * 180);
  return (
    <PieChart width={150} height={130}>
      <Pie
        data={[{ value: total }]}
        dataKey="value"
        startAngle={180}
        endAngle={0}
        cx={cx}
        cy={cy}
        innerRadius={iR}
        outerRadius={oR}
        fill="#E8E8E8"
        stroke="none"
        isAnimationActive={false}
        cornerRadius={10}
      >
        
      </Pie>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={emptyAngle}
        data={data}
        cx={cx}
        cy={cy}
        innerRadius={iR}
        outerRadius={oR}
        stroke="none"
        isAnimationActive={false}
        cornerRadius={10}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      {needle(value, data, cx, cy, iR, oR, '#299D91')}
    </PieChart>
  );
};

export default PiePart;