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
    <div className="row">
      <div className="col-lg-8 col-xl-6">
        <h2 className="h4 mb-4">積立シミュレーション（NISA）</h2>

        <div className="mb-3">
          <label className="form-label fw-semibold">初期資産（円）</label>
          <input
            type="number"
            className="form-control"
            value={params.initialAsset}
            onChange={(e) => handleChange('initialAsset', e.target.value)}
            min="0"
            step="10000"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">毎月積立額（円）</label>
          <input
            type="number"
            className="form-control"
            value={params.monthlyContribution}
            onChange={(e) => handleChange('monthlyContribution', e.target.value)}
            min="0"
            step="1000"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">積立期間（年）</label>
          <input
            type="number"
            className="form-control"
            value={params.years}
            onChange={(e) => handleChange('years', e.target.value)}
            min="1"
            step="1"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">想定利回り（年率%）</label>
          <input
            type="number"
            className="form-control"
            value={params.annualReturn}
            onChange={(e) => handleChange('annualReturn', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">年間コスト（信託報酬等、年率%）</label>
          <input
            type="number"
            className="form-control"
            value={params.annualCost}
            onChange={(e) => handleChange('annualCost', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}
