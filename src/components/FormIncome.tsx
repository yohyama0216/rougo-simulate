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
    <div className="row">
      <div className="col-lg-8 col-xl-6">
        <h2 className="h4 mb-4">老後の月収</h2>

        <div className="mb-3">
          <label className="form-label fw-semibold">公的年金（月額、円）</label>
          <input
            type="number"
            className="form-control"
            value={params.pension}
            onChange={(e) => handleChange('pension', e.target.value)}
            min="0"
            step="1000"
          />
        </div>
      </div>
    </div>
  );
}
