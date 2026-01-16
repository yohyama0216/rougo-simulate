import type { IncomeParams, HouseholdType } from '../types';

interface FormIncomeProps {
  params: IncomeParams;
  onChange: (params: IncomeParams) => void;
}

export default function FormIncome({ params, onChange }: FormIncomeProps) {
  const handleChange = (field: keyof IncomeParams, value: string | number) => {
    const numValue = typeof value === 'string' ? (parseFloat(value) || 0) : value;
    onChange({
      ...params,
      [field]: field === 'householdType' ? value : Math.max(0, numValue),
    });
  };

  const handleHouseholdTypeChange = (type: HouseholdType) => {
    // Set default pension values based on household type
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
      </div>
    </div>
  );
}
