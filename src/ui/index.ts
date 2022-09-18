/*
 * @Author: tackchen
 * @Date: 2022-09-18 09:55:36
 * @Description: Coding something
 */

import Salary from '../calculator';
import {toast} from './toast';
import {IMapInfo, TEXT_MAP, RESULT_TEXT_MAP} from './map';

export class UI {
    inputArea: HTMLDivElement;
    resultArea: HTMLDivElement;

    salary: Salary;

    emitResultList: Function[] = [];
    necEls: HTMLElement[] = [];

    constructor () {
        this.salary = new Salary();
        this.inputArea = window.document.querySelector('.input-area') as HTMLDivElement;
        this.resultArea = window.document.querySelector('.result-area') as HTMLDivElement;
        this._initInputUI();
        this._initResultUI();
        this._calculate();
    }

    private _calculate () {
        this.salary.calculate();
        this.emitResultList.forEach(fn => fn());
    }

    private _initInputUI () {

        const more = this._ce('div', 'input-more');
        const span = this._ce('span', '');
        const i = this._ce('i', 'ei-tasks');
        more.appendChild(i);
        more.appendChild(span);
        span.innerText = '展开更多信息';

        more.onclick = () => {
            if (span.innerText.includes('展开')) {
                span.innerText = '收起更多信息';
                this.necEls.forEach(el => el.classList.add('show'));
            } else {
                span.innerText = '展开更多信息';
                this.necEls.forEach(el => el.classList.remove('show'));
            }
        };
        this.inputArea.appendChild(more);

        const fragment = this._createFragmentCommon({
            map: TEXT_MAP,
            isInput: true,
        });
        this.inputArea.appendChild(fragment);
    }

    private _initResultUI () {
        const fragment = this._createFragmentCommon({
            map: RESULT_TEXT_MAP,
            isInput: false,
        });
        this.resultArea.appendChild(fragment);
    }

    private _createWrapper (map: IMapInfo, isInput: boolean) {
        const div = this._ce('div', 'salary-wrapper');
        const title = this._ce('div', 'salary-wrapper-title');
        this._checkNec(div, isInput, map.nec);
        title.innerText = map.text;
        div.appendChild(title);
        return div;
    }

    private _checkNec (el: HTMLElement, isInput: boolean, nec = false) {
        if (isInput && !nec) {
            el.classList.add('salary-not-nec');
            this.necEls.push(el);
        }
    }

    private _createSingleItem ({
        key,
        item,
        subKey,
        isInput = true
    }: {
        key: string,
        item: IMapInfo,
        subKey?: string,
        isInput?: boolean
    }) {
        const div = this._ce('div', 'salary-item');
        const title = this._ce('span', 'salary-title');
        title.innerText = item.text;
        div.appendChild(title);

        const salary = this.salary as any;

        if (isInput) {
            this._checkNec(div, isInput, item.nec);
            const input = this._ce('input', 'salary-input') as HTMLInputElement;
    
            const value = salary[key];
            input.value = subKey ? value[subKey] : value;
            if (key !== 'extraBonus')
                input.type = 'number';
    
            input.onchange = () => {
                const value = input.value;

                let inputValue: number | number[];
                if (key !== 'extraBonus') {
                    inputValue = parseFloat(value);
                } else {
                    if (value.indexOf(' ') !== -1) {
                        inputValue = value.split(' ').map(i => parseFloat(i));
                    } else {
                        inputValue = parseFloat(value);
                    }
                }
                if (subKey) {
                    salary[key][subKey] = inputValue;
                } else {
                    salary[key] = inputValue;
                }
                this._calculate();
                toast('计算结果已更新');
            };
            div.appendChild(input);
            if (item.unit) {
                const span = this._ce('span', 'salary-unit');
                span.innerText = item.unit;
                div.appendChild(span);
            }
        } else {
            const result = this._ce('span', 'salary-result') as HTMLInputElement;

            this.emitResultList.push(() => {
                const salaryResult = salary.salaryResult;
                let value = subKey ? salaryResult[key][subKey] : salaryResult[key];

                if (typeof value === 'number') {
                    value = value.toFixed(2) + '元';
                } else if (value instanceof Array) {
                    value = value.map((v, i) => {
                        return `[${i + 1}月:${v.toFixed(2)}元]`;
                    }).join(' ');
                }

                result.innerText = value;
            });
            div.appendChild(result);
        }

        if (item.info || item.url) {
            const info = this._ce('i', 'ei-info-sign');
            const infoStr = item.info || '查看详情';
            info.title = infoStr;
            if (item.url) {
                info.onclick = () => {window.open((item.url as string).substring(4));};
            } else {
                info.onclick = () => {toast(infoStr || '', 5000);};
            }
            div.appendChild(info);
        }

        return div;
    }

    private _createFragmentCommon ({
        map,
        isInput = true,
    }: {
        map: {[prod in string]: any},
        isInput?: boolean
    }) {
        const fragment = window.document.createDocumentFragment();
        
        for (const key in map) {
            const value = (map as any)[key];
            let el: HTMLElement;
            if (value.base) {
                el = this._createSingleItem({key, item: value, isInput});
            } else {
                el = this._createWrapper(value, isInput);
                for (const k in value) {
                    const item = value[k];
                    if (k !== 'text' && k !== 'nec') {
                        el.appendChild(this._createSingleItem({key, subKey: k, item, isInput}));
                    }
                }
            }
            fragment.appendChild(el);
        }

        return fragment;
    }

    private _ce (name: string, className = '') {
        const el = window.document.createElement(name);
        if (className) el.className = className;
        return el;
    }
}