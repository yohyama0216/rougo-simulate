export interface AccumulationParams {
  initialAsset: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number; // %
  annualCost: number; // %
  // Year settings
  currentYear: number; // Current year (西暦)
  withdrawalStartYear: number; // Year when withdrawal starts (西暦)
  // Inflation
  considerInflation: boolean;
  inflationRate: number; // %
  // Housing loan
  hasHousingLoan: boolean;
  housingLoanAmount: number;
  housingLoanInterestRate: number; // %
  housingLoanYears: number;
  housingLoanStartYear: number; // Year when loan starts (1-based)
  // NISA withdrawal during accumulation
  hasNisaWithdrawal: boolean;
  nisaWithdrawalMonthly: number; // Monthly withdrawal amount
  nisaWithdrawalStartYear: number; // Year when withdrawal starts (1-based)
}

export interface AccumulationResult {
  finalAsset: number;
  totalContribution: number;
  totalGain: number;
  yearlyData: YearlyData[];
}

export interface YearlyData {
  year: number;
  asset: number;
  contribution: number;
  gain: number;
}

export interface WithdrawalParams {
  retirementAsset: number;
  startAge: number;
  endAge: number;
  annualReturn: number; // %
  // Inflation
  considerInflation: boolean;
  inflationRate: number; // %
  // Elder care expenses
  hasElderCare: boolean;
  elderCareMonthly: number; // Monthly elder care cost
  elderCareStartAge: number; // Age when care starts
  elderCareRecipient: 'husband' | 'wife' | 'none'; // Who needs care
}

export interface WithdrawalResult {
  monthlyWithdrawal: number;
  yearlyData: WithdrawalYearlyData[];
}

export interface WithdrawalYearlyData {
  year: number;
  age: number;
  startBalance: number;
  withdrawal: number;
  endBalance: number;
}

export type HouseholdType = 'single' | 'dualIncome' | 'partTime' | 'selfEmployed';

// Income period for detailed pension calculation
export interface IncomePeriod {
  id: string;
  annualSalary: number; // 年収（税込）
  years: number; // 加入年数
}

export interface IncomeParams {
  householdType: HouseholdType;
  // Pension start age
  pensionStartAge: number; // Age when pension starts (年金開始年齢)
  // Calculate from income periods
  husbandIncomePeriods: IncomePeriod[]; // 夫の収入期間
  wifeIncomePeriods: IncomePeriod[]; // 妻の収入期間
}

export interface IncomeResult {
  totalMonthlyIncome: number;
  husbandPension: number;
  wifePension: number;
  totalPension: number;
  withdrawal: number;
}
