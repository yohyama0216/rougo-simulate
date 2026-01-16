import { useState, useMemo } from 'react';
import Tabs from './components/Tabs';
import FormAccumulation from './components/FormAccumulation';
import FormWithdrawal from './components/FormWithdrawal';
import FormIncome from './components/FormIncome';
import ResultSummary from './components/ResultSummary';
import TableYearly from './components/TableYearly';
import { 
  simulateAccumulation, 
  simulateWithdrawal,
  calcEmployeesPension,
  calcNationalPension
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
  const [activeTab, setActiveTab] = useState(0);

  // Accumulation state
  const [accumulationParams, setAccumulationParams] =
    useState<AccumulationParams>({
      initialAsset: 0,
      monthlyContribution: 100000,
      years: 20,
      annualReturn: 5.0,
      annualCost: 0.2,
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

  // Withdrawal state
  const [withdrawalParams, setWithdrawalParams] = useState<WithdrawalParams>({
    retirementAsset: 0,
    startAge: 65,
    endAge: 95,
    annualReturn: 3.0,
    considerInflation: false,
    inflationRate: 2.0,
    hasElderCare: false,
    elderCareMonthly: 100000,
    elderCareStartAge: 75,
    elderCareRecipient: 'none',
  });

  // Income state
  const [incomeParams, setIncomeParams] = useState<IncomeParams>({
    householdType: 'single',
    pensionInputMode: 'manual',
    husbandPension: 150000,
    wifePension: 0,
    husbandAnnualSalary: 5000000, // Default: 5 million yen
    husbandWorkingYears: 40,
    wifeAnnualSalary: 3000000, // Default: 3 million yen
    wifeWorkingYears: 40,
  });

  // Calculate accumulation result using useMemo
  const accumulationResult: AccumulationResult = useMemo(() => {
    return simulateAccumulation(accumulationParams);
  }, [accumulationParams]);

  // Update withdrawal params when accumulation result changes (only if retirement asset is 0)
  const effectiveWithdrawalParams = useMemo(() => {
    if (withdrawalParams.retirementAsset === 0) {
      return {
        ...withdrawalParams,
        retirementAsset: accumulationResult.finalAsset,
      };
    }
    return withdrawalParams;
  }, [withdrawalParams, accumulationResult.finalAsset]);

  // Calculate withdrawal result using useMemo
  const withdrawalResult: WithdrawalResult = useMemo(() => {
    return simulateWithdrawal(effectiveWithdrawalParams);
  }, [effectiveWithdrawalParams]);

  // Calculate income result using useMemo
  const incomeResult: IncomeResult = useMemo(() => {
    let husbandPension = incomeParams.husbandPension;
    let wifePension = incomeParams.wifePension;

    // If calculate mode, compute pension from income
    if (incomeParams.pensionInputMode === 'calculate') {
      // Calculate husband's pension (厚生年金 for all household types)
      husbandPension = calcEmployeesPension(
        incomeParams.husbandAnnualSalary,
        incomeParams.husbandWorkingYears
      );

      // Calculate wife's pension based on household type
      if (incomeParams.householdType === 'dualIncome') {
        // Wife also has employees' pension (共働き)
        wifePension = calcEmployeesPension(
          incomeParams.wifeAnnualSalary,
          incomeParams.wifeWorkingYears
        );
      } else if (incomeParams.householdType === 'partTime' || 
                 incomeParams.householdType === 'selfEmployed') {
        // Wife has national pension only
        wifePension = calcNationalPension(incomeParams.wifeWorkingYears);
      } else {
        // Single household - no wife's pension
        wifePension = 0;
      }
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
      <header className="text-white text-center py-5" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <h1 className="display-4 fw-bold mb-2">老後資金シミュレーター</h1>
        <p className="lead mb-0">
          NISA積立 + 老後取り崩し + 月収計算
        </p>
      </header>

      <main className="container py-4" style={{maxWidth: '1200px'}}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 0 && (
          <>
            <FormAccumulation
              params={accumulationParams}
              onChange={setAccumulationParams}
            />
            <ResultSummary
              activeTab={activeTab}
              accumulationResult={accumulationResult}
              withdrawalResult={withdrawalResult}
              incomeResult={incomeResult}
            />
            <TableYearly
              activeTab={activeTab}
              accumulationData={accumulationResult.yearlyData}
              withdrawalData={[]}
            />
          </>
        )}

        {activeTab === 1 && (
          <>
            <FormWithdrawal
              params={withdrawalParams}
              onChange={setWithdrawalParams}
              suggestedRetirementAsset={accumulationResult.finalAsset}
            />
            <ResultSummary
              activeTab={activeTab}
              accumulationResult={accumulationResult}
              withdrawalResult={withdrawalResult}
              incomeResult={incomeResult}
            />
            <TableYearly
              activeTab={activeTab}
              accumulationData={[]}
              withdrawalData={withdrawalResult.yearlyData}
            />
          </>
        )}

        {activeTab === 2 && (
          <>
            <FormIncome params={incomeParams} onChange={setIncomeParams} />
            <ResultSummary
              activeTab={activeTab}
              accumulationResult={accumulationResult}
              withdrawalResult={withdrawalResult}
              incomeResult={incomeResult}
            />
            <div className="card mt-4">
              <div className="card-body">
                <h3 className="card-title h5 mb-3">内訳</h3>
                {incomeParams.householdType === 'single' ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center py-2">
                      <span>夫の年金（月額）:</span>
                      <span className="fw-bold text-primary">
                        ¥{incomeResult.husbandPension.toLocaleString('ja-JP', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-center py-2">
                      <span>夫の年金（月額）:</span>
                      <span className="fw-bold text-primary">
                        ¥{incomeResult.husbandPension.toLocaleString('ja-JP', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2">
                      <span>妻の年金（月額）:</span>
                      <span className="fw-bold text-primary">
                        ¥{incomeResult.wifePension.toLocaleString('ja-JP', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2 border-top pt-2">
                      <span>年金合計（月額）:</span>
                      <span className="fw-bold text-success">
                        ¥{incomeResult.totalPension.toLocaleString('ja-JP', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-between align-items-center py-2">
                  <span>取り崩し（月額）:</span>
                  <span className="fw-bold text-primary">
                    ¥
                    {withdrawalResult.monthlyWithdrawal.toLocaleString('ja-JP', {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0 small opacity-75">
          ※このシミュレーターは参考値です。実際の運用成果を保証するものではありません。
        </p>
      </footer>
    </div>
  );
}

export default App;
