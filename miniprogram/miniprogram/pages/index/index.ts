/*
 * @Author: tackchen
 * @Date: 2022-09-19 08:45:06
 * @Description: Coding something
 */
// index.ts
// 获取应用实例
import Salary from '../../utils/calculator/index';
import {TEXT_MAP, RESULT_TEXT_MAP} from '../../utils/map';

const salary = new Salary({});

console.log(salary.specialAdditionalDeduction);

function shapeSalaryResult (result: any) {
    for (const k in result) {
        if (result[k] instanceof Array) {
            result[k] = result[k].map((v: any, i: any) => {
                return `[${i + 1}月:${v.toFixed(2)}元]`;
            }).join(' ');
        } else if (typeof result[k] === 'number') {
            result[k] = `${parseInt(result[k])}元`;
        } else {
            result[k] = shapeSalaryResult(result[k]);
        }
    }
    return result;
}

Page({
    data: {
        salary: salary,
        result: {},
        TEXT_MAP,
        RESULT_TEXT_MAP,
        showUnnecessary: false,
    },
    // 事件处理函数
    onLoad () {
        this.calculate();
    },
    calculate () {
        salary.calculate();
        this.setData({
            result: shapeSalaryResult(salary.salaryResult)
        });
    },
    toggleUnnecessary () {
        this.setData({
            showUnnecessary: !this.data.showUnnecessary
        });
    },
    onBlur (e: any) {
        const {key, skey} = e.target.dataset;
        const {value} = e.detail;
        
        if (skey) {
            (salary as any)[key][skey] = parseFloat(value);
        } else {
            (salary as any)[key] = parseFloat(value);
        }

        this.calculate();
        wx.showToast({
            icon: 'none',
            title: '计算结果已更新'
        });

    },
    showInfo (e: any) {
        const {info} = e.target.dataset;
        wx.showToast({
            icon: 'none',
            title: info
        });
    }
    
});
