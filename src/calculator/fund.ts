/*
 * @Author: tackchen
 * @Date: 2022-09-16 08:32:03
 * @Description: 五险一金计算
 *
    默认为上海标准
    养老保险单位缴纳比例：21%;个人缴纳比例：8%
    医疗保险单位缴纳比例：11%;个人缴纳比例：2%
    失业保险单位缴纳比例：1.5%;个人缴纳比例：0.5%
    生育保险单位缴纳比例：1%;个人不承担缴费
    工伤保险单位缴纳比例：0.5%;个人不承担缴费
    住房公积金：7%；个人7%
    补充住房公积金：5%；个人5%

    公积金范围 [ 2590, 34188 ]
 */

import {ICalculateData, IInsuranceAndFundResult} from './index.d';

// 五险一金计算器
export function calculateInsuranceAndFund ({
    insuranceAndFundBase,
    insuranceAndFundRate,
    housingFundRange,
}: Pick<
    ICalculateData,
    'insuranceAndFundBase' | 'insuranceAndFundRate' | 'housingFundRange'
>) {
    const result: IInsuranceAndFundResult = {
        totalFund: 0,
    } as any;

    for (const k in insuranceAndFundRate) {

        const key = k as keyof IInsuranceAndFundResult;
        let countBaseSalary = insuranceAndFundBase;

        if (key === 'housingFund' || key === 'supplementaryFund') {
            if (insuranceAndFundBase < housingFundRange.min) {
                countBaseSalary = housingFundRange.min;
            } else if (insuranceAndFundBase > housingFundRange.max) {
                countBaseSalary = housingFundRange.max;
            }
        }

        const value = (insuranceAndFundRate as any)[key] * countBaseSalary;
        result[key] = value;
        result.totalFund += value;
    }
    result.totalHousingFund = result.housingFund + result.supplementaryFund;
    return result;
}