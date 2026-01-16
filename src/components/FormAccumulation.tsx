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
        <h2 className="h5 mb-3 fw-bold" style={{ color: '#667eea' }}>
          <i className="bi bi-piggy-bank-fill me-2"></i>積立シミュレーション（NISA）
        </h2>

        <div className="row g-1">
          <div className="col-md-6">
            <label className="form-label fw-semibold small text-secondary">現在の西暦</label>
            <input
              type="number"
              className="form-control form-control-sm shadow-sm"
              value={params.currentYear}
              onChange={(e) => handleChange('currentYear', e.target.value)}
              min="2020"
              max="2100"
              step="1"
              style={{ borderColor: '#667eea' }}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold small text-secondary">取り崩し開始年</label>
            <input
              type="number"
              className="form-control form-control-sm shadow-sm"
              value={params.withdrawalStartYear}
              onChange={(e) => handleChange('withdrawalStartYear', e.target.value)}
              min={params.currentYear}
              max="2150"
              step="1"
              style={{ borderColor: '#667eea' }}
            />
          </div>
        </div>

        <div className="row g-2 mt-1">
          <div className="col-md-6">
            <label className="form-label fw-semibold small text-secondary">初期資産（円）</label>
            <input
              type="number"
              className="form-control form-control-sm shadow-sm"
              value={params.initialAsset}
              onChange={(e) => handleChange('initialAsset', e.target.value)}
              min="0"
              step="10000"
              style={{ borderColor: '#667eea' }}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold small text-secondary">毎月積立額（円）</label>
            <input
              type="number"
              className="form-control form-control-sm shadow-sm"
              value={params.monthlyContribution}
              onChange={(e) => handleChange('monthlyContribution', e.target.value)}
              min="0"
              step="1000"
              style={{ borderColor: '#667eea' }}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold small text-secondary">積立期間（年）</label>
            <input
              type="number"
              className="form-control form-control-sm shadow-sm"
              value={Math.max(1, params.withdrawalStartYear - params.currentYear)}
              readOnly
              disabled
            />
            <small className="form-text text-muted fst-italic" style={{ fontSize: '0.8em' }}>
              {params.currentYear}年〜{params.withdrawalStartYear}年（自動計算）
            </small>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold small text-secondary">想定利回り（年率%）</label>
            <input
              type="number"
              className="form-control form-control-sm shadow-sm"
              value={params.annualReturn}
              onChange={(e) => handleChange('annualReturn', e.target.value)}
              min="0"
              step="0.1"
              style={{ borderColor: '#667eea' }}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold small text-secondary">年間コスト（信託報酬等、年率%）</label>
            <input
              type="number"
              className="form-control form-control-sm shadow-sm"
              value={params.annualCost}
              onChange={(e) => handleChange('annualCost', e.target.value)}
              min="0"
              step="0.1"
              style={{ borderColor: '#667eea' }}
            />
          </div>
        </div>

        <div className="card mt-2 shadow-sm" style={{ border: '1px solid #e0e7ff' }}>
          <div className="card-body py-2" style={{ backgroundColor: '#fafbff' }}>
            <div className="form-check mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="considerInflation"
                checked={params.considerInflation}
                onChange={(e) => handleChange('considerInflation', e.target.checked)}
              />
              <label className="form-check-label fw-semibold" htmlFor="considerInflation">
                <i className="bi bi-graph-up-arrow me-1"></i>インフレ率を考慮する
              </label>
            </div>

            {params.considerInflation && (
              <div className="mb-1 mt-2">
                <label className="form-label fw-semibold small text-secondary">インフレ率（年率%）</label>
                <input
                  type="number"
                  className="form-control form-control-sm shadow-sm"
                  value={params.inflationRate}
                  onChange={(e) => handleChange('inflationRate', e.target.value)}
                  min="0"
                  step="0.1"
                  style={{ borderColor: '#d1d9ff' }}
                />
                <small className="form-text text-muted fst-italic" style={{ fontSize: '0.8em' }}>
                  <i className="bi bi-info-circle me-1"></i>実質利回り = 名目利回り - インフレ率
                </small>
              </div>
            )}
          </div>
        </div>

        <div className="card mt-2 shadow-sm" style={{ border: '1px solid #e0e7ff' }}>
          <div className="card-body py-2" style={{ backgroundColor: '#fafbff' }}>
            <div className="form-check mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="hasHousingLoan"
                checked={params.hasHousingLoan}
                onChange={(e) => handleChange('hasHousingLoan', e.target.checked)}
              />
              <label className="form-check-label fw-semibold" htmlFor="hasHousingLoan">
                <i className="bi bi-house-door-fill me-1"></i>住宅ローンあり
              </label>
            </div>

            {params.hasHousingLoan && (
              <div className="row g-2 mt-2">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">ローン借入額（円）</label>
                  <input
                    type="number"
                    className="form-control form-control-sm shadow-sm"
                    value={params.housingLoanAmount}
                    onChange={(e) => handleChange('housingLoanAmount', e.target.value)}
                    min="0"
                    step="1000000"
                    style={{ borderColor: '#d1d9ff' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">ローン金利（年率%）</label>
                  <input
                    type="number"
                    className="form-control form-control-sm shadow-sm"
                    value={params.housingLoanInterestRate}
                    onChange={(e) => handleChange('housingLoanInterestRate', e.target.value)}
                    min="0"
                    step="0.1"
                    style={{ borderColor: '#d1d9ff' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">ローン返済期間（年）</label>
                  <input
                    type="number"
                    className="form-control form-control-sm shadow-sm"
                    value={params.housingLoanYears}
                    onChange={(e) => handleChange('housingLoanYears', e.target.value)}
                    min="1"
                    step="1"
                    style={{ borderColor: '#d1d9ff' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">ローン開始年（積立開始からの年数）</label>
                  <input
                    type="number"
                    className="form-control form-control-sm shadow-sm"
                    value={params.housingLoanStartYear}
                    onChange={(e) => handleChange('housingLoanStartYear', e.target.value)}
                    min="1"
                    max={params.years}
                    step="1"
                    style={{ borderColor: '#d1d9ff' }}
                  />
                  <small className="form-text text-muted fst-italic" style={{ fontSize: '0.8em' }}>
                    <i className="bi bi-info-circle me-1"></i>積立開始から何年目にローンを開始するか
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card mt-2 shadow-sm" style={{ border: '1px solid #e0e7ff' }}>
          <div className="card-body py-2" style={{ backgroundColor: '#fafbff' }}>
            <div className="form-check mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="hasNisaWithdrawal"
                checked={params.hasNisaWithdrawal}
                onChange={(e) => handleChange('hasNisaWithdrawal', e.target.checked)}
              />
              <label className="form-check-label fw-semibold" htmlFor="hasNisaWithdrawal">
                <i className="bi bi-cash-coin me-1"></i>途中からNISAを取り崩す
              </label>
            </div>

            {params.hasNisaWithdrawal && (
              <div className="row g-2 mt-2">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">毎月の取り崩し額（円/月）</label>
                  <input
                    type="number"
                    className="form-control form-control-sm shadow-sm"
                    value={params.nisaWithdrawalMonthly}
                    onChange={(e) => handleChange('nisaWithdrawalMonthly', e.target.value)}
                    min="0"
                    step="10000"
                    style={{ borderColor: '#d1d9ff' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">取り崩し開始年（積立開始からの年数）</label>
                  <input
                    type="number"
                    className="form-control form-control-sm shadow-sm"
                    value={params.nisaWithdrawalStartYear}
                    onChange={(e) => handleChange('nisaWithdrawalStartYear', e.target.value)}
                    min="1"
                    max={params.years}
                    step="1"
                    style={{ borderColor: '#d1d9ff' }}
                  />
                  <small className="form-text text-muted fst-italic" style={{ fontSize: '0.8em' }}>
                    <i className="bi bi-info-circle me-1"></i>積立開始から何年目に取り崩しを開始するか
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
