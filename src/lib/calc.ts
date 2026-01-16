import type {
  AccumulationParams,
  AccumulationResult,
  WithdrawalParams,
  WithdrawalResult,
  YearlyData,
  WithdrawalYearlyData,
} from '../types';

// Pension calculation constants (2024年度)
const NATIONAL_PENSION_FULL_ANNUAL_AMOUNT = 816000; // 国民年金満額（年額、40年加入）
const NATIONAL_PENSION_MAX_YEARS = 40; // 国民年金の最大加入年数
const EMPLOYEES_PENSION_ACCRUAL_RATE_POST_2003 = 0.005481; // 厚生年金給付乗率（2003年4月以降）

/**
 * Convert annual rate to monthly rate
 * Formula: (1 + annualRate)^(1/12) - 1
 */
export function annualToMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
}

/**
 * Calculate 国民年金 (National Pension) - Basic Pension
 * 
 * For 2024, the full amount is approximately ¥816,000 per year (¥68,000 per month)
 * This assumes 40 years of contributions (age 20-60)
 * 
 * Formula: Full amount if contributed for 40 years
 * If working years < 40, it's proportional: (years / 40) * full amount
 * 
 * @param workingYears - Number of years contributing to the pension (default: 40)
 * @returns Monthly pension amount in yen
 */
export function calcNationalPension(workingYears: number = 40): number {
  const years = Math.min(workingYears, NATIONAL_PENSION_MAX_YEARS);
  const annualPension = (years / NATIONAL_PENSION_MAX_YEARS) * NATIONAL_PENSION_FULL_ANNUAL_AMOUNT;
  
  return annualPension / 12; // Return monthly amount
}

/**
 * Calculate 厚生年金 (Employees' Pension Insurance)
 * 
 * Employees' Pension = National Pension (base) + Employees' portion
 * 
 * Simplified formula based on average annual income:
 * Annual pension = Average monthly salary × 0.005481 × months of enrollment
 * Monthly pension = Annual pension / 12 + National Pension
 * 
 * The 0.005481 is the accrual rate (給付乗率) for post-2003 earnings
 * 
 * This is a simplified calculation. Actual pension may vary based on:
 * - Exact salary history each year
 * - Revaluation rates applied to past earnings
 * - Changes in pension system rules
 * 
 * @param averageAnnualSalary - Average annual salary during working years (税込年収)
 * @param workingYears - Number of years contributing to employees' pension (default: 40)
 * @returns Monthly pension amount in yen
 */
