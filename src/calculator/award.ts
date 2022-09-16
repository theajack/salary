/*
 * @Author: tackchen
 * @Date: 2022-09-16 08:31:39
 * @Description: 年终奖部分
 */

// 年终奖个人所得税计算方式：
// 1、发放年终奖的当月工资高于5000元时，年终奖扣税方式为：年终奖乘税率-速算扣除数，税率是按年终奖/12作为“应纳税所得额”对应的税率。
// 2、当月工资低于5000元时，年终奖个人所得税=(年终奖-(5000-月工资))乘税率-速算扣除数，税率是按年终奖-(5000-月工资)除以12作为“应纳税所得额”对应的税率。

import {ICalculateData} from './type';
import {countLevel} from './utils';

// 年终奖计税
export function calculateYearEndAwardsTax ({
    salary, // 月基础工资
    yearEndAwards, // 税前年终奖
    yearEndAwardsNumber,
    startingSalary,
}: Pick<
    ICalculateData,
    'salary' | 'yearEndAwards' | 'yearEndAwardsNumber' | 'startingSalary'
>) {
    const awardsPreTax = yearEndAwards || salary * yearEndAwardsNumber; // 税前年终奖
    
    const base = (salary > startingSalary)
        ? awardsPreTax
        : (awardsPreTax - (startingSalary - salary));

    const {rate, deduction} = countYearEndAwardsLevel(base / 12);
    const awardsTax = base * rate - deduction;
    return {
        awardsPreTax,
        awardsTax,
        awardsAfterTax: awardsPreTax - awardsTax,
    };
}

function countYearEndAwardsLevel (avgPreTaxYearEndAwards) {
    const levels = [
        {value: 3000, rate: 0.03, deduction: 0},
        {value: 12000, rate: 0.1, deduction: 210},
        {value: 25000, rate: 0.2, deduction: 1410},
        {value: 35000, rate: 0.25, deduction: 2660},
        {value: 55000, rate: 0.3, deduction: 4410},
        {value: 80000, rate: 0.35, deduction: 7360},
        {value: 0, rate: 0.45, deduction: 15160},
    ];

    return countLevel(avgPreTaxYearEndAwards, levels);
}
