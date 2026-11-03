import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RateCard.scss';
import { formatMoney, useMoney } from '../../money';

type RateCardProps =
  | { title: string; type: 'currency'; base: string; target: string }
  | { title: string; type: 'crypto'; symbol: string };

interface RateSource {
  url: string;
  // NaN when the answer has no rate
  extract: (data: unknown) => number;
  format: (value: number) => string;
  pollMs?: number;
}

// Foreign APIs, so plain fetch rather than the app's RTK Query. Both send the rate as a string
function rateSource(props: RateCardProps, lang: string): RateSource {
  if (props.type === 'currency') {
    const { base, target } = props;
    return {
      url: `https://www.floatrates.com/daily/${base.toLowerCase()}.json`,
      extract: (data) => parseFloat((data as Record<string, { rate?: string } | undefined>)[target.toLowerCase()]?.rate ?? ''),
      format: (value) => `1 ${base} = ${formatMoney(value, target, lang)}`,
    };
  }
  const { symbol } = props;
  return {
    url: `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
    extract: (data) => parseFloat((data as { price: string }).price),
    format: (value) => `1 ${symbol.replace('USDT', '')} = ${formatMoney(value, 'USD', lang)}`,
    pollMs: 10000,
  };
}

function RateCard(props: RateCardProps) {
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  const { url, extract, format, pollMs } = rateSource(props, i18n.resolvedLanguage ?? 'en');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const raw = extract(await res.json());
        if (!Number.isFinite(raw)) throw new Error('rate not found');
        if (!cancelled) { setValue(raw); setFailed(false); }
      } catch (err) {
        console.error('Could not load the rate:', url, err);
        if (!cancelled) setFailed(true);
      }
    };

    load();
    if (!pollMs) return () => { cancelled = true; };

    const id = setInterval(load, pollMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [url]);

  return (
    <div className="courseCard">
      <div className="courseName">{props.title}</div>
      <div className="course">
        {failed ? <p style={{ color: 'red' }}>{t('rates.failed')}</p>
               : value === null ? <p>{t('Loading...')}</p> : format(value)}
      </div>
    </div>
  );
}

// Other currencies against the account's one: a USD account gets EUR and UAH, never a pointless USD/USD
const RATE_BASES = ['USD', 'EUR', 'UAH'];

export function CurrencyRateCards() {
  const { currency } = useMoney();
  if (!currency) return null;

  return (
    <>
      {RATE_BASES.filter((code) => code !== currency).slice(0, 2).map((code) => (
        <RateCard key={code} title={`${code}/${currency}`} type="currency" base={code} target={currency} />
      ))}
    </>
  );
}

export default RateCard;
