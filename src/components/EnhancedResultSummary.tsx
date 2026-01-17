import type { AccumulationResult, WithdrawalResult, IncomeResult, WithdrawalParams } from '../types';

interface EnhancedResultSummaryProps {
  accumulationResult: AccumulationResult;
  withdrawalResult: WithdrawalResult;
  incomeResult: IncomeResult;
  withdrawalParams: WithdrawalParams;
  onEdit: () => void;
}

export default function EnhancedResultSummary({
  accumulationResult,
  withdrawalResult,
  incomeResult,
  withdrawalParams,
  onEdit,
}: EnhancedResultSummaryProps) {
  // Calculate key metrics
  const isSustainable = withdrawalResult.depletionAge >= withdrawalParams.endAge;
  const shortfallYears = isSustainable ? 0 : withdrawalParams.endAge - withdrawalResult.depletionAge;
  const monthlyShortfall = isSustainable ? 0 : Math.ceil(shortfallYears * 12 * withdrawalResult.monthlyWithdrawal / (withdrawalParams.endAge - withdrawalParams.startAge));

  // Determine status
  const getStatus = () => {
    if (isSustainable) {
      return {
        type: 'success' as const,
        icon: 'check-circle-fill',
        title: '資金は計画期間を通じて持続します',
        color: '#28a745',
      };
    } else if (shortfallYears <= 5) {
      return {
        type: 'warning' as const,
        icon: 'exclamation-triangle-fill',
        title: `資金が約${shortfallYears}年早く枯渇する可能性があります`,
        color: '#ffc107',
      };
    } else {
      return {
        type: 'danger' as const,
        icon: 'x-circle-fill',
        title: `資金が${shortfallYears}年以上早く枯渇する可能性があります`,
        color: '#dc3545',
      };
    }
  };

  const status = getStatus();

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1000px' }}>
      {/* Main Result Card */}
      <div className="card shadow-lg border-0 mb-4">
        <div 
          className="card-header text-white py-4"
          style={{ background: `linear-gradient(135deg, ${status.color} 0%, ${status.color}dd 100%)` }}
        >
          <h2 className="h4 mb-0 text-center">
            <i className={`bi bi-${status.icon} me-2`}></i>
            {status.title}
          </h2>
        </div>
        <div className="card-body p-4">
          {/* Key Metrics Row */}
          <div className="row g-4 mb-4">
            {/* Monthly Income */}
            <div className="col-md-4">
              <div className="text-center p-3 bg-light rounded">
                <div className="small text-muted mb-1">老後の月収</div>
                <div className="h3 fw-bold mb-1" style={{ color: '#667eea' }}>
                  ¥{incomeResult.totalMonthlyIncome.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                </div>
                <div className="small text-muted">
                  年金 + 取り崩し
                </div>
              </div>
            </div>

            {/* Asset Duration */}
            <div className="col-md-4">
              <div className="text-center p-3 bg-light rounded">
                <div className="small text-muted mb-1">資産持続期間</div>
                <div className="h3 fw-bold mb-1" style={{ color: status.color }}>
                  {withdrawalResult.yearsUntilDepletion.toFixed(1)}年
                </div>
                <div className="small text-muted">
                  {Math.floor(withdrawalResult.depletionAge)}歳まで
                </div>
              </div>
            </div>

            {/* Final Asset */}
            <div className="col-md-4">
              <div className="text-center p-3 bg-light rounded">
                <div className="small text-muted mb-1">退職時資産</div>
                <div className="h3 fw-bold mb-1" style={{ color: '#667eea' }}>
                  ¥{(accumulationResult.finalAsset / 10000).toFixed(0)}
                  <span className="small">万円</span>
                </div>
                <div className="small text-success">
                  運用益 ¥{(accumulationResult.totalGain / 10000).toFixed(0)}万円
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="border-top pt-3 mb-3">
            <h5 className="h6 fw-bold mb-3">
              <i className="bi bi-list-check me-2"></i>
              詳細内訳
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="small text-muted mb-1">年金（月額）</div>
                <div className="fw-bold">
                  ¥{incomeResult.totalPension.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="col-md-6">
                <div className="small text-muted mb-1">資産取り崩し（月額）</div>
                <div className="fw-bold">
                  ¥{withdrawalResult.monthlyWithdrawal.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          {!isSustainable && (
            <div className="alert alert-warning mt-3 mb-0">
              <h6 className="alert-heading fw-bold mb-2">
                <i className="bi bi-lightbulb me-2"></i>
                改善アドバイス
              </h6>
              <ul className="small mb-0">
                <li>毎月の積立額を増やす（現在の¥100,000から増額）</li>
                <li>退職後の生活費を見直す（月額¥{withdrawalResult.monthlyWithdrawal.toLocaleString()}を削減）</li>
                <li>年金受給開始を遅らせる（65歳→70歳で約40%増額）</li>
                {monthlyShortfall > 0 && (
                  <li>不足分は月額約¥{monthlyShortfall.toLocaleString()}の追加積立で補えます</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2 justify-content-center">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onEdit}
        >
          <i className="bi bi-pencil me-2"></i>
          条件を調整する
        </button>
        <button
          type="button"
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
          onClick={() => {
            const url = new URL(window.location.href);
            navigator.clipboard.writeText(url.toString());
            alert('URLをコピーしました！\nこのURLを保存しておくと、後で同じ条件で確認できます。');
          }}
        >
          <i className="bi bi-share me-2"></i>
          結果を保存・共有
        </button>
      </div>
    </div>
  );
}
