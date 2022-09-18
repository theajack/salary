/*
 * @Author: tackchen
 * @Date: 2022-09-15 08:31:54
 * @Description: Coding something
 */

import {calculateSalary} from './calculator';
import {ICalculateData, ICalculateResult, IHousingFundRange, IInsuranceAndFund} from './index.d';

export default class Salary implements ICalculateData {
    salary: number = 10000; // 基础工资
    specialAdditionalDeduction: number = 0; // 每月专项附加扣除 租房扣除
    yearEndAwardsNumber: number = 2; // 年终奖月数
    yearEndAwards: number = 0; // 年终奖 0表示默认使用 年终奖月数
    insuranceAndFundBase: number = 0; // 五险一金计算基础，为上一年度平均薪资，默认为salary
    startingSalary: number = 5000; // 个税起征点
    insuranceAndFundRate: IInsuranceAndFund = {
        pension: 0.08, // 养老保险 个人缴费费率为8%;
        medicalInsurance: 0.02, // 医疗保险 个人缴费比例为2%;
        unemploymentInsurance: 0.005, // 失业保险 个人缴费比例为0.5%;
        maternityInsurance: 0, // 生育保险
        injuryInsurance: 0, // 工伤保险
        housingFund: 0.07, // 住房公积金 7%
        supplementaryFund: 0.05, // 补充公积金 5%
    };
    insuranceAndFundRateOfCompany: IInsuranceAndFund = {
        pension: 0.21, // 养老保险 公司缴费费率为21%;
        medicalInsurance: 0.11, // 医疗保险 公司缴费比例为11%;
        unemploymentInsurance: 0.015, // 失业保险 公司缴费比例为1.5%;
        maternityInsurance: 0.01, // 生育保险
        injuryInsurance: 0.01, // 工伤保险
        housingFund: -1, // 住房公积金 -1 表示与个人缴纳的相等
        supplementaryFund: -1, // 补充公积金 -1 表示与个人缴纳的相等
    };
    extraBonus: number[] = []; // 每月额外奖金
    housingFundRange: IHousingFundRange = {min: 2590, max: 34188}; // 公积金计算上下限

    salaryResult: ICalculateResult;

    constructor (options: Partial<ICalculateData> = {}) {
        for (const k in options) {
            const key = k as keyof ICalculateData;
            if (typeof options[key] === 'object') {
                Object.assign(this[key], options[key]);
            } else if (typeof options[key] !== 'undefined') {
                this[key] = options[key] as any;
            }
        }
    }
    calculate () {
        this.salaryResult = calculateSalary(this);
        return this.salaryResult;
    }
}