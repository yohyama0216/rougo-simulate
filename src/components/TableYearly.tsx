import type { YearlyData, WithdrawalYearlyData } from '../types';
import { formatYen } from '../lib/format';

interface TableYearlyProps {
  activeTab: number;
  accumulationData: YearlyData[];
  withdrawalData: WithdrawalYearlyData[];
}

export default function TableYearly({
  activeTab,
  accumulationData,
  withdrawalData,
}: TableYearlyProps) {
  if (activeTab === 0 && accumulationData.length > 0) {
    return (
      <div className="mt-4">
        <h3 className="h5 mb-3">年別推移</h3>
        <div className="table-responsive border rounded">
          <table className="table table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th>年</th>
                <th>資産残高</th>
                <th>元本累計</th>
                <th>運用益</th>
              </tr>
            </thead>
            <tbody>
              {accumulationData.map((row) => (
                <tr key={row.year}>
                  <td>{row.year}年</td>
                  <td>{formatYen(row.asset)}</td>
                  <td>{formatYen(row.contribution)}</td>
                  <td>{formatYen(row.gain)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 1 && withdrawalData.length > 0) {
    return (
      <div className="mt-4">
        <h3 className="h5 mb-3">年別残高推移</h3>
        <div className="table-responsive border rounded">
          <table className="table table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th>年</th>
                <th>年齢</th>
                <th>期首残高</th>
                <th>年間取り崩し</th>
                <th>期末残高</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalData.map((row) => (
                <tr key={row.year}>
                  <td>{row.year}年目</td>
                  <td>{row.age}歳</td>
                  <td>{formatYen(row.startBalance)}</td>
                  <td>{formatYen(row.withdrawal)}</td>
                  <td>{formatYen(row.endBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
