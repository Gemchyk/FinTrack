import React, { useEffect, useState } from 'react';

function ExchangeRate({ base = 'usd', target = 'uah' }) {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.floatrates.com/daily/${base}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при загрузке курса');
        }
        return res.json();
      })
      .then((data) => {
        const rateValue = data[target]?.rate;
        if (rateValue) {
          setRate(rateValue.toFixed(2));
        } else {
          throw new Error(`Курс ${target.toUpperCase()} не найден`);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка при получении курса:', err);
        setError('Не удалось загрузить курс валют');
        setLoading(false);
      });
  }, [base, target]);

  return (
    <div>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {rate && `1 ${base.toUpperCase()} = ${rate} ₴`}
    </div>
  );
}

export default ExchangeRate;


