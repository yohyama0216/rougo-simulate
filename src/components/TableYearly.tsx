import React from 'react';
import type { YearlyData, WithdrawalYearlyData } from '../types';
import { formatYen } from '../lib/format';

interface TableYearlyProps {
  activeTab: number;
  accumulationData: YearlyData[];
  withdrawalData: WithdrawalYearlyData[];
}

export default function TableYearly({
  activeTab,
  accumulationData,
  withdrawalData,
}: TableYearlyProps) {
  if (activeTab === 0 && accumulationData.length > 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>年別推移</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>年</th>
                <th style={styles.th}>資産残高</th>
                <th style={styles.th}>元本累計</th>
                <th style={styles.th}>運用益</th>
              </tr>
            </thead>
            <tbody>
              {accumulationData.map((row) => (
                <tr key={row.year}>
                  <td style={styles.td}>{row.year}年</td>
                  <td style={styles.td}>{formatYen(row.asset)}</td>
                  <td style={styles.td}>{formatYen(row.contribution)}</td>
                  <td style={styles.td}>{formatYen(row.gain)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 1 && withdrawalData.length > 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>年別残高推移</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>年</th>
                <th style={styles.th}>年齢</th>
                <th style={styles.th}>期首残高</th>
                <th style={styles.th}>年間取り崩し</th>
                <th style={styles.th}>期末残高</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalData.map((row) => (
                <tr key={row.year}>
                  <td style={styles.td}>{row.year}年目</td>
                  <td style={styles.td}>{row.age}歳</td>
                  <td style={styles.td}>{formatYen(row.startBalance)}</td>
                  <td style={styles.td}>{formatYen(row.withdrawal)}</td>
                  <td style={styles.td}>{formatYen(row.endBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  container: {
    marginTop: '32px',
  },
  heading: {
    fontSize: '20px',
    marginBottom: '16px',
    color: '#333',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  } as React.CSSProperties,
  th: {
    background: '#f5f5f5',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#555',
    borderBottom: '2px solid #e0e0e0',
  } as React.CSSProperties,
  td: {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
  } as React.CSSProperties,
};
