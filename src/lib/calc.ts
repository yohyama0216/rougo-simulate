import type {
  AccumulationParams,
  AccumulationResult,
  WithdrawalParams,
  WithdrawalResult,
  YearlyData,
  WithdrawalYearlyData,
} from '../types';

/**
 * Convert annual rate to monthly rate
 * Formula: (1 + annualRate)^(1/12) - 1
 */
export function annualToMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
}

/**
 * Simulate NISA accumulation
 */
export function simulateAccumulation(
  params: AccumulationParams
): AccumulationResult {
  const {
    initialAsset,
    monthlyContribution,
    years,
    annualReturn,
    annualCost,
  } = params;

  // Calculate net annual return
  const netAnnualReturn = annualReturn - annualCost;
  const monthlyRate = annualToMonthlyRate(netAnnualReturn);
  const totalMonths = years * 12;

  let balance = initialAsset;
  let totalContribution = initialAsset;
  const yearlyData: YearlyData[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    // Apply interest and add contribution
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    totalContribution += monthlyContribution;

    // Record yearly data
    if (month % 12 === 0) {
      const year = month / 12;
      const gain = balance - totalContribution;
      yearlyData.push({
        year,
        asset: balance,
        contribution: totalContribution,
        gain,
      });
    }
  }

  const finalAsset = balance;
  const totalGain = finalAsset - totalContribution;

  return {
    finalAsset,
    totalContribution,
    totalGain,
    yearlyData,
  };
}

/**
 * Calculate safe monthly withdrawal amount that won't deplete assets
 * Uses present value of annuity formula
 */
export function calcSafeWithdrawalMonthly(
  params: WithdrawalParams
): number {
  const { retirementAsset, startAge, endAge, annualReturn } = params;

  const years = endAge - startAge;
  const totalMonths = years * 12;
  const monthlyRate = annualToMonthlyRate(annualReturn);

  if (totalMonths <= 0) return 0;
  if (monthlyRate === 0) {
    // No interest case: simple division
    return retirementAsset / totalMonths;
  }

  // Present Value of Annuity formula: PV = PMT * [(1 - (1 + r)^-n) / r]
  // Solving for PMT: PMT = PV / [(1 - (1 + r)^-n) / r]
  const pvFactor = (1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate;
  const monthlyWithdrawal = retirementAsset / pvFactor;

  return monthlyWithdrawal;
}

/**
 * Simulate withdrawal with yearly breakdown
 */
export function simulateWithdrawal(
  params: WithdrawalParams
): WithdrawalResult {
  const { retirementAsset, startAge, endAge, annualReturn } = params;

  const monthlyWithdrawal = calcSafeWithdrawalMonthly(params);
  const monthlyRate = annualToMonthlyRate(annualReturn);
  const years = endAge - startAge;

  let balance = retirementAsset;
  const yearlyData: WithdrawalYearlyData[] = [];

  for (let year = 0; year < years; year++) {
    const startBalance = balance;
    const age = startAge + year;
    let yearlyWithdrawal = 0;

    // Process 12 months
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
      yearlyWithdrawal += monthlyWithdrawal;
    }

    yearlyData.push({
      year: year + 1,
      age,
      startBalance,
      withdrawal: yearlyWithdrawal,
      endBalance: balance,
    });
  }

  return {
    monthlyWithdrawal,
    yearlyData,
  };
}
