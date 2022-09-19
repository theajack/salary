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
    injuryInsurance: number;
    maternityInsurance: number;
    housingFund: number;
    supplementaryFund: number;
}

export type IInsuranceAndFundOptions = Partial<IInsuranceAndFund>;

export interface IInsuranceAndFundResult extends IInsuranceAndFund {
    totalFund: number; // 总五险一金
    totalHousingFund: number; // 总住房公积金
}

// export type TInsuranceKey = keyof IInsuranceAndFundResult;

export interface ICalculateData<T = IInsuranceAndFund> {
    salary: number;
    specialAdditionalDeduction: number;
    yearEndAwardsNumber: number; // 年终奖月数
    yearEndAwards: number; // 年终奖总数 优先级高于yearEndAwardsNumber，当为0时则使用yearEndAwardsNumber计算
    insuranceAndFundBase: number;
    startingSalary: number;
    insuranceAndFundRate: T;
    insuranceAndFundRateOfCompany: T ;
    extraBonus: number[] | number;
    housingFundRange: IHousingFundRange;
}

export type ICalculateOptions = Partial<ICalculateData<IInsuranceAndFundOptions>>;

export type ILevels = {
    value: number;
    rate: number;
    deduction: number;
}[]

export interface ICalculateResult {
    salaryBase: number;
    salaryPreTax: number[];
    salaryAfterTax: number[];
    salaryAfterTaxAvg: number;
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

export default class Salary implements ICalculateData {
    salary: number; // 基础工资
    specialAdditionalDeduction: number; // 每月专项附加扣除 租房扣除
    yearEndAwardsNumber: number; // 年终奖月数
    yearEndAwards: number; // 年终奖 0表示默认使用 年终奖月数
    insuranceAndFundBase: number; // 五险一金计算基础，为上一年度平均薪资，默认为salary
    startingSalary: number; // 个税起征点
    insuranceAndFundRate: IInsuranceAndFund;
    insuranceAndFundRateOfCompany: IInsuranceAndFund;
    extraBonus: number | number[]; // 每月额外奖金
    housingFundRange: IHousingFundRange; // 公积金计算上下限

    salaryResult: ICalculateResult;

    constructor (options: Partial<ICalculateData>);
    calculate (): ICalculateResult;
}