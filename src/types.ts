export interface AccumulationParams {
  initialAsset: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number; // %
  annualCost: number; // %
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

export interface IncomeParams {
  pension: number; // monthly
}

export interface IncomeResult {
  totalMonthlyIncome: number;
}
