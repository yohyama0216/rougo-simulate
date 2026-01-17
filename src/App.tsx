import { useState, useMemo } from 'react';
import FormAccumulation from './components/FormAccumulation';
import FormIncome from './components/FormIncome';
import PresetSelector from './components/PresetSelector';
import StepWizard, { type WizardStep } from './components/StepWizard';
import EnhancedResultSummary from './components/EnhancedResultSummary';
import { applyPreset, type PresetConfig } from './presets';
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
  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('preset');
  const [hasUsedPreset, setHasUsedPreset] = useState(false);
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

  // Handle preset selection
  const handlePresetSelect = (preset: PresetConfig) => {
    const applied = applyPreset(accumulationParams, incomeParams, preset);
    setAccumulationParams(applied.accumulation);
    setIncomeParams(applied.income);
    setHasUsedPreset(true);
    setCurrentStep('accumulation');
  };

  // Handle skip preset
  const handleSkipPreset = () => {
    setCurrentStep('accumulation');
  };

  // Navigation helpers
  const goToNextStep = () => {
    const steps: WizardStep[] = ['preset', 'accumulation', 'income', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPrevStep = () => {
    const steps: WizardStep[] = ['preset', 'accumulation', 'income', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Check if we should show wizard
  const showWizard = currentStep !== 'result' || hasUsedPreset;

  return (
    <div className="min-vh-100 bg-light">
      <header className="text-white text-center py-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <h1 className="h3 fw-bold mb-1">老後資金シミュレーター</h1>
        <p className="mb-0 small">
          NISA積立 + 年金計算
        </p>
      </header>

      <main className="container-fluid py-3" style={{maxWidth: '1200px'}}>
        {/* Step Wizard */}
        {showWizard && (
          <StepWizard currentStep={currentStep} onStepChange={setCurrentStep} />
        )}

        {/* Preset Selection Step */}
        {currentStep === 'preset' && (
          <PresetSelector
            onSelectPreset={handlePresetSelect}
            onSkip={handleSkipPreset}
          />
        )}

        {/* Accumulation Step */}
        {currentStep === 'accumulation' && (
          <div className="card shadow-sm">
            <div className="card-body p-3">
              <FormAccumulation
                params={accumulationParams}
                onChange={setAccumulationParams}
              />
              <div className="mt-3">
                <div className="bg-light p-3 rounded shadow-sm" style={{ border: '1px solid #e0e7ff' }}>
                  <h3 className="h6 mb-2 fw-bold" style={{ color: '#667eea' }}>
                    <i className="bi bi-graph-up me-1"></i>積立結果プレビュー
                  </h3>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <div className="small text-muted">最終資産</div>
                      <div className="h5 fw-bold text-primary mb-0">
                        ¥{(accumulationResult.finalAsset / 10000).toFixed(0)}万円
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="small text-muted">元本合計</div>
                      <div className="h6 text-muted mb-0">
                        ¥{(accumulationResult.totalContribution / 10000).toFixed(0)}万円
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="small text-muted">運用益</div>
                      <div className="h6 text-success mb-0">
                        ¥{(accumulationResult.totalGain / 10000).toFixed(0)}万円
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-between mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={goToPrevStep}
                >
                  <i className="bi bi-arrow-left me-2"></i>戻る
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={goToNextStep}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                >
                  次へ：年金設定<i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Income Step */}
        {currentStep === 'income' && (
          <div className="card shadow-sm">
            <div className="card-body p-3">
              <FormIncome params={incomeParams} onChange={setIncomeParams} />
              <div className="mt-3">
                <div className="bg-light p-3 rounded shadow-sm" style={{ border: '1px solid #e0e7ff' }}>
                  <h3 className="h6 mb-2 fw-bold" style={{ color: '#667eea' }}>
                    <i className="bi bi-clipboard-data me-1"></i>年金結果プレビュー
                  </h3>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <div className="small text-muted">年金合計（月額）</div>
                      <div className="h5 fw-bold text-primary mb-0">
                        ¥{incomeResult.totalPension.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted">年金開始年齢</div>
                      <div className="h6 text-muted mb-0">
                        {incomeParams.pensionStartAge}歳
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-between mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={goToPrevStep}
                >
                  <i className="bi bi-arrow-left me-2"></i>戻る
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentStep('result')}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                >
                  結果を見る<i className="bi bi-bar-chart-fill ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Step */}
        {currentStep === 'result' && (
          <EnhancedResultSummary
            accumulationResult={accumulationResult}
            withdrawalResult={withdrawalResult}
            incomeResult={incomeResult}
            withdrawalParams={withdrawalParams}
            onEdit={() => setCurrentStep('accumulation')}
          />
        )}
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
