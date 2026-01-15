import { useState, useMemo } from 'react';
import Tabs from './components/Tabs';
import FormAccumulation from './components/FormAccumulation';
import FormWithdrawal from './components/FormWithdrawal';
import FormIncome from './components/FormIncome';
import ResultSummary from './components/ResultSummary';
import TableYearly from './components/TableYearly';
import { simulateAccumulation, simulateWithdrawal } from './lib/calc';
import type {
  AccumulationParams,
  WithdrawalParams,
  IncomeParams,
  AccumulationResult,
  WithdrawalResult,
  IncomeResult,
} from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  // Accumulation state
  const [accumulationParams, setAccumulationParams] =
    useState<AccumulationParams>({
      initialAsset: 0,
      monthlyContribution: 100000,
      years: 20,
      annualReturn: 5.0,
      annualCost: 0.2,
    });

  // Withdrawal state
  const [withdrawalParams, setWithdrawalParams] = useState<WithdrawalParams>({
    retirementAsset: 0,
    startAge: 65,
    endAge: 95,
    annualReturn: 3.0,
  });

  // Income state
  const [incomeParams, setIncomeParams] = useState<IncomeParams>({
    pension: 150000,
  });

  // Calculate accumulation result using useMemo
  const accumulationResult: AccumulationResult = useMemo(() => {
    return simulateAccumulation(accumulationParams);
  }, [accumulationParams]);

  // Update withdrawal params when accumulation result changes (only if retirement asset is 0)
  const effectiveWithdrawalParams = useMemo(() => {
    if (withdrawalParams.retirementAsset === 0) {
      return {
        ...withdrawalParams,
        retirementAsset: accumulationResult.finalAsset,
      };
    }
    return withdrawalParams;
  }, [withdrawalParams, accumulationResult.finalAsset]);

  // Calculate withdrawal result using useMemo
  const withdrawalResult: WithdrawalResult = useMemo(() => {
    return simulateWithdrawal(effectiveWithdrawalParams);
  }, [effectiveWithdrawalParams]);

  // Calculate income result using useMemo
  const incomeResult: IncomeResult = useMemo(() => {
    return {
      totalMonthlyIncome:
        incomeParams.pension + withdrawalResult.monthlyWithdrawal,
    };
  }, [incomeParams, withdrawalResult.monthlyWithdrawal]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>老後資金シミュレーター</h1>
        <p style={styles.subtitle}>
          NISA積立 + 老後取り崩し + 月収計算
        </p>
      </header>

      <main style={styles.main}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 0 && (
          <>
            <FormAccumulation
              params={accumulationParams}
              onChange={setAccumulationParams}
            />
            <ResultSummary
              activeTab={activeTab}
              accumulationResult={accumulationResult}
              withdrawalResult={withdrawalResult}
              incomeResult={incomeResult}
            />
            <TableYearly
              activeTab={activeTab}
              accumulationData={accumulationResult.yearlyData}
              withdrawalData={[]}
            />
          </>
        )}

        {activeTab === 1 && (
          <>
            <FormWithdrawal
              params={withdrawalParams}
              onChange={setWithdrawalParams}
              suggestedRetirementAsset={accumulationResult.finalAsset}
            />
            <ResultSummary
              activeTab={activeTab}
              accumulationResult={accumulationResult}
              withdrawalResult={withdrawalResult}
              incomeResult={incomeResult}
            />
            <TableYearly
              activeTab={activeTab}
              accumulationData={[]}
              withdrawalData={withdrawalResult.yearlyData}
            />
          </>
        )}

        {activeTab === 2 && (
          <>
            <FormIncome params={incomeParams} onChange={setIncomeParams} />
            <ResultSummary
              activeTab={activeTab}
              accumulationResult={accumulationResult}
              withdrawalResult={withdrawalResult}
              incomeResult={incomeResult}
            />
            <div style={styles.incomeBreakdown}>
              <h3 style={styles.breakdownHeading}>内訳</h3>
              <div style={styles.breakdownItem}>
                <span>公的年金（月額）:</span>
                <span style={styles.breakdownValue}>
                  ¥{incomeParams.pension.toLocaleString('ja-JP')}
                </span>
              </div>
              <div style={styles.breakdownItem}>
                <span>取り崩し（月額）:</span>
                <span style={styles.breakdownValue}>
                  ¥
                  {withdrawalResult.monthlyWithdrawal.toLocaleString('ja-JP', {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          ※このシミュレーターは参考値です。実際の運用成果を保証するものではありません。
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#fafafa',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
  } as React.CSSProperties,
  title: {
    fontSize: '32px',
    margin: '0 0 8px 0',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '16px',
    margin: 0,
    opacity: 0.9,
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  footer: {
    background: '#333',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
  } as React.CSSProperties,
  footerText: {
    margin: 0,
    fontSize: '14px',
    opacity: 0.8,
  },
  incomeBreakdown: {
    marginTop: '24px',
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  breakdownHeading: {
    fontSize: '18px',
    marginBottom: '12px',
    color: '#333',
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '16px',
  },
  breakdownValue: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
};

export default App;
