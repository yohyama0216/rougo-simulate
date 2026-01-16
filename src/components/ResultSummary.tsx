import type {
  AccumulationResult,
  WithdrawalResult,
  IncomeResult,
} from '../types';
import { formatYen } from '../lib/format';

interface ResultSummaryProps {
  activeTab: number;
  accumulationResult: AccumulationResult;
  withdrawalResult: WithdrawalResult;
  incomeResult: IncomeResult;
}

export default function ResultSummary({
  activeTab,
  accumulationResult,
  withdrawalResult,
  incomeResult,
}: ResultSummaryProps) {
  if (activeTab === 0) {
    return (
      <div className="bg-light p-3 rounded mt-3">
        <h3 className="h6 mb-2">積立結果</h3>
        <div className="row g-2">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body py-2">
                <div className="text-muted small mb-1">最終資産</div>
                <div className="h5 text-primary fw-bold mb-0">
                  {formatYen(accumulationResult.finalAsset)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body py-2">
                <div className="text-muted small mb-1">元本合計</div>
                <div className="h5 text-primary fw-bold mb-0">
                  {formatYen(accumulationResult.totalContribution)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body py-2">
                <div className="text-muted small mb-1">運用益</div>
                <div className="h5 text-primary fw-bold mb-0">
                  {formatYen(accumulationResult.totalGain)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 1) {
    return (
      <div className="bg-light p-3 rounded mt-3">
        <h3 className="h6 mb-2">取り崩し結果</h3>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body py-2">
                <div className="text-muted small mb-1">枯渇しない月額取り崩し</div>
                <div className="h5 text-primary fw-bold mb-0">
                  {formatYen(withdrawalResult.monthlyWithdrawal)}/月
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 2) {
    return (
      <div className="bg-light p-3 rounded mt-3">
        <h3 className="h6 mb-2">老後の月収</h3>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body py-2">
                <div className="text-muted small mb-1">月収合計</div>
                <div className="h5 text-primary fw-bold mb-0">
                  {formatYen(incomeResult.totalMonthlyIncome)}/月
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
