import { useTranslation } from 'react-i18next';
import styles from './MonthReport.module.scss';
import Loader from '../Loaders/Loader';
import { iconFor } from '../../assets/icons/iconFor';
import { errorKey } from '../../store/api';
import { fractionDigits, useMoney } from '../../money';
import { categoryName, useReportQuery } from '../Categories/categoriesApi';
import { downloadCsv, toCsv } from './csv';
import type { Cell } from './csv';

interface Row {
  key: string;
  iconName: string | null;
  name: string;
  goal: number | null;
  spent: number;
}

// One month on paper: its totals and every category with its goal and spending, exported to CSV or printed
function MonthReport({ month }: { month: string }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? 'en';
  const { format, currency } = useMoney();
  // currentData: while another month loads, data would still hold the rows of the previous one
  const { currentData: report, error, isFetching } = useReportQuery(month);
  const errorText = errorKey(error);

  const monthName = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(
    new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1),
  );

  const rows: Row[] = report
    ? [
        ...report.categories.map((category) => ({
          key: category.id,
          iconName: category.iconName,
          name: categoryName(t, category.name),
          goal: category.goal,
          spent: category.spent,
        })),
        // Expenses whose category was deleted still belong to the month
        ...(report.uncategorized > 0
          ? [{ key: 'none', iconName: null, name: t('Without category'), goal: null, spent: report.uncategorized }]
          : []),
      ]
    : [];

  const exportCsv = () => {
    if (!report || !currency) return;
    const cells: Cell[][] = [
      [t('Category'), t('report.goal'), t('report.spent'), t('Currency')],
      ...rows.map((row) => [row.name, row.goal, row.spent, currency]),
      [],
      [t('Income'), null, report.income, currency],
      [t('Expenses'), null, report.expense, currency],
      [t('report.balance'), null, report.balance, currency],
    ];
    downloadCsv(toCsv(cells, lang, fractionDigits(currency)), `fintrack-${month}.csv`);
  };

  return (
    <section className={styles.report}>
      <div className={styles.header}>
        <h2 className={styles.month}>{monthName}</h2>
        <div className={styles.buttons}>
          <button type="button" className={styles.button} onClick={exportCsv} disabled={!report || !currency}>
            {t('report.csv')}
          </button>
          <button type="button" className={styles.button} onClick={() => window.print()} disabled={!report}>
            {t('report.print')}
          </button>
        </div>
      </div>

      {errorText && <p className={styles.error} role="alert">{t(errorText)}</p>}
      {!report && isFetching && (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}

      {report && (
        <>
          <dl className={styles.totals}>
            <div>
              <dt>{t('Income')}</dt>
              <dd className={styles.income}>{format(report.income)}</dd>
            </div>
            <div>
              <dt>{t('Expenses')}</dt>
              <dd>{format(report.expense)}</dd>
            </div>
            <div>
              <dt>{t('report.balance')}</dt>
              <dd className={report.balance < 0 ? styles.negative : undefined}>{format(report.balance)}</dd>
            </div>
          </dl>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('Category')}</th>
                <th>{t('report.goal')}</th>
                <th>{t('report.spent')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>
                    <span className={styles.name}>
                      {iconFor(row.iconName)}
                      {row.name}
                    </span>
                  </td>
                  <td className={styles.goal}>
                    {/* Phones hide the header row, so the card names the goal itself */}
                    <span className={styles.cardLabel}>{t('report.goal')}: </span>
                    {row.goal === null ? '—' : format(row.goal)}
                  </td>
                  <td className={styles.spent}>{format(row.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

export default MonthReport;
