/*
 * @Author: tackchen
 * @Date: 2022-09-15 08:31:54
 * @Description: Coding something
 */

import {ICalculateData, IHousingFundRange, IInsuranceAndFund} from './type';

export class Salary implements ICalculateData {
    salary: number = 10000; // 基础工资
    specialAdditionalDeduction: number = 0; // 每月专项附加扣除 租房扣除
    yearEndAwardsNumber: number = 2; // 年终奖月数
    yearEndAwards: number
    insuranceAndFundBase: number; //
    startingSalary: number;
    insuranceAndFundRate: IInsuranceAndFund;
    extraBonus: number[];
    housingFundRange: IHousingFundRange;

    constructor (options: Partial<ICalculateData> = {}) {
        for (const k in options) {
            if (typeof options[k] === 'object') {
                Object.assign(this[k], options[k]);
            } else if (typeof options[k] !== 'undefined') {
                this[k] = options[k];
            }
        }
    }
}