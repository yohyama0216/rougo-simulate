import type {
  AccumulationResult,
  WithdrawalResult,
  IncomeResult,
} from '../types';
import { formatYen } from '../lib/format';

interface ResultSummaryProps {
  activeTab: number;
  accumulationResult: AccumulationResult | null;
  withdrawalResult: WithdrawalResult | null;
  incomeResult: IncomeResult | null;
}

export default function ResultSummary({
  activeTab,
  accumulationResult,
  withdrawalResult,
  incomeResult,
}: ResultSummaryProps) {
  if (activeTab === 0 && accumulationResult) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>積立結果</h3>
        <div style={styles.resultGrid}>
          <div style={styles.resultItem}>
            <div style={styles.resultLabel}>最終資産</div>
            <div style={styles.resultValue}>
              {formatYen(accumulationResult.finalAsset)}
            </div>
          </div>
          <div style={styles.resultItem}>
            <div style={styles.resultLabel}>元本合計</div>
            <div style={styles.resultValue}>
              {formatYen(accumulationResult.totalContribution)}
            </div>
          </div>
          <div style={styles.resultItem}>
            <div style={styles.resultLabel}>運用益</div>
            <div style={styles.resultValue}>
              {formatYen(accumulationResult.totalGain)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 1 && withdrawalResult) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>取り崩し結果</h3>
        <div style={styles.resultGrid}>
          <div style={styles.resultItem}>
            <div style={styles.resultLabel}>枯渇しない月額取り崩し</div>
            <div style={styles.resultValueLarge}>
              {formatYen(withdrawalResult.monthlyWithdrawal)}/月
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 2 && incomeResult && withdrawalResult) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>老後の月収</h3>
        <div style={styles.resultGrid}>
          <div style={styles.resultItem}>
            <div style={styles.resultLabel}>月収合計</div>
            <div style={styles.resultValueLarge}>
              {formatYen(incomeResult.totalMonthlyIncome)}/月
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  container: {
    background: '#f5f5f5',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '24px',
  },
  heading: {
    fontSize: '20px',
    marginBottom: '16px',
    color: '#333',
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  resultItem: {
    background: 'white',
    padding: '16px',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  resultLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  resultValueLarge: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1976d2',
  },
};
