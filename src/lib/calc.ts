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
 * Calculate monthly housing loan payment
 * Uses standard loan amortization formula
 */
export function calcHousingLoanPayment(
  loanAmount: number,
  annualInterestRate: number,
  years: number
): number {
  if (loanAmount <= 0 || years <= 0) return 0;
  
  const monthlyRate = annualToMonthlyRate(annualInterestRate);
  const totalMonths = years * 12;
  
  if (monthlyRate === 0) {
    // No interest case
    return loanAmount / totalMonths;
  }
  
  // Loan payment formula: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
  const payment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  return payment;
}

/**
 * Simulate NISA accumulation with housing loan
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
    hasHousingLoan,
    housingLoanAmount,
    housingLoanInterestRate,
    housingLoanYears,
    housingLoanStartYear,
  } = params;

  // Calculate net annual return
  const netAnnualReturn = annualReturn - annualCost;
  const monthlyRate = annualToMonthlyRate(netAnnualReturn);
  const totalMonths = years * 12;

  // Calculate housing loan payment if applicable
  const monthlyLoanPayment = hasHousingLoan
    ? calcHousingLoanPayment(
        housingLoanAmount,
        housingLoanInterestRate,
        housingLoanYears
      )
    : 0;

  const loanStartMonth = hasHousingLoan ? (housingLoanStartYear - 1) * 12 + 1 : 0;
  const loanEndMonth = hasHousingLoan
    ? loanStartMonth + housingLoanYears * 12
    : 0;

  let balance = initialAsset;
  let totalContribution = initialAsset;
  const yearlyData: YearlyData[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    // Apply interest and add contribution
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    totalContribution += monthlyContribution;

    // Deduct housing loan payment if in loan period
    if (hasHousingLoan && month >= loanStartMonth && month < loanEndMonth) {
      balance -= monthlyLoanPayment;
    }

    // Record yearly data
    if (month % 12 === 0) {
      const year = month / 12;
      const gain = balance - totalContribution;
      yearlyData.push({
        year,
        asset: Math.max(0, balance), // Ensure non-negative
        contribution: totalContribution,
        gain,
      });
    }
  }

  const finalAsset = Math.max(0, balance);
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
 * Uses present value of annuity formula, accounting for elder care expenses
 */
export function calcSafeWithdrawalMonthly(
  params: WithdrawalParams
): number {
  const {
    retirementAsset,
    startAge,
    endAge,
    annualReturn,
    hasElderCare,
    elderCareMonthly,
    elderCareStartAge,
  } = params;

  const years = endAge - startAge;
  const totalMonths = years * 12;
  const monthlyRate = annualToMonthlyRate(annualReturn);

  if (totalMonths <= 0) return 0;

  // If no elder care, use simple calculation
  if (!hasElderCare) {
    if (monthlyRate === 0) {
      return retirementAsset / totalMonths;
    }
    const pvFactor =
      (1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate;
    return retirementAsset / pvFactor;
  }

  // With elder care, we need to account for the additional expense
  // Calculate available amount after reserving for elder care expenses
  const careStartMonth = Math.max(0, (elderCareStartAge - startAge) * 12);
  const careMonths = Math.max(0, totalMonths - careStartMonth);

  if (monthlyRate === 0) {
    // No interest case: simple calculation
    const totalCareExpenses = elderCareMonthly * careMonths;
    const availableForWithdrawal = retirementAsset - totalCareExpenses;
    return Math.max(0, availableForWithdrawal / totalMonths);
  }

  // Calculate PV of elder care expenses
  let pvElderCare = 0;
  if (careMonths > 0) {
    const discountFactor = Math.pow(1 + monthlyRate, careStartMonth);
    const carePvFactor =
      (1 - Math.pow(1 + monthlyRate, -careMonths)) / monthlyRate;
    pvElderCare = (elderCareMonthly * carePvFactor) / discountFactor;
  }

  // Available asset for regular withdrawal
  const availableAsset = retirementAsset - pvElderCare;

  if (availableAsset <= 0) return 0;

  const pvFactor = (1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate;
  return availableAsset / pvFactor;
}

/**
 * Simulate withdrawal with yearly breakdown and elder care
 */
export function simulateWithdrawal(
  params: WithdrawalParams
): WithdrawalResult {
  const {
    retirementAsset,
    startAge,
    endAge,
    annualReturn,
    hasElderCare,
    elderCareMonthly,
    elderCareStartAge,
  } = params;

  const monthlyWithdrawal = calcSafeWithdrawalMonthly(params);
  const monthlyRate = annualToMonthlyRate(annualReturn);
  const years = endAge - startAge;

  let balance = retirementAsset;
  const yearlyData: WithdrawalYearlyData[] = [];

  for (let year = 0; year < years; year++) {
    const startBalance = balance;
    const age = startAge + year;
    let yearlyWithdrawal = 0;

    // Check if elder care applies this year
    const isElderCareActive = hasElderCare && age >= elderCareStartAge;

    // Process 12 months
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
      yearlyWithdrawal += monthlyWithdrawal;

      // Deduct elder care expenses if applicable
      if (isElderCareActive) {
        balance -= elderCareMonthly;
        yearlyWithdrawal += elderCareMonthly;
      }
    }

    yearlyData.push({
      year: year + 1,
      age,
      startBalance,
      withdrawal: yearlyWithdrawal,
      endBalance: Math.max(0, balance),
    });
  }

  return {
    monthlyWithdrawal,
    yearlyData,
  };
}
