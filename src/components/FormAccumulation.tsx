import type { AccumulationParams } from '../types';

interface FormAccumulationProps {
  params: AccumulationParams;
  onChange: (params: AccumulationParams) => void;
}

export default function FormAccumulation({
  params,
  onChange,
}: FormAccumulationProps) {
  const handleChange = (field: keyof AccumulationParams, value: string | boolean) => {
    if (typeof value === 'boolean') {
      onChange({
        ...params,
        [field]: value,
      });
    } else {
      const numValue = parseFloat(value) || 0;
      // Don't apply Math.max(0) to year fields - they should accept any valid year
      const finalValue = (field === 'currentYear' || field === 'withdrawalStartYear') 
        ? numValue 
        : Math.max(0, numValue);
      onChange({
        ...params,
        [field]: finalValue,
      });
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <h2 className="h5 mb-2">積立シミュレーション（NISA）</h2>

        <div className="row g-1">
          <div className="col-md-6">
            <label className="form-label fw-semibold">現在の西暦</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.currentYear}
              onChange={(e) => handleChange('currentYear', e.target.value)}
              min="2020"
              max="2100"
              step="1"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">取り崩し開始年</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.withdrawalStartYear}
              onChange={(e) => handleChange('withdrawalStartYear', e.target.value)}
              min={params.currentYear}
              max="2150"
              step="1"
            />
          </div>
        </div>

        <div className="row g-1 mt-1">
          <div className="col-md-6">
            <label className="form-label fw-semibold">初期資産（円）</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.initialAsset}
              onChange={(e) => handleChange('initialAsset', e.target.value)}
              min="0"
              step="10000"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">毎月積立額（円）</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.monthlyContribution}
              onChange={(e) => handleChange('monthlyContribution', e.target.value)}
              min="0"
              step="1000"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">積立期間（年）</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={Math.max(1, params.withdrawalStartYear - params.currentYear)}
              readOnly
              disabled
            />
            <small className="form-text text-muted">
              {params.currentYear}年〜{params.withdrawalStartYear}年（自動計算）
            </small>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">想定利回り（年率%）</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.annualReturn}
              onChange={(e) => handleChange('annualReturn', e.target.value)}
              min="0"
              step="0.1"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">年間コスト（信託報酬等、年率%）</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={params.annualCost}
              onChange={(e) => handleChange('annualCost', e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="border-top pt-2 mt-2">
          <div className="form-check mb-1">
            <input
              className="form-check-input"
              type="checkbox"
              id="considerInflation"
              checked={params.considerInflation}
              onChange={(e) => handleChange('considerInflation', e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="considerInflation">
              インフレ率を考慮する
            </label>
          </div>

          {params.considerInflation && (
            <div className="mb-1">
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
                実質利回り = 名目利回り - インフレ率
              </small>
            </div>
          )}
        </div>

        <div className="border-top pt-2 mt-2">
          <div className="form-check mb-1">
            <input
              className="form-check-input"
              type="checkbox"
              id="hasHousingLoan"
              checked={params.hasHousingLoan}
              onChange={(e) => handleChange('hasHousingLoan', e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="hasHousingLoan">
              住宅ローンあり
            </label>
          </div>

          {params.hasHousingLoan && (
            <div className="row g-1">
              <div className="col-md-6">
                <label className="form-label">ローン借入額（円）</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={params.housingLoanAmount}
                  onChange={(e) => handleChange('housingLoanAmount', e.target.value)}
                  min="0"
                  step="1000000"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">ローン金利（年率%）</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={params.housingLoanInterestRate}
                  onChange={(e) => handleChange('housingLoanInterestRate', e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">ローン返済期間（年）</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={params.housingLoanYears}
                  onChange={(e) => handleChange('housingLoanYears', e.target.value)}
                  min="1"
                  step="1"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">ローン開始年（積立開始からの年数）</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={params.housingLoanStartYear}
                  onChange={(e) => handleChange('housingLoanStartYear', e.target.value)}
                  min="1"
                  max={params.years}
                  step="1"
                />
                <small className="form-text text-muted">
                  積立開始から何年目にローンを開始するか
                </small>
              </div>
            </div>
          )}
        </div>

        <div className="border-top pt-2 mt-2">
          <div className="form-check mb-1">
            <input
              className="form-check-input"
              type="checkbox"
              id="hasNisaWithdrawal"
              checked={params.hasNisaWithdrawal}
              onChange={(e) => handleChange('hasNisaWithdrawal', e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="hasNisaWithdrawal">
              途中からNISAを取り崩す
            </label>
          </div>

          {params.hasNisaWithdrawal && (
            <div className="row g-1">
              <div className="col-md-6">
                <label className="form-label">毎月の取り崩し額（円/月）</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={params.nisaWithdrawalMonthly}
                  onChange={(e) => handleChange('nisaWithdrawalMonthly', e.target.value)}
                  min="0"
                  step="10000"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">取り崩し開始年（積立開始からの年数）</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={params.nisaWithdrawalStartYear}
                  onChange={(e) => handleChange('nisaWithdrawalStartYear', e.target.value)}
                  min="1"
                  max={params.years}
                  step="1"
                />
                <small className="form-text text-muted">
                  積立開始から何年目に取り崩しを開始するか
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
