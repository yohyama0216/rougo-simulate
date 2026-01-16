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
  const handleChange = (field: keyof WithdrawalParams, value: string | boolean) => {
    if (typeof value === 'boolean') {
      onChange({
        ...params,
        [field]: value,
      });
    } else if (field === 'elderCareRecipient') {
      onChange({
        ...params,
        [field]: value as 'husband' | 'wife' | 'none',
      });
    } else {
      const numValue = parseFloat(value) || 0;
      onChange({
        ...params,
        [field]: Math.max(0, numValue),
      });
    }
  };

  const useSuggested = () => {
    onChange({
      ...params,
      retirementAsset: suggestedRetirementAsset,
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <h2 className="h5 mb-3">取り崩しシミュレーション</h2>

        <div className="mb-2">
          <label className="form-label fw-semibold">退職時資産（円）</label>
          <div className="input-group input-group-sm">
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

        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label fw-semibold">取り崩し開始年齢</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.startAge}
              onChange={(e) => handleChange('startAge', e.target.value)}
              min="50"
              step="1"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">取り崩し終了年齢</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.endAge}
              onChange={(e) => handleChange('endAge', e.target.value)}
              min="60"
              step="1"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">退職後想定利回り（年率%）</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.annualReturn}
              onChange={(e) => handleChange('annualReturn', e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="border-top pt-2 mt-3">
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="considerInflationWithdrawal"
              checked={params.considerInflation}
              onChange={(e) => handleChange('considerInflation', e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="considerInflationWithdrawal">
              インフレ率を考慮する
            </label>
          </div>

          {params.considerInflation && (
            <div className="mb-2">
              <label className="form-label">インフレ率（年率%）</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={params.inflationRate}
                onChange={(e) => handleChange('inflationRate', e.target.value)}
                min="0"
                step="0.1"
              />
              <small className="form-text text-muted">
                毎年の取り崩し額がインフレ率に応じて増加します
              </small>
            </div>
          )}
        </div>

        <div className="border-top pt-2 mt-3">
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="hasElderCare"
              checked={params.hasElderCare}
              onChange={(e) => handleChange('hasElderCare', e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="hasElderCare">
              介護費用あり（デイケア等）
            </label>
          </div>

          {params.hasElderCare && (
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label">介護を受ける方</label>
                <select
                  className="form-select form-select-sm"
                  value={params.elderCareRecipient}
                  onChange={(e) => handleChange('elderCareRecipient', e.target.value)}
                >
                  <option value="none">選択してください</option>
                  <option value="husband">夫</option>
                  <option value="wife">妻</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">月額介護費用（円）</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={params.elderCareMonthly}
                  onChange={(e) => handleChange('elderCareMonthly', e.target.value)}
                  min="0"
                  step="10000"
                />
                <small className="form-text text-muted">
                  デイケア、訪問介護等の費用
                </small>
              </div>

              <div className="col-md-4">
                <label className="form-label">介護開始年齢</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={params.elderCareStartAge}
                  onChange={(e) => handleChange('elderCareStartAge', e.target.value)}
                  min={params.startAge}
                  max={params.endAge}
                  step="1"
                />
                <small className="form-text text-muted">
                  {params.elderCareRecipient === 'husband' && '夫が'}
                  {params.elderCareRecipient === 'wife' && '妻が'}
                  介護を開始する年齢
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
