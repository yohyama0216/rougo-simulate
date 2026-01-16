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
    <div className="row">
      <div className="col-lg-8 col-xl-6">
        <h2 className="h4 mb-4">取り崩しシミュレーション</h2>

        <div className="mb-3">
          <label className="form-label fw-semibold">退職時資産（円）</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              value={params.retirementAsset}
              onChange={(e) => handleChange('retirementAsset', e.target.value)}
              min="0"
              step="10000"
            />
            <button onClick={useSuggested} className="btn btn-outline-secondary" type="button">
              積立結果を使用 ({formatYen(suggestedRetirementAsset)})
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">取り崩し開始年齢</label>
          <input
            type="number"
            className="form-control"
            value={params.startAge}
            onChange={(e) => handleChange('startAge', e.target.value)}
            min="50"
            step="1"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">取り崩し終了年齢</label>
          <input
            type="number"
            className="form-control"
            value={params.endAge}
            onChange={(e) => handleChange('endAge', e.target.value)}
            min="60"
            step="1"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">退職後想定利回り（年率%）</label>
          <input
            type="number"
            className="form-control"
            value={params.annualReturn}
            onChange={(e) => handleChange('annualReturn', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}
