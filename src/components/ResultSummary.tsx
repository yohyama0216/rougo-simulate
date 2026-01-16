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
      <div className="bg-light p-4 rounded mt-4">
        <h3 className="h5 mb-3">積立結果</h3>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-muted small mb-1">最終資産</div>
                <div className="h4 text-primary fw-bold mb-0">
                  {formatYen(accumulationResult.finalAsset)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-muted small mb-1">元本合計</div>
                <div className="h4 text-primary fw-bold mb-0">
                  {formatYen(accumulationResult.totalContribution)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-muted small mb-1">運用益</div>
                <div className="h4 text-primary fw-bold mb-0">
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
      <div className="bg-light p-4 rounded mt-4">
        <h3 className="h5 mb-3">取り崩し結果</h3>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="text-muted small mb-1">枯渇しない月額取り崩し</div>
                <div className="h3 text-primary fw-bold mb-0">
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
      <div className="bg-light p-4 rounded mt-4">
        <h3 className="h5 mb-3">老後の月収</h3>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="text-muted small mb-1">月収合計</div>
                <div className="h3 text-primary fw-bold mb-0">
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
