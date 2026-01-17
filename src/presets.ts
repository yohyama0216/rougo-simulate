// Preset configurations for quick start
import type { AccumulationParams, IncomeParams } from './types';

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  category: 'lifestyle' | 'risk';
  accumulation: Partial<AccumulationParams>;
  income: Partial<IncomeParams>;
}

// Lifestyle-based presets
export const lifestylePresets: PresetConfig[] = [
  {
    id: 'single-renter',
    name: '独身・賃貸',
    description: '独身で賃貸住宅にお住まいの方向け',
    category: 'lifestyle',
    accumulation: {
      initialAsset: 1000000,
      monthlyContribution: 50000,
      annualReturn: 4.0,
      annualCost: 0.2,
      hasHousingLoan: false,
      considerInflation: false,
    },
    income: {
      householdType: 'single',
      pensionStartAge: 65,
      husbandIncomePeriods: [
        { id: '1', annualSalary: 4500000, years: 40 }
      ],
    },
  },
  {
    id: 'single-homeowner',
    name: '独身・持ち家',
    description: '独身で住宅ローンありの方向け',
    category: 'lifestyle',
    accumulation: {
      initialAsset: 500000,
      monthlyContribution: 80000,
      annualReturn: 4.0,
      annualCost: 0.2,
      hasHousingLoan: true,
      housingLoanAmount: 25000000,
      housingLoanInterestRate: 1.2,
      housingLoanYears: 35,
      housingLoanStartYear: 1,
      considerInflation: false,
    },
    income: {
      householdType: 'single',
      pensionStartAge: 65,
      husbandIncomePeriods: [
        { id: '1', annualSalary: 5500000, years: 40 }
      ],
    },
  },
  {
    id: 'couple-dualincome',
    name: '夫婦共働き',
    description: '夫婦共働きで賃貸の方向け',
    category: 'lifestyle',
    accumulation: {
      initialAsset: 2000000,
      monthlyContribution: 100000,
      annualReturn: 4.5,
      annualCost: 0.2,
      hasHousingLoan: false,
      considerInflation: false,
    },
    income: {
      householdType: 'dualIncome',
      pensionStartAge: 65,
      husbandIncomePeriods: [
        { id: '1', annualSalary: 5500000, years: 40 }
      ],
      wifeIncomePeriods: [
        { id: '1', annualSalary: 4000000, years: 35 }
      ],
    },
  },
  {
    id: 'couple-homeowner',
    name: '夫婦・持ち家',
    description: '夫婦で住宅ローンありの方向け',
    category: 'lifestyle',
    accumulation: {
      initialAsset: 1500000,
      monthlyContribution: 120000,
      annualReturn: 4.0,
      annualCost: 0.2,
      hasHousingLoan: true,
      housingLoanAmount: 35000000,
      housingLoanInterestRate: 1.5,
      housingLoanYears: 35,
      housingLoanStartYear: 1,
      considerInflation: false,
    },
    income: {
      householdType: 'dualIncome',
      pensionStartAge: 65,
      husbandIncomePeriods: [
        { id: '1', annualSalary: 6000000, years: 40 }
      ],
      wifeIncomePeriods: [
        { id: '1', annualSalary: 3500000, years: 35 }
      ],
    },
  },
];

// Risk-based presets (investment style)
export const riskPresets: PresetConfig[] = [
  {
    id: 'conservative',
    name: '保守的',
    description: '安全性重視、低リスク運用',
    category: 'risk',
    accumulation: {
      annualReturn: 2.0,
      annualCost: 0.1,
      considerInflation: true,
      inflationRate: 1.5,
    },
    income: {},
  },
  {
    id: 'moderate',
    name: '標準',
    description: 'バランス重視、中リスク運用',
    category: 'risk',
    accumulation: {
      annualReturn: 4.0,
      annualCost: 0.2,
      considerInflation: true,
      inflationRate: 2.0,
    },
    income: {},
  },
  {
    id: 'aggressive',
    name: '積極的',
    description: '成長重視、高リスク運用',
    category: 'risk',
    accumulation: {
      annualReturn: 6.0,
      annualCost: 0.3,
      considerInflation: true,
      inflationRate: 2.5,
    },
    income: {},
  },
];

export function applyPreset(
  currentAccumulation: AccumulationParams,
  currentIncome: IncomeParams,
  preset: PresetConfig
): { accumulation: AccumulationParams; income: IncomeParams } {
  const currentYear = new Date().getFullYear();
  
  return {
    accumulation: {
      ...currentAccumulation,
      ...preset.accumulation,
      currentYear,
      withdrawalStartYear: currentYear + 20, // Default 20 years
    },
    income: {
      ...currentIncome,
      ...preset.income,
    },
  };
}

export function getPresetById(id: string): PresetConfig | undefined {
  return [...lifestylePresets, ...riskPresets].find(p => p.id === id);
}
