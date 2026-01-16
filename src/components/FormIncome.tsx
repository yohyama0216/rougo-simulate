import type { IncomeParams, HouseholdType, IncomePeriod } from '../types';

interface FormIncomeProps {
  params: IncomeParams;
  onChange: (params: IncomeParams) => void;
}

// Fields that should be treated as strings (not converted to numbers)
const STRING_FIELDS = new Set<keyof IncomeParams>(['householdType']);

export default function FormIncome({ params, onChange }: FormIncomeProps) {
  const handleChange = (field: keyof IncomeParams, value: string | number) => {
    const processedValue = STRING_FIELDS.has(field)
      ? value
      : Math.max(0, typeof value === 'string' ? (parseFloat(value) || 0) : value);
    
    onChange({
      ...params,
      [field]: processedValue,
    });
  };

  const handleHouseholdTypeChange = (type: HouseholdType) => {
    onChange({
      ...params,
      householdType: type,
    });
  };

  // Handle income period changes for husband
  const handleHusbandPeriodChange = (id: string, field: 'annualSalary' | 'years', value: number) => {
    const updatedPeriods = params.husbandIncomePeriods.map(period =>
      period.id === id ? { ...period, [field]: Math.max(0, value) } : period
    );
    onChange({
      ...params,
      husbandIncomePeriods: updatedPeriods,
    });
  };

  const handleAddHusbandPeriod = () => {
    const newPeriod: IncomePeriod = {
      id: Date.now().toString(),
      annualSalary: 5000000,
      years: 10,
    };
    onChange({
      ...params,
      husbandIncomePeriods: [...params.husbandIncomePeriods, newPeriod],
    });
  };

  const handleRemoveHusbandPeriod = (id: string) => {
    if (params.husbandIncomePeriods.length > 1) {
      onChange({
        ...params,
        husbandIncomePeriods: params.husbandIncomePeriods.filter(p => p.id !== id),
      });
    }
  };

  // Handle income period changes for wife
  const handleWifePeriodChange = (id: string, field: 'annualSalary' | 'years', value: number) => {
    const updatedPeriods = params.wifeIncomePeriods.map(period =>
      period.id === id ? { ...period, [field]: Math.max(0, value) } : period
    );
    onChange({
      ...params,
      wifeIncomePeriods: updatedPeriods,
    });
  };

  const handleAddWifePeriod = () => {
    const newPeriod: IncomePeriod = {
      id: Date.now().toString(),
      annualSalary: 3000000,
      years: 10,
    };
    onChange({
      ...params,
      wifeIncomePeriods: [...params.wifeIncomePeriods, newPeriod],
    });
  };

  const handleRemoveWifePeriod = (id: string) => {
    if (params.wifeIncomePeriods.length > 1) {
      onChange({
        ...params,
        wifeIncomePeriods: params.wifeIncomePeriods.filter(p => p.id !== id),
      });
    }
  };

  // Calculate total years for display
  const husbandTotalYears = params.husbandIncomePeriods.reduce((sum, p) => sum + p.years, 0);
  const wifeTotalYears = params.wifeIncomePeriods.reduce((sum, p) => sum + p.years, 0);

  return (
    <div className="row">
      <div className="col-12">
        <h2 className="h5 mb-3 fw-bold" style={{ color: '#667eea' }}>
          <i className="bi bi-calculator me-2"></i>年金目安額
        </h2>

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold small text-secondary">世帯タイプ</label>
            <select
              className="form-select form-select-sm shadow-sm"
              value={params.householdType}
              onChange={(e) => handleHouseholdTypeChange(e.target.value as HouseholdType)}
              style={{ borderColor: '#667eea' }}
            >
              <option value="single">夫のみ（会社員）</option>
              <option value="dualIncome">夫婦共働き（両方会社員）</option>
              <option value="partTime">妻がパート（第3号被保険者）</option>
              <option value="selfEmployed">妻が個人事業主</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold small text-secondary">年金開始年齢</label>
            <input
              type="number"
              className="form-control form-control-sm shadow-sm"
              value={params.pensionStartAge}
              onChange={(e) => handleChange('pensionStartAge', e.target.value)}
              min="60"
              max="75"
              step="1"
              style={{ borderColor: '#667eea' }}
            />
          </div>
        </div>

        {/* Husband's income periods */}
        <div className="card mb-2 shadow-sm" style={{ border: '1px solid #e0e7ff' }}>
          <div className="card-header py-2 d-flex justify-content-between align-items-center" 
               style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8edff 100%)', borderBottom: '2px solid #667eea' }}>
            <h5 className="mb-0 h6 fw-bold" style={{ color: '#667eea' }}>
              <i className="bi bi-person-circle me-2"></i>夫の収入期間 
              <span className="badge bg-primary ms-2" style={{ fontSize: '0.75em' }}>合計 {husbandTotalYears}年</span>
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-primary shadow-sm"
              onClick={handleAddHusbandPeriod}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
            >
              <i className="bi bi-plus-circle me-1"></i>期間追加
            </button>
          </div>
          <div className="card-body py-2" style={{ backgroundColor: '#fafbff' }}>
            {params.husbandIncomePeriods.map((period, index) => (
              <div key={period.id} className="row g-2 mb-2 p-2 align-items-center rounded" 
                   style={{ backgroundColor: 'white', border: '1px solid #e0e7ff' }}>
                <div className="col-1 text-center">
                  <div className="badge rounded-pill" style={{ backgroundColor: '#667eea', fontSize: '0.7em' }}>
                    #{index + 1}
                  </div>
                </div>
                <div className="col-5">
                  <label className="form-label fw-semibold mb-1 small text-secondary">
                    年収（税込、円）
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm shadow-sm"
                    value={period.annualSalary}
                    onChange={(e) => handleHusbandPeriodChange(period.id, 'annualSalary', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100000"
                    style={{ borderColor: '#d1d9ff' }}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label fw-semibold mb-1 small text-secondary">
                    加入年数（年）
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm shadow-sm"
                    value={period.years}
                    onChange={(e) => handleHusbandPeriodChange(period.id, 'years', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="50"
                    step="1"
                    style={{ borderColor: '#d1d9ff' }}
                  />
                </div>
                <div className="col-2 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger w-100 shadow-sm"
                    onClick={() => handleRemoveHusbandPeriod(period.id)}
                    disabled={params.husbandIncomePeriods.length === 1}
                    style={{ fontSize: '0.7em', padding: '0.35rem' }}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            ))}
            <small className="form-text text-muted d-block mt-2 fst-italic">
              <i className="bi bi-info-circle me-1"></i>厚生年金の計算: 各期間の年収と加入年数を考慮して計算します
            </small>
          </div>
        </div>

        {/* Wife's income periods */}
        {params.householdType !== 'single' && (
          <div className="card mb-2 shadow-sm" style={{ border: '1px solid #ffe0f0' }}>
            <div className="card-header py-2 d-flex justify-content-between align-items-center" 
                 style={{ background: 'linear-gradient(135deg, #fff0f7 0%, #ffe8f3 100%)', borderBottom: '2px solid #d946b2' }}>
              <h5 className="mb-0 h6 fw-bold" style={{ color: '#d946b2' }}>
                <i className="bi bi-person-circle me-2"></i>妻の収入期間 
                <span className="badge ms-2" style={{ fontSize: '0.75em', backgroundColor: '#d946b2' }}>合計 {wifeTotalYears}年</span>
              </h5>
              <button
                type="button"
                className="btn btn-sm shadow-sm"
                onClick={handleAddWifePeriod}
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #d946b2 100%)', border: 'none', color: 'white' }}
              >
                <i className="bi bi-plus-circle me-1"></i>期間追加
              </button>
            </div>
            <div className="card-body py-2" style={{ backgroundColor: '#fffafc' }}>
              {params.wifeIncomePeriods.map((period, index) => (
                <div key={period.id} className="row g-2 mb-2 p-2 align-items-center rounded" 
                     style={{ backgroundColor: 'white', border: '1px solid #ffe0f0' }}>
                  <div className="col-1 text-center">
                    <div className="badge rounded-pill" style={{ backgroundColor: '#d946b2', fontSize: '0.7em' }}>
                      #{index + 1}
                    </div>
                  </div>
                  <div className="col-5">
                    <label className="form-label fw-semibold mb-1 small text-secondary">
                      {params.householdType === 'dualIncome' ? '年収（税込、円）' : '年収（参考値）'}
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm shadow-sm"
                      value={period.annualSalary}
                      onChange={(e) => handleWifePeriodChange(period.id, 'annualSalary', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="100000"
                      disabled={params.householdType !== 'dualIncome'}
                      style={{ borderColor: '#ffd1e9' }}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-semibold mb-1 small text-secondary">
                      加入年数（年）
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm shadow-sm"
                      value={period.years}
                      onChange={(e) => handleWifePeriodChange(period.id, 'years', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="50"
                      step="1"
                      style={{ borderColor: '#ffd1e9' }}
                    />
                  </div>
                  <div className="col-2 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger w-100 shadow-sm"
                      onClick={() => handleRemoveWifePeriod(period.id)}
                      disabled={params.wifeIncomePeriods.length === 1}
                      style={{ fontSize: '0.7em', padding: '0.35rem' }}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              ))}
              <small className="form-text text-muted d-block mt-2 fst-italic">
                <i className="bi bi-info-circle me-1"></i>
                {params.householdType === 'dualIncome' && '厚生年金の計算: 各期間の年収と加入年数を考慮して計算します'}
                {params.householdType === 'partTime' && '国民年金（第3号被保険者）の計算: 加入年数のみを使用（年収は無関係）'}
                {params.householdType === 'selfEmployed' && '国民年金の計算: 加入年数のみを使用（年収は無関係）'}
              </small>
            </div>
          </div>
        )}

        {/* Calculation Formula Explanation */}
        <div className="alert alert-info py-2 mb-0 shadow-sm" style={{ borderLeft: '4px solid #667eea', backgroundColor: '#f0f4ff' }}>
          <h6 className="alert-heading mb-2 fw-bold" style={{ color: '#667eea' }}>
            <i className="bi bi-lightbulb me-2"></i>年金計算式
          </h6>
          <div className="small">
            <p className="mb-2">
              <strong style={{ color: '#667eea' }}>厚生年金の計算式：</strong>
            </p>
            <p className="mb-1 ps-3" style={{ fontFamily: 'monospace', fontSize: '0.85em', backgroundColor: 'white', padding: '0.5rem', borderRadius: '4px' }}>
              月額年金 = 国民年金（基礎年金）+ 厚生年金部分
            </p>
            <p className="mb-2 ps-3" style={{ fontFamily: 'monospace', fontSize: '0.85em', backgroundColor: 'white', padding: '0.5rem', borderRadius: '4px' }}>
              厚生年金部分 = Σ(各期間の月収 × 0.005481 × その期間の月数)
            </p>
            <p className="mb-2">
              <strong style={{ color: '#667eea' }}>国民年金の計算式：</strong>
            </p>
            <p className="mb-2 ps-3" style={{ fontFamily: 'monospace', fontSize: '0.85em', backgroundColor: 'white', padding: '0.5rem', borderRadius: '4px' }}>
              月額年金 = ¥68,000 × (合計加入年数 / 40年)
            </p>
            <p className="mb-0 text-muted fst-italic" style={{ fontSize: '0.8em' }}>
              <i className="bi bi-exclamation-circle me-1"></i>
              計算は簡略化されており、実際の年金額とは異なる場合があります<br />
              給付乗率0.005481は2003年4月以降の報酬に適用される値です<br />
              複数の収入期間を入力することで、より正確な年金額を計算できます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
