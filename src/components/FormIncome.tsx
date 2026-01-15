import React from 'react';
import type { IncomeParams } from '../types';

interface FormIncomeProps {
  params: IncomeParams;
  onChange: (params: IncomeParams) => void;
}

export default function FormIncome({ params, onChange }: FormIncomeProps) {
  const handleChange = (field: keyof IncomeParams, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...params,
      [field]: Math.max(0, numValue),
    });
  };

  return (
    <div style={styles.form}>
      <h2 style={styles.heading}>老後の月収</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          公的年金（月額、円）
          <input
            type="number"
            value={params.pension}
            onChange={(e) => handleChange('pension', e.target.value)}
            style={styles.input}
            min="0"
            step="1000"
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
