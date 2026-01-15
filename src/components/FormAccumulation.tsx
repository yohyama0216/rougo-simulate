import React from 'react';
import type { AccumulationParams } from '../types';

interface FormAccumulationProps {
  params: AccumulationParams;
  onChange: (params: AccumulationParams) => void;
}

export default function FormAccumulation({
  params,
  onChange,
}: FormAccumulationProps) {
  const handleChange = (field: keyof AccumulationParams, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...params,
      [field]: Math.max(0, numValue),
    });
  };

  return (
    <div style={styles.form}>
      <h2 style={styles.heading}>積立シミュレーション（NISA）</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          初期資産（円）
          <input
            type="number"
            value={params.initialAsset}
            onChange={(e) => handleChange('initialAsset', e.target.value)}
            style={styles.input}
            min="0"
            step="10000"
          />
        </label>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          毎月積立額（円）
          <input
            type="number"
            value={params.monthlyContribution}
            onChange={(e) => handleChange('monthlyContribution', e.target.value)}
            style={styles.input}
            min="0"
            step="1000"
          />
        </label>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          積立期間（年）
          <input
            type="number"
            value={params.years}
            onChange={(e) => handleChange('years', e.target.value)}
            style={styles.input}
            min="1"
            step="1"
          />
        </label>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          想定利回り（年率%）
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

      <div style={styles.formGroup}>
        <label style={styles.label}>
          年間コスト（信託報酬等、年率%）
          <input
            type="number"
            value={params.annualCost}
            onChange={(e) => handleChange('annualCost', e.target.value)}
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
};
