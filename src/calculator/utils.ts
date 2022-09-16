/*
 * @Author: tackchen
 * @Date: 2022-09-16 08:44:39
 * @Description: Coding something
 */
import {ILevels} from './type';


export function countLevel (salary: number, levels: ILevels) {
    for (let i = 0; i < levels.length; i++) {
        const {value, rate, deduction} = levels[i];
        if (value === 0 || value > salary) {
            return {rate, deduction};
        }
    }
    return {rate: 0, deduction: 0};
}

export function sumArray (array: number[]) {
    return array.reduce((a, b) => a + b, 0);
}