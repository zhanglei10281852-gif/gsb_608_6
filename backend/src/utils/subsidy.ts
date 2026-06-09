import { IElderly, SubsidyCategory } from "../models/Elderly";

export const MEAL_PRICES: Record<string, number> = {
  A: 12,
  B: 15,
  C: 18,
};

export const SUBSIDY_RATES: Record<SubsidyCategory, number> = {
  low_income_full: 15,
  low_income: 10,
  normal: 5,
  senior_extra: 5,
};

export const SENIOR_SUBSIDY = 3;
export const SENIOR_AGE_THRESHOLD = 80;

export interface SubsidyCalculation {
  baseSubsidy: number;
  seniorSubsidy: number;
  totalSubsidy: number;
  selfPayAmount: number;
}

export function calculateSubsidy(
  elderly: IElderly,
  mealPrice: number,
): SubsidyCalculation {
  let baseSubsidy = SUBSIDY_RATES[elderly.subsidyCategory];
  let seniorSubsidy = 0;

  if (elderly.hasSeniorSubsidy) {
    seniorSubsidy = SENIOR_SUBSIDY;
  }

  let totalSubsidy = baseSubsidy + seniorSubsidy;
  totalSubsidy = Math.min(totalSubsidy, mealPrice);
  let selfPayAmount = mealPrice - totalSubsidy;
  selfPayAmount = Math.max(selfPayAmount, 0);

  const actualSeniorSubsidy = Math.min(
    seniorSubsidy,
    totalSubsidy - baseSubsidy,
  );
  const actualBaseSubsidy = totalSubsidy - Math.max(0, actualSeniorSubsidy);

  return {
    baseSubsidy: Math.max(0, actualBaseSubsidy),
    seniorSubsidy: Math.max(0, actualSeniorSubsidy),
    totalSubsidy,
    selfPayAmount,
  };
}

let orderCounter = 0;

export function generateOrderNo(): string {
  orderCounter++;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timeStr = now.getTime().toString().slice(-6);
  const counterStr = orderCounter.toString().padStart(6, "0");
  return `ORD${dateStr}${timeStr}${counterStr}`;
}

export function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}
