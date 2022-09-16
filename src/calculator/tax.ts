/*
 * @Author: tackchen
 * @Date: 2022-09-16 08:48:28
 * @Description: 个人所得税计算
 */

// 1.年度不超过36000元的税率为: 3% 速算扣除数: 0

// 2.超过36000-144000元的部分税率为: 10% 速算扣除数: 2520

// 3.超过144000-300000元的部分税率为: 20% 速算扣除数: 16920

// 4.超过300000-420000元的部分税率为: 25% 速算扣除数: 31920

// 5.超过420000-660000元的部分税率为: 30% 速算扣除数: 52920

// 6.超过660000-960000元的部分税率为: 35% 速算扣除数: 85920

// 7.超过960000元的税率为: 45% 速算扣除数: 181920

import {countLevel} from './utils';

export function calculatePersionalIncomeTax ({
    accumulatedTaxableIncome,
    totalPersonalTncomeTax
}: {
    accumulatedTaxableIncome: number,
    totalPersonalTncomeTax: number,
}) {
    const {rate, deduction} = countMonthSalayLevel(accumulatedTaxableIncome);
    // 当月个税 = （累计应纳税所得额 * 预扣率 - 速算扣除数）- 累计减免税额【0】 - 累计已缴税额
    const accumulatedTaxDeduction = 0;
    return accumulatedTaxableIncome * rate - deduction
         - accumulatedTaxDeduction - totalPersonalTncomeTax;
}

function countMonthSalayLevel (accumulatedTaxableIncome: number) {
    const levels = [
        {value: 36000, rate: 0.03, deduction: 0},
        {value: 144000, rate: 0.1, deduction: 2520},
        {value: 300000, rate: 0.2, deduction: 16920},
        {value: 420000, rate: 0.25, deduction: 31920},
        {value: 660000, rate: 0.3, deduction: 52920},
        {value: 960000, rate: 0.35, deduction: 85920},
        {value: 0, rate: 0.45, deduction: 181920},
    ];

    return countLevel(accumulatedTaxableIncome, levels);
}