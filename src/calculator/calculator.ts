/*
 * @Author: tackchen
 * @Date: 2022-09-16 08:33:12
 * @Description: Coding something
 */

/*
累计应纳税所得额 = 累计应税收入 - 累计免税收入 - 累计减除费用 - 累计专项扣除 - 累计专项附加扣除 - 累计依法确定的其他扣除

累计应税收入 : 月薪 * 月数
累计免税收入 : 无 （这部分不清楚，目前当0处理）
累计减除费用 = 起征点（ 上海为5000） * 月数
累计专项扣除 = 五险一金 * 月数 = 月薪 * 五险一金比例 * 月数
累计专项附加扣除 = 专项扣除数值 * 月数

累计依法确定的其他扣除 = 无 （这部分不清楚，目前当0处理）
累计应纳税所得额 = (月薪 - 0 - 起征点 - 月薪 * 五险一金比例 - 专项扣除数值 - 0) * 月数

当月个税 = （累计应纳税所得额 * 预扣率 - 速算扣除数）- 累计减免税额【0】 - 累计已缴税额
 */

import {calculateInsuranceAndFund} from './fund';
import {calculatePersionalIncomeTax} from './tax';
import {calculateYearEndAwardsTax} from './award';
import {ICalculateData, ICalculateResult} from './type';
import {sumArray} from './utils';

export function calculateSalary ({
    salary = 32880, //
    specialAdditionalDeduction = 1500, // 每月专项附加扣除 租房扣除
    yearEndAwardsNumber = 5, // 年终奖月数
    yearEndAwards = 0, // 年终奖
    insuranceAndFundBase = 0, // 五险一金计算基础，为上一年度平均薪资，默认为salary
    startingSalary = 5000, // 个税起征点
    insuranceAndFundRate = {
        pension: 0.08, // 养老保险 个人缴费费率为8%;
        medicalInsurance: 0.02, // 医疗保险 个人缴费比例为2%;
        unemploymentInsurance: 0.005, // 失业保险 个人缴费比例为0.5%;
        housingFund: 0.07, // 住房公积金 7%
        supplementaryFund: 0.05, // 补充公积金 5%
    },
    insuranceAndFundRateOfCompany = {
        pension: 0.08, // 养老保险 个人缴费费率为8%;
        medicalInsurance: 0.02, // 医疗保险 个人缴费比例为2%;
        unemploymentInsurance: 0.005, // 失业保险 个人缴费比例为0.5%;
        housingFund: 0.07, // 住房公积金 7%
        supplementaryFund: 0.05, // 补充公积金 5%
    },
    extraBonus = [], // 每月额外奖金
    housingFundRange = {min: 2590, max: 34188},
}: ICalculateData): ICalculateResult {

    if (!insuranceAndFundBase) insuranceAndFundBase = salary;

    // 计算年终奖
    const {awardsPreTax, awardsTax, awardsAfterTax} = calculateYearEndAwardsTax({
        salary,
        yearEndAwards,
        yearEndAwardsNumber,
        startingSalary,
    });

    // 计算五险一金
    const insuranceAndFund = calculateInsuranceAndFund({
        insuranceAndFundBase,
        insuranceAndFundRate,
        housingFundRange,
    });

    // 计算五险一金 公司缴费部分
    const insuranceAndFundOfCompany = calculateInsuranceAndFund({
        insuranceAndFundBase,
        insuranceAndFundRate: insuranceAndFundRateOfCompany,
        housingFundRange,
    });

    const result: ICalculateResult = {
        salaryPreTax: salary, // 税前月薪
        salaryAfterTax: [], // 每月税后收入
        salaryTax: [], // 每月个人所得税
        salaryTotalTax: 0,
        totalSalaryAfterTaxExcludeAwards: 0, // 除去年终奖总收入
        totalSalaryPreTax: awardsPreTax + salary * 12, // 税前年总收入
        totalSalaryAfterTax: 0, // 税后年总收入
        insuranceAndFund, // 五险一金
        insuranceAndFundOfCompany,
        awardsPreTax, // 税前年终奖
        awardsTax,
        awardsAfterTax, // 税后年终奖
    };
    
    return result;
    
}

// 累计计算过程
export function accumulateCalculate ({
    salary,
    extraBonus,
    startingSalary,
    specialAdditionalDeduction,
    totalFund,
    awardsAfterTax,
}: Pick<
    ICalculateData,
    'salary' | 'extraBonus' | 'startingSalary' | 'specialAdditionalDeduction'
> & {
    totalFund: number; // 每月累计专项扣除 就是个人缴纳的五险一金
    awardsAfterTax: number;
}) {

    const salaryAfterTax: number[] = [];
    const salaryTax: number[] = [];
    
    let totalPersonalTncomeTax = 0; // 累计个人所得税缴税额

    for (let i = 1; i < 13; i++) {
        const cumulativePreTaxIncome = i * salary + (extraBonus[i - 1] || 0); // 累计应税收入 todo 额外津贴奖金
        const accumulatedTaxFreeIncome = 0; // 累计免税收入 todo
        const cumulativeDeductions = startingSalary * i; // 累计减除费用
        const cumulativeSpecialDeduction = totalFund * i; // 累计专项扣除
        const accumulatedSpecialAdditionalDeductions = specialAdditionalDeduction * i; // 累计专项附加扣除
        const others = 0; // todo
        // 累计应纳税所得额 = 累计应税收入 - 累计免税收入 - 累计减除费用 - 累计专项扣除 - 累计专项附加扣除 - 累计依法确定的其他扣除
        const accumulatedTaxableIncome =  // 累计应纳税所得额
            cumulativePreTaxIncome - accumulatedTaxFreeIncome - cumulativeDeductions -
            cumulativeSpecialDeduction - accumulatedSpecialAdditionalDeductions - others;

        const singleSalaryTax = calculatePersionalIncomeTax({
            accumulatedTaxableIncome,
            totalPersonalTncomeTax
        }); // 当月个人所得税

        const singleSalaryAfterTax = salary - totalFund - singleSalaryTax;
        salaryAfterTax.push(singleSalaryAfterTax);
        salaryTax.push(singleSalaryTax);
        totalPersonalTncomeTax += singleSalaryTax; // 累计个人所得税缴税额
    }

    const totalSalaryAfterTaxExcludeAwards = sumArray(salaryAfterTax);
    const salaryTotalTax = sumArray(salaryTax);

    return {
        totalSalaryAfterTaxExcludeAwards,
        salaryTotalTax,
        totalSalaryAfterTax: totalSalaryAfterTaxExcludeAwards + awardsAfterTax
    };
}
