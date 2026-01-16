import { useState, useMemo } from 'react';
import FormAccumulation from './components/FormAccumulation';
import FormIncome from './components/FormIncome';
import { 
  simulateAccumulation, 
  simulateWithdrawal,
  calcEmployeesPensionFromPeriods,
  calcNationalPensionFromPeriods
} from './lib/calc';
import type {
  AccumulationParams,
  WithdrawalParams,
  IncomeParams,
  AccumulationResult,
  WithdrawalResult,
  IncomeResult,
} from './types';

function App() {
  // Accumulation state
  const [accumulationParams, setAccumulationParams] =
    useState<AccumulationParams>({
      initialAsset: 0,
      monthlyContribution: 100000,
      years: 20,
      annualReturn: 5.0,
      annualCost: 0.2,
      currentYear: new Date().getFullYear(), // Current year
      withdrawalStartYear: new Date().getFullYear() + 20, // Default to 20 years from now
      considerInflation: false,
      inflationRate: 2.0,
      hasHousingLoan: false,
      housingLoanAmount: 30000000,
      housingLoanInterestRate: 1.5,
      housingLoanYears: 35,
      housingLoanStartYear: 1,
      hasNisaWithdrawal: false,
      nisaWithdrawalMonthly: 50000,
      nisaWithdrawalStartYear: 10,
    });

  // Calculate accumulation result using useMemo
  const accumulationResult: AccumulationResult = useMemo(() => {
    // Calculate years from the year difference
    const calculatedYears = Math.max(1, accumulationParams.withdrawalStartYear - accumulationParams.currentYear);
    return simulateAccumulation({
      ...accumulationParams,
      years: calculatedYears,
    });
  }, [accumulationParams]);

  // Withdrawal params (uses accumulation result)
  const withdrawalParams: WithdrawalParams = useMemo(() => ({
    retirementAsset: accumulationResult.finalAsset,
    startAge: 65,
    endAge: 95,
    annualReturn: 3.0,
    considerInflation: false,
    inflationRate: 2.0,
    hasElderCare: false,
    elderCareMonthly: 100000,
    elderCareStartAge: 75,
    elderCareRecipient: 'none',
  }), [accumulationResult.finalAsset]);

  // Calculate withdrawal result using useMemo
  const withdrawalResult: WithdrawalResult = useMemo(() => {
    return simulateWithdrawal(withdrawalParams);
  }, [withdrawalParams]);

  // Income state
  const [incomeParams, setIncomeParams] = useState<IncomeParams>({
    householdType: 'single',
    pensionStartAge: 65, // Default pension start age
    husbandIncomePeriods: [
      { id: '1', annualSalary: 5000000, years: 40 } // Default: 5 million yen for 40 years
    ],
    wifeIncomePeriods: [
      { id: '1', annualSalary: 3000000, years: 40 } // Default: 3 million yen for 40 years
    ],
  });

  // Calculate income result using useMemo
  const incomeResult: IncomeResult = useMemo(() => {
    let husbandPension = 0;
    let wifePension = 0;

    // Calculate husband's pension from income periods (厚生年金 for all household types)
    if (incomeParams.husbandIncomePeriods.length > 0) {
      husbandPension = calcEmployeesPensionFromPeriods(
        incomeParams.husbandIncomePeriods
      );
    }

    // Calculate wife's pension based on household type
    if (incomeParams.householdType === 'dualIncome') {
      // Wife also has employees' pension (共働き)
      if (incomeParams.wifeIncomePeriods.length > 0) {
        wifePension = calcEmployeesPensionFromPeriods(
          incomeParams.wifeIncomePeriods
        );
      }
    } else if (incomeParams.householdType === 'partTime' || 
               incomeParams.householdType === 'selfEmployed') {
      // Wife has national pension only
      if (incomeParams.wifeIncomePeriods.length > 0) {
        wifePension = calcNationalPensionFromPeriods(incomeParams.wifeIncomePeriods);
      }
    } else {
      // Single household - no wife's pension
      wifePension = 0;
    }

    const totalPension = husbandPension + wifePension;
    return {
      totalMonthlyIncome: totalPension + withdrawalResult.monthlyWithdrawal,
      husbandPension,
      wifePension,
      totalPension,
      withdrawal: withdrawalResult.monthlyWithdrawal,
    };
  }, [incomeParams, withdrawalResult.monthlyWithdrawal]);

  return (
    <div className="min-vh-100 bg-light">
      <header className="text-white text-center py-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <h1 className="h3 fw-bold mb-1">老後資金シミュレーター</h1>
        <p className="mb-0 small">
          NISA積立 + 年金計算
        </p>
      </header>

      <main className="container-fluid py-3" style={{maxWidth: '1000px'}}>
        <div className="row g-2">
          {/* Left Column: NISA Accumulation */}
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-body p-2">
                <FormAccumulation
                  params={accumulationParams}
                  onChange={setAccumulationParams}
                />
                <div className="mt-2">
                  <div className="bg-light p-2 rounded shadow-sm" style={{ border: '1px solid #e0e7ff' }}>
                    <h3 className="h6 mb-2 fw-bold" style={{ color: '#667eea' }}>
                      <i className="bi bi-graph-up me-1"></i>積立結果
                    </h3>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small">最終資産:</span>
                      <span className="fw-bold text-primary">
                        ¥{accumulationResult.finalAsset.toLocaleString('ja-JP', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small">元本合計:</span>
                      <span className="text-muted">
                        ¥{accumulationResult.totalContribution.toLocaleString('ja-JP', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small">運用益:</span>
                      <span className="text-success">
                        ¥{accumulationResult.totalGain.toLocaleString('ja-JP', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pension Calculation */}
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-body p-2">
                <FormIncome params={incomeParams} onChange={setIncomeParams} />
                <div className="mt-2">
                  <div className="bg-light p-2 rounded shadow-sm" style={{ border: '1px solid #e0e7ff' }}>
                    <h3 className="h6 mb-2 fw-bold" style={{ color: '#667eea' }}>
                      <i className="bi bi-clipboard-data me-1"></i>年金結果
                    </h3>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small">年金開始年齢:</span>
                      <span className="text-muted">{incomeParams.pensionStartAge}歳</span>
                    </div>
                    {incomeParams.householdType === 'single' ? (
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small">夫の年金（月額）:</span>
                        <span className="fw-bold text-primary">
                          ¥{incomeResult.husbandPension.toLocaleString('ja-JP', {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small">夫の年金（月額）:</span>
                          <span className="text-muted">
                            ¥{incomeResult.husbandPension.toLocaleString('ja-JP', {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small">妻の年金（月額）:</span>
                          <span className="text-muted">
                            ¥{incomeResult.wifePension.toLocaleString('ja-JP', {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-top pt-1">
                          <span className="small">年金合計（月額）:</span>
                          <span className="fw-bold text-primary">
                            ¥{incomeResult.totalPension.toLocaleString('ja-JP', {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Amount at Bottom Center */}
        <div className="row mt-2">
          <div className="col-12">
            <div className="card text-white text-center shadow-lg" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}>
              <div className="card-body py-3">
                <h2 className="h5 mb-2 fw-bold">
                  <i className="bi bi-piggy-bank me-2"></i>年金目安額（月額）
                </h2>
                <div className="display-5 fw-bold mb-2">
                  ¥{incomeResult.totalMonthlyIncome.toLocaleString('ja-JP', {
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="mt-2 small opacity-90" style={{ fontSize: '0.9em' }}>
                  <span className="badge bg-white text-primary me-2 px-3 py-2" style={{ fontSize: '0.85em' }}>
                    <i className="bi bi-wallet2 me-1"></i>
                    年金 ¥{incomeResult.totalPension.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="mx-1">+</span>
                  <span className="badge bg-white text-success px-3 py-2" style={{ fontSize: '0.85em' }}>
                    <i className="bi bi-graph-up me-1"></i>
                    取り崩し ¥{withdrawalResult.monthlyWithdrawal.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="mt-2 small opacity-90">
                  <div className="badge bg-white bg-opacity-75 text-dark px-3 py-2" style={{ fontSize: '0.85em' }}>
                    <i className="bi bi-clock-history me-1"></i>
                    資産は約{withdrawalResult.yearsUntilDepletion.toFixed(1)}年持続
                    {withdrawalResult.depletionAge < withdrawalParams.endAge ? (
                      <span className="ms-1">({Math.floor(withdrawalResult.depletionAge)}歳まで)</span>
                    ) : (
                      <span className="ms-1">({withdrawalParams.endAge}歳以降も継続)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-2 mt-auto">
        <p className="mb-0 small opacity-75">
          ※このシミュレーターは参考値です。実際の運用成果を保証するものではありません。
        </p>
      </footer>
    </div>
  );
}

export default App;
