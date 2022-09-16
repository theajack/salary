/*
 * @Author: tackchen
 * @Date: 2022-09-15 08:33:57
 * @Description: Coding something
 */

export interface IHousingFundRange {
    min: number;
    max: number;
}

export interface IInsuranceAndFund {
    pension: number;
    medicalInsurance: number;
    unemploymentInsurance: number;
    housingFund: number;
    supplementaryFund: number;
}

export type IInsuranceAndFundOptions = Partial<IInsuranceAndFund>;

export interface IInsuranceAndFundResult extends IInsuranceAndFund {
    totalFund: number; // 总五险一金
    totalHousingFund: number; // 总住房公积金
}

export interface ICalculateData<T = IInsuranceAndFund> {
    salary: number;
    specialAdditionalDeduction: number;
    yearEndAwardsNumber: number; // 年终奖月数
    yearEndAwards: number; // 年终奖总数 优先级高于yearEndAwardsNumber，当为0时则使用yearEndAwardsNumber计算
    insuranceAndFundBase: number;
    startingSalary: number;
    insuranceAndFundRate: T;
    insuranceAndFundRateOfCompany: T;
    extraBonus: number[];
    housingFundRange: IHousingFundRange;
}

export type ICalculateOptions = Partial<ICalculateData<IInsuranceAndFundOptions>>;

export type ILevels = {
    value: number;
    rate: number;
    deduction: number;
}[]

export interface ICalculateResult {
    salaryPreTax: number;
    salaryAfterTax: number[];
    salaryTax: number[];
    salaryTotalTax: number;
    totalSalaryAfterTaxExcludeAwards: number;
    totalSalaryPreTax: number;
    totalSalaryAfterTax: number;
    insuranceAndFund: IInsuranceAndFundResult;
    insuranceAndFundOfCompany: IInsuranceAndFundResult;
    awardsPreTax: number;
    awardsTax: number;
    awardsAfterTax: number;
}