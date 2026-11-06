import type { InputHTMLAttributes } from 'react';
import { useMoney } from '../../money';

// step and min follow the account's currency (1 for JPY, 0.01 for UAH), so the browser itself refuses the
// decimals the server would reject; max is what numeric(14,4) holds. inputMode brings up the numeric
// keyboard with a decimal key on phones
function AmountInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { step } = useMoney();
  return (
    <input name="amount" type="number" min={step} max={9999999999} step={step} inputMode="decimal" required {...props} />
  );
}

export default AmountInput;
