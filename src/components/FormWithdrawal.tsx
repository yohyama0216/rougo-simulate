import React from 'react';
import type { WithdrawalParams } from '../types';
import { formatYen } from '../lib/format';

interface FormWithdrawalProps {
  params: WithdrawalParams;
  onChange: (params: WithdrawalParams) => void;
  suggestedRetirementAsset: number;
}

export default function FormWithdrawal({
  params,
  onChange,
  suggestedRetirementAsset,
}: FormWithdrawalProps) {
  const handleChange = (field: keyof WithdrawalParams, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...params,
      [field]: Math.max(0, numValue),
    });
  };

  const useSuggested = () => {
    onChange({
      ...params,
      retirementAsset: suggestedRetirementAsset,
    });
  };

  return (
    <div style={styles.form}>
      <h2 style={styles.heading}>取り崩しシミュレーション</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          退職時資産（円）
          <div style={styles.inputWithButton}>
            <input
              type="number"
              value={params.retirementAsset}
              onChange={(e) => handleChange('retirementAsset', e.target.value)}
              style={styles.input}
              min="0"
              step="10000"
            />
            <button onClick={useSuggested} style={styles.suggestionButton}>
              積立結果を使用 ({formatYen(suggestedRetirementAsset)})
            </button>
          </div>
        </label>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          取り崩し開始年齢
          <input
            type="number"
            value={params.startAge}
            onChange={(e) => handleChange('startAge', e.target.value)}
            style={styles.input}
            min="50"
            step="1"
          />
        </label>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          取り崩し終了年齢
          <input
            type="number"
            value={params.endAge}
            onChange={(e) => handleChange('endAge', e.target.value)}
            style={styles.input}
            min="60"
            step="1"
          />
        </label>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          退職後想定利回り（年率%）
          <input
            type="number"
            value={params.annualReturn}
            onChange={(e) => handleChange('annualReturn', e.target.value)}
            style={styles.input}
            min="0"
            step="0.1"
          />
        </label>
      </div>
    </div>
  );
}

const styles = {
  form: {
    maxWidth: '600px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
    marginBottom: '4px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginTop: '4px',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  inputWithButton: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  suggestionButton: {
    padding: '8px 12px',
    fontSize: '12px',
    background: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    marginTop: '4px',
  } as React.CSSProperties,
};
