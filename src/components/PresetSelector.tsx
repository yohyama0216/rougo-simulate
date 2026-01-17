import { lifestylePresets, riskPresets, type PresetConfig } from '../presets';

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetConfig) => void;
  onSkip: () => void;
}

export default function PresetSelector({ onSelectPreset, onSkip }: PresetSelectorProps) {
  return (
    <div className="container-fluid py-4" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-4">
        <h2 className="h3 fw-bold mb-2" style={{ color: '#667eea' }}>
          <i className="bi bi-rocket-takeoff me-2"></i>
          かんたんスタート
        </h2>
        <p className="text-muted">
          あなたの状況に近いプリセットを選ぶと、すぐに試算結果を確認できます。<br />
          後から詳細を調整することもできます。
        </p>
      </div>

      {/* Lifestyle Presets */}
      <div className="mb-4">
        <h3 className="h5 fw-bold mb-3">
          <i className="bi bi-house-heart me-2"></i>
          ライフスタイルから選ぶ
        </h3>
        <div className="row g-3">
          {lifestylePresets.map((preset) => (
            <div key={preset.id} className="col-md-6">
              <button
                type="button"
                className="card w-100 h-100 border-2 hover-shadow"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: '#667eea',
                }}
                onClick={() => onSelectPreset(preset)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#764ba2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="card-body p-3">
                  <h4 className="h6 fw-bold mb-2" style={{ color: '#667eea' }}>
                    {preset.name}
                  </h4>
                  <p className="small text-muted mb-0">{preset.description}</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Presets */}
      <div className="mb-4">
        <h3 className="h5 fw-bold mb-3">
          <i className="bi bi-speedometer2 me-2"></i>
          運用スタイルから選ぶ
        </h3>
        <div className="row g-3">
          {riskPresets.map((preset) => (
            <div key={preset.id} className="col-md-4">
              <button
                type="button"
                className="card w-100 h-100 border-2 hover-shadow"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: '#667eea',
                }}
                onClick={() => onSelectPreset(preset)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#764ba2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="card-body p-3 text-center">
                  <h4 className="h6 fw-bold mb-2" style={{ color: '#667eea' }}>
                    {preset.name}
                  </h4>
                  <p className="small text-muted mb-0">{preset.description}</p>
                  {preset.accumulation.annualReturn !== undefined && (
                    <p className="small mt-2 mb-0">
                      <span className="badge bg-light text-dark">
                        想定利回り: {preset.accumulation.annualReturn}%
                      </span>
                    </p>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skip button */}
      <div className="text-center mt-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onSkip}
        >
          <i className="bi bi-skip-forward me-2"></i>
          プリセットを使わず、詳細入力から始める
        </button>
      </div>

      {/* Info box */}
      <div className="alert alert-info mt-4" style={{ borderLeft: '4px solid #667eea' }}>
        <h6 className="alert-heading fw-bold mb-2">
          <i className="bi bi-info-circle me-2"></i>
          プリセットについて
        </h6>
        <p className="small mb-0">
          プリセットは一般的な条件を設定した試算例です。選択後に全ての項目を自由に変更できます。
          まずはプリセットで概算を確認し、その後ご自身の状況に合わせて調整することをお勧めします。
        </p>
      </div>
    </div>
  );
}
