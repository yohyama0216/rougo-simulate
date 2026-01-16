import type { IncomeParams, HouseholdType, PensionInputMode } from '../types';

interface FormIncomeProps {
  params: IncomeParams;
  onChange: (params: IncomeParams) => void;
}

// Fields that should be treated as strings (not converted to numbers)
const STRING_FIELDS = new Set<keyof IncomeParams>(['householdType', 'pensionInputMode']);

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
    // Set default pension values based on household type (for manual mode)
    let husbandPension = params.husbandPension;
    let wifePension = params.wifePension;

    switch (type) {
      case 'single':
        // 夫のみ: 厚生年金（会社員）
        husbandPension = 150000;
        wifePension = 0;
        break;
      case 'dualIncome':
        // 夫婦共働き: 両方とも厚生年金
        husbandPension = 150000;
        wifePension = 120000;
        break;
      case 'partTime':
        // 妻パート: 夫は厚生年金、妻は国民年金（第3号被保険者）
        husbandPension = 150000;
        wifePension = 65000;
        break;
      case 'selfEmployed':
        // 妻が個人事業主: 夫は厚生年金、妻は国民年金
        husbandPension = 150000;
        wifePension = 65000;
        break;
    }

    onChange({
      ...params,
      householdType: type,
      husbandPension,
      wifePension,
    });
  };

  return (
    <div className="row">
      <div className="col-lg-8 col-xl-6">
        <h2 className="h4 mb-4">老後の月収</h2>

        <div className="mb-3">
          <label className="form-label fw-semibold">世帯タイプ</label>
          <select
            className="form-select"
            value={params.householdType}
            onChange={(e) => handleHouseholdTypeChange(e.target.value as HouseholdType)}
          >
            <option value="single">夫のみ（会社員）</option>
            <option value="dualIncome">夫婦共働き（両方会社員）</option>
            <option value="partTime">妻がパート（第3号被保険者）</option>
            <option value="selfEmployed">妻が個人事業主</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">年金の入力方法</label>
          <select
            className="form-select"
            value={params.pensionInputMode}
            onChange={(e) => handleChange('pensionInputMode', e.target.value as PensionInputMode)}
          >
            <option value="manual">年金額を直接入力</option>
            <option value="calculate">現在の年収から計算</option>
          </select>
        </div>

        {params.pensionInputMode === 'manual' ? (
          <>
            <div className="mb-3">
              <label className="form-label fw-semibold">夫の年金（月額、円）</label>
              <input
                type="number"
                className="form-control"
                value={params.husbandPension}
                onChange={(e) => handleChange('husbandPension', e.target.value)}
                min="0"
                step="1000"
              />
              <small className="form-text text-muted">
                {params.householdType === 'single' && '厚生年金（会社員）の平均'}
                {params.householdType !== 'single' && '厚生年金'}
              </small>
            </div>

            {params.householdType !== 'single' && (
              <div className="mb-3">
                <label className="form-label fw-semibold">妻の年金（月額、円）</label>
                <input
                  type="number"
                  className="form-control"
                  value={params.wifePension}
                  onChange={(e) => handleChange('wifePension', e.target.value)}
                  min="0"
                  step="1000"
                />
                <small className="form-text text-muted">
                  {params.householdType === 'dualIncome' && '厚生年金（会社員）'}
                  {params.householdType === 'partTime' && '国民年金（第3号被保険者）の満額'}
                  {params.householdType === 'selfEmployed' && '国民年金（個人事業主）の満額'}
                </small>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Husband's income inputs */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h5 className="mb-0 h6">夫の情報</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    平均年収（税込、円）
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={params.husbandAnnualSalary}
                    onChange={(e) => handleChange('husbandAnnualSalary', e.target.value)}
                    min="0"
                    step="100000"
                  />
                  <small className="form-text text-muted">
                    現役時代の平均的な年収（税込）を入力してください
                  </small>
                </div>
                <div className="mb-0">
                  <label className="form-label fw-semibold">
                    厚生年金加入期間（年）
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={params.husbandWorkingYears}
                    onChange={(e) => handleChange('husbandWorkingYears', e.target.value)}
                    min="0"
                    max="50"
                    step="1"
                  />
                  <small className="form-text text-muted">
                    厚生年金に加入する年数（通常20歳〜60歳で40年）
                  </small>
                </div>
              </div>
            </div>

            {/* Wife's income inputs */}
            {params.householdType !== 'single' && (
              <div className="card mb-3">
                <div className="card-header bg-light">
                  <h5 className="mb-0 h6">妻の情報</h5>
                </div>
                <div className="card-body">
                  {params.householdType === 'dualIncome' ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          平均年収（税込、円）
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={params.wifeAnnualSalary}
                          onChange={(e) => handleChange('wifeAnnualSalary', e.target.value)}
                          min="0"
                          step="100000"
                        />
                        <small className="form-text text-muted">
                          現役時代の平均的な年収（税込）を入力してください
                        </small>
                      </div>
                      <div className="mb-0">
                        <label className="form-label fw-semibold">
                          厚生年金加入期間（年）
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={params.wifeWorkingYears}
                          onChange={(e) => handleChange('wifeWorkingYears', e.target.value)}
                          min="0"
                          max="50"
                          step="1"
                        />
                        <small className="form-text text-muted">
                          厚生年金に加入する年数（通常20歳〜60歳で40年）
                        </small>
                      </div>
                    </>
                  ) : (
                    <div className="mb-0">
                      <label className="form-label fw-semibold">
                        国民年金加入期間（年）
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={params.wifeWorkingYears}
                        onChange={(e) => handleChange('wifeWorkingYears', e.target.value)}
                        min="0"
                        max="50"
                        step="1"
                      />
                      <small className="form-text text-muted">
                        国民年金の加入年数（最大40年で満額）
                      </small>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calculation Formula Explanation */}
            <div className="alert alert-info">
              <h6 className="alert-heading mb-2">
                <i className="bi bi-info-circle"></i> 年金計算式
              </h6>
              <div className="small">
                <p className="mb-2">
                  <strong>厚生年金の計算式：</strong>
                </p>
                <p className="mb-2" style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>
                  月額年金 = 国民年金（基礎年金）+ 厚生年金部分
                </p>
                <p className="mb-2" style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>
                  厚生年金部分 = 平均月収 × 0.005481 × 加入月数
                </p>
                <p className="mb-2">
                  <strong>国民年金の計算式：</strong>
                </p>
                <p className="mb-2" style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>
                  月額年金 = ¥68,000 × (加入年数 / 40年)
                </p>
                <p className="mb-0 text-muted" style={{ fontSize: '0.85em' }}>
                  ※ 計算は簡略化されており、実際の年金額とは異なる場合があります<br />
                  ※ 給付乗率0.005481は2003年4月以降の報酬に適用される値です
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
