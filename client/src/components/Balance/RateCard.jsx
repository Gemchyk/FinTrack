import { useEffect, useState } from 'react';
import './RateCard.scss'

const SOURCES = {
  currency: ({ base, target }) => ({
    url: `https://www.floatrates.com/daily/${base}.json`,
    extract: (d) => d[target]?.rate,
    format: (v) => `1 ${base.toUpperCase()} = ${v.toFixed(2)} ₴`,
  }),
  crypto: ({ symbol }) => ({
    url: `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
    extract: (d) => parseFloat(d.price),
    format: (v) => `1 ${symbol.replace('USDT', '')} = ${v.toFixed(2)} $`,
    pollMs: 10000,
  }),
};

function RateCard({ title, type, base, target, symbol }) {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const { url, extract, format, pollMs } = SOURCES[type]({ base, target, symbol });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const raw = extract(await res.json());
        if (!Number.isFinite(raw)) throw new Error('rate not found');
        if (!cancelled) { setValue(raw); setError(null); }
      } catch (err) {
        console.error('Не удалось загрузить курс:', url, err);
        if (!cancelled) setError('Не удалось загрузить курс');
      }
    };

    load();
    if (!pollMs) return () => { cancelled = true; };

    const id = setInterval(load, pollMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [url]);

  return (
    <div className="courseCard">
      <div className="courseName">{title}</div>
      <div className="course">
        {error ? <p style={{ color: 'red' }}>{error}</p>
               : value === null ? <p>Загрузка...</p> : format(value)}
      </div>
    </div>
  );
}

export default RateCard;
