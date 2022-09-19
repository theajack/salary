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
import {ICalculateData, ICalculateResult} from './index.d';
import {avgArray, sumArray} from './utils';

function fillExtraBonus (extraBonus: number | number[]) {
    if (typeof extraBonus === 'number') {
        const value = extraBonus;
        extraBonus = new Array(12);
        extraBonus.fill(value);
    } else {
        for (let i = extraBonus.length; i < 12; i++) {
            extraBonus[i] = 0;
        }
    }
    return extraBonus;
}

export function calculateSalary ({
    salary, //
    specialAdditionalDeduction, // 每月专项附加扣除 租房扣除
    yearEndAwardsNumber, // 年终奖月数
    yearEndAwards, // 年终奖
    insuranceAndFundBase, // 五险一金计算基础，为上一年度平均薪资，默认为salary
    startingSalary, // 个税起征点
    insuranceAndFundRate,
    insuranceAndFundRateOfCompany,
    extraBonus, // 每月额外奖金
    housingFundRange, // 公积金计算上下限
}: ICalculateData): ICalculateResult {

    extraBonus = fillExtraBonus(extraBonus);

    // 对部分数据附默认值
    const shapedData = initRelatedParameter({
        salary,
        insuranceAndFundBase,
        insuranceAndFundRate,
        insuranceAndFundRateOfCompany
    });
    insuranceAndFundBase = shapedData.insuranceAndFundBase;
    insuranceAndFundRateOfCompany = shapedData.insuranceAndFundRateOfCompany;

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

    const {
        salaryAfterTax,
        salaryTax,
        totalSalaryAfterTaxExcludeAwards,
        salaryTotalTax,
        totalSalaryAfterTax
    } = accumulateCalculate({
        salary,
        extraBonus,
        startingSalary,
        specialAdditionalDeduction,
        totalFund: insuranceAndFund.totalFund,
        awardsAfterTax,
    });
    return {
        salaryBase: salary, // 月基础工资
        salaryPreTax: extraBonus.map(v => v + salary), // 税前月薪
        salaryAfterTax, // 每月税后收入
        salaryAfterTaxAvg: avgArray(salaryAfterTax),
        salaryTax, // 每月个人所得税
        salaryTotalTax,
        totalSalaryAfterTaxExcludeAwards, // 除去年终奖总收入
        totalSalaryPreTax: awardsPreTax + salary * 12 + sumArray(extraBonus), // 税前年总收入
        totalSalaryAfterTax, // 税后年总收入
        insuranceAndFund, // 五险一金
        insuranceAndFundOfCompany,
        awardsPreTax, // 税前年终奖
        awardsTax,
        awardsAfterTax, // 税后年终奖
    };
}

function initRelatedParameter ({
    salary,
    insuranceAndFundBase,
    insuranceAndFundRate,
    insuranceAndFundRateOfCompany,
}: Pick<
    ICalculateData,
    'salary' | 'insuranceAndFundBase' | 'insuranceAndFundRateOfCompany' | 'insuranceAndFundRate'
>): Pick<
    ICalculateData,
    'insuranceAndFundBase' | 'insuranceAndFundRateOfCompany'
> {
    if (!insuranceAndFundBase) insuranceAndFundBase = salary;

    const companyRate = Object.assign({}, insuranceAndFundRateOfCompany);

    if (companyRate.housingFund === -1) {
        companyRate.housingFund = insuranceAndFundRate.housingFund;
    }

    if (companyRate.supplementaryFund === -1) {
        companyRate.supplementaryFund = insuranceAndFundRate.supplementaryFund;
    }

    return {
        insuranceAndFundBase,
        insuranceAndFundRateOfCompany: companyRate
    };
}

// 累计计算过程
function accumulateCalculate ({
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
}): Pick<
    ICalculateResult,
    'salaryAfterTax' | 'salaryTax' | 'totalSalaryAfterTaxExcludeAwards' | 'salaryTotalTax' | 'totalSalaryAfterTax'
> {
    const salaryAfterTax: number[] = [];
    const salaryTax: number[] = [];
    
    let totalPersonalTncomeTax = 0; // 累计个人所得税缴税额

    let cumulativeExtraBonus = 0;

    for (let i = 1; i < 13; i++) {

        const curretBonus = ((extraBonus as number[])[i - 1] || 0);
        cumulativeExtraBonus += curretBonus;

        const cumulativePreTaxIncome = i * salary + cumulativeExtraBonus; // 累计应税收入 todo 额外津贴奖金
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

        const singleSalaryAfterTax = salary + curretBonus - totalFund - singleSalaryTax;
        salaryAfterTax.push(singleSalaryAfterTax);
        salaryTax.push(singleSalaryTax);
        totalPersonalTncomeTax += singleSalaryTax; // 累计个人所得税缴税额
    }

    const totalSalaryAfterTaxExcludeAwards = sumArray(salaryAfterTax);
    const salaryTotalTax = sumArray(salaryTax);

    return {
        salaryAfterTax,
        salaryTax,
        totalSalaryAfterTaxExcludeAwards,
        salaryTotalTax,
        totalSalaryAfterTax: totalSalaryAfterTaxExcludeAwards + awardsAfterTax
    };
}
