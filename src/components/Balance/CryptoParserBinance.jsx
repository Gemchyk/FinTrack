import React, { useEffect, useState } from 'react';

function CryptoPrice({ symbol }) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных с Binance');
        }

        const data = await response.json();
        setPrice(parseFloat(data.price).toFixed(2));
      } catch (err) {
        setError(`Не удалось получить цену для ${symbol}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();

    const interval = setInterval(fetchPrice, 10000); // автообновление каждые 10 секунд
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {price && `1 ${symbol.replace('USDT', '')} = ${price} $`}
    </div>
  );
}

export default CryptoPrice;
