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

import {ICalculateData, IInsuranceAndFundResult} from './type';

// 五险一金计算器
export function calculateInsuranceAndFund ({
    insuranceAndFundBase,
    insuranceAndFundRate,
    housingFundRange,
}: Pick<
    ICalculateData,
    'insuranceAndFundBase' | 'insuranceAndFundRate' | 'housingFundRange'
>) {
    const result: IInsuranceAndFundResult = {} as any;
    let totalFund = 0;

    for (const k in insuranceAndFundRate) {

        let countBaseSalary = insuranceAndFundBase;

        if (k === 'housingFund' || k === 'supplementaryFund') {
            if (insuranceAndFundBase < housingFundRange.min) {
                countBaseSalary = housingFundRange.min;
            } else if (insuranceAndFundBase > housingFundRange.max) {
                countBaseSalary = housingFundRange.max;
            }
        }

        const value = countBaseSalary[k] * countBaseSalary;
        result[k] = value;
        totalFund += value;
    }
    result.totalFund = totalFund;
    result.totalHousingFund = result.housingFund + result.supplementaryFund;
    return result;
}