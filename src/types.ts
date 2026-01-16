export interface AccumulationParams {
  initialAsset: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number; // %
  annualCost: number; // %
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

export type PensionInputMode = 'manual' | 'calculate';

export interface IncomeParams {
  householdType: HouseholdType;
  pensionInputMode: PensionInputMode; // manual input or calculate from income
  // Manual pension input
  husbandPension: number; // monthly - 夫の年金
  wifePension: number; // monthly - 妻の年金
  // Calculate from current income
  husbandAnnualSalary: number; // 夫の年収（税込）
  husbandWorkingYears: number; // 夫の勤務年数
  wifeAnnualSalary: number; // 妻の年収（税込）
  wifeWorkingYears: number; // 妻の勤務年数
}

export interface IncomeResult {
  totalMonthlyIncome: number;
  husbandPension: number;
  wifePension: number;
  totalPension: number;
  withdrawal: number;
}
