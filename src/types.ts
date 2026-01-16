export interface AccumulationParams {
  initialAsset: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number; // %
  annualCost: number; // %
  // Housing loan
  hasHousingLoan: boolean;
  housingLoanAmount: number;
  housingLoanInterestRate: number; // %
  housingLoanYears: number;
  housingLoanStartYear: number; // Year when loan starts (1-based)
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

export interface IncomeParams {
  householdType: HouseholdType;
  husbandPension: number; // monthly - 夫の年金
  wifePension: number; // monthly - 妻の年金
}

export interface IncomeResult {
  totalMonthlyIncome: number;
  husbandPension: number;
  wifePension: number;
  totalPension: number;
  withdrawal: number;
}