export function calcEmployeesPension(
  averageAnnualSalary: number,
  workingYears: number = 40
): number {
  // Base: National Pension (基礎年金)
  const nationalPension = calcNationalPension(workingYears);
  
  // Employees' pension portion (報酬比例部分)
  const workingMonths = workingYears * 12;
  
  // Average monthly salary (standard monthly remuneration)
  const monthlyAverageSalary = averageAnnualSalary / 12;
  
  // Annual employees' pension portion = average monthly salary × accrual rate × months
  const annualEmployeesPortion = monthlyAverageSalary * EMPLOYEES_PENSION_ACCRUAL_RATE_POST_2003 * workingMonths;
  
  // Convert to monthly amount and add national pension
  const monthlyEmployeesPortion = annualEmployeesPortion / 12;
  
  return nationalPension + monthlyEmployeesPortion;
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
 * Simulate NISA accumulation with housing loan and NISA withdrawal
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
    considerInflation,
    inflationRate,
    hasHousingLoan,
    housingLoanAmount,
    housingLoanInterestRate,
    housingLoanYears,
    housingLoanStartYear,
    hasNisaWithdrawal,
    nisaWithdrawalMonthly,
    nisaWithdrawalStartYear,
  } = params;

  // Calculate net annual return
  let netAnnualReturn = annualReturn - annualCost;
  
  // If considering inflation, adjust for real return
  if (considerInflation) {
    // Real return = (1 + nominal) / (1 + inflation) - 1
    // Approximation: real ≈ nominal - inflation
    netAnnualReturn = netAnnualReturn - inflationRate;
  }
  
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

  // NISA withdrawal start month
  const nisaWithdrawalStartMonth = hasNisaWithdrawal
    ? (nisaWithdrawalStartYear - 1) * 12 + 1
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

    // Deduct NISA withdrawal if in withdrawal period
    if (hasNisaWithdrawal && month >= nisaWithdrawalStartMonth) {
      balance -= nisaWithdrawalMonthly;
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
 * Uses present value of annuity formula, accounting for elder care expenses and inflation
 */
export function calcSafeWithdrawalMonthly(
  params: WithdrawalParams
): number {
  const {
    retirementAsset,
    startAge,
    endAge,
    annualReturn,
    considerInflation,
    inflationRate,
    hasElderCare,
    elderCareMonthly,
    elderCareStartAge,
  } = params;

  const years = endAge - startAge;
  const totalMonths = years * 12;
  const monthlyRate = annualToMonthlyRate(annualReturn);
  const monthlyInflation = considerInflation ? annualToMonthlyRate(inflationRate) : 0;

  if (totalMonths <= 0) return 0;

  // If considering inflation, calculate real return rate
  // For inflation-adjusted withdrawal, we need to use real return
  const realMonthlyRate = considerInflation
    ? (1 + monthlyRate) / (1 + monthlyInflation) - 1
    : monthlyRate;

  // If no elder care, use simple calculation
  if (!hasElderCare) {
    if (realMonthlyRate === 0) {
      return retirementAsset / totalMonths;
    }
    const pvFactor =
      (1 - Math.pow(1 + realMonthlyRate, -totalMonths)) / realMonthlyRate;
    return retirementAsset / pvFactor;
  }

  // With elder care, we need to account for the additional expense
  // Calculate available amount after reserving for elder care expenses
  const careStartMonth = Math.max(0, (elderCareStartAge - startAge) * 12);
  const careMonths = Math.max(0, totalMonths - careStartMonth);

  if (realMonthlyRate === 0) {
    // No interest case: simple calculation
    const totalCareExpenses = elderCareMonthly * careMonths;
    const availableForWithdrawal = retirementAsset - totalCareExpenses;
    return Math.max(0, availableForWithdrawal / totalMonths);
  }

  // Calculate PV of elder care expenses
  let pvElderCare = 0;
  if (careMonths > 0) {
    const discountFactor = Math.pow(1 + realMonthlyRate, careStartMonth);
    const carePvFactor =
      (1 - Math.pow(1 + realMonthlyRate, -careMonths)) / realMonthlyRate;
    pvElderCare = (elderCareMonthly * carePvFactor) / discountFactor;
  }

  // Available asset for regular withdrawal
  const availableAsset = retirementAsset - pvElderCare;

  if (availableAsset <= 0) return 0;

  const pvFactor = (1 - Math.pow(1 + realMonthlyRate, -totalMonths)) / realMonthlyRate;
  return availableAsset / pvFactor;
}

/**
 * Simulate withdrawal with yearly breakdown, elder care, and inflation adjustment
 */
export function simulateWithdrawal(
  params: WithdrawalParams
): WithdrawalResult {
  const {
    retirementAsset,
    startAge,
    endAge,
    annualReturn,
    considerInflation,
    inflationRate,
    hasElderCare,
    elderCareMonthly,
    elderCareStartAge,
  } = params;

  const monthlyWithdrawal = calcSafeWithdrawalMonthly(params);
  const monthlyRate = annualToMonthlyRate(annualReturn);
  const monthlyInflation = considerInflation ? annualToMonthlyRate(inflationRate) : 0;
  const years = endAge - startAge;

  let balance = retirementAsset;
  let currentMonthlyWithdrawal = monthlyWithdrawal;
  const yearlyData: WithdrawalYearlyData[] = [];

  for (let year = 0; year < years; year++) {
    const startBalance = balance;
    const age = startAge + year;
    let yearlyWithdrawal = 0;

    // Check if elder care applies this year
    const isElderCareActive = hasElderCare && age >= elderCareStartAge;

    // Process 12 months
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) - currentMonthlyWithdrawal;
      yearlyWithdrawal += currentMonthlyWithdrawal;

      // Deduct elder care expenses if applicable
      if (isElderCareActive) {
        balance -= elderCareMonthly;
        yearlyWithdrawal += elderCareMonthly;
      }
      
      // Apply monthly inflation to withdrawal amount
      if (considerInflation && month < 11) {
        currentMonthlyWithdrawal *= (1 + monthlyInflation);
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
