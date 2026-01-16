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
      onChange({
        ...params,
        [field]: Math.max(0, numValue),
      });
    }
  };

  return (
    <div className="row">
      <div className="col-lg-10 col-xl-8">
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

        <div className="border-top pt-3 mt-4">
          <div className="form-check mb-3">
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
            <div className="mb-3">
              <label className="form-label">インフレ率（年率%）</label>
              <input
                type="number"
                className="form-control"
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

        <div className="border-top pt-3 mt-4">
          <div className="form-check mb-3">
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
            <>
              <div className="mb-3">
                <label className="form-label">ローン借入額（円）</label>
                <input
                  type="number"
                  className="form-control"
                  value={params.housingLoanAmount}
                  onChange={(e) => handleChange('housingLoanAmount', e.target.value)}
                  min="0"
                  step="1000000"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">ローン金利（年率%）</label>
                <input
                  type="number"
                  className="form-control"
                  value={params.housingLoanInterestRate}
                  onChange={(e) => handleChange('housingLoanInterestRate', e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">ローン返済期間（年）</label>
                <input
                  type="number"
                  className="form-control"
                  value={params.housingLoanYears}
                  onChange={(e) => handleChange('housingLoanYears', e.target.value)}
                  min="1"
                  step="1"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">ローン開始年（積立開始からの年数）</label>
                <input
                  type="number"
                  className="form-control"
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
            </>
          )}
        </div>

        <div className="border-top pt-3 mt-4">
          <div className="form-check mb-3">
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
            <>
              <div className="mb-3">
                <label className="form-label">毎月の取り崩し額（円/月）</label>
                <input
                  type="number"
                  className="form-control"
                  value={params.nisaWithdrawalMonthly}
                  onChange={(e) => handleChange('nisaWithdrawalMonthly', e.target.value)}
                  min="0"
                  step="10000"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">取り崩し開始年（積立開始からの年数）</label>
                <input
                  type="number"
                  className="form-control"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
