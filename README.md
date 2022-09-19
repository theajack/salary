## [easy-salary](https://github.com/theajack/salary) （工资计算器）

**[在线使用](https://theajack.github.io/salary)**

适用于2022年新个税计算法的工资计算器，包含基础月薪、年终奖、五险一金、个人所得税计算

### 0. 使用

#### 1. 安装使用

```
npm i easy-salary
```

```ts
import Salary from 'easy-salary';

const result = (new Salary({
    salary: 10000,
    // ... 其他配置
})).calculate();
```

```ts
// 传入的配置参数
interface Config {
    salary?: number; // 基础工资
    specialAdditionalDeduction?: number; // 每月专项附加扣除 租房扣除
    yearEndAwardsNumber?: number; // 年终奖月数
    yearEndAwards?: number; // 年终奖 0表示默认使用 年终奖月数
    insuranceAndFundBase?: number; // 五险一金计算基础，为上一年度平均薪资，默认为salary
    startingSalary?: number; // 个税起征点
    insuranceAndFundRate?: IInsuranceAndFund; // 五险一金个人部分
    insuranceAndFundRateOfCompany?: IInsuranceAndFund; // 五险一金公司部分
    extraBonus?: number | number[]; // 每月额外奖金
    housingFundRange?: IHousingFundRange; // 公积金计算上下限
}
interface IInsuranceAndFund {
    pension?: number; // 养老保险
    medicalInsurance?: number; // 医疗保险
    unemploymentInsurance?: number; // 失业保险
    injuryInsurance?: number; // 工伤保险
    maternityInsurance?: number; // 生育保险
    housingFund?: number; // 住房公积金
    supplementaryFund?: number; // 补充住房公积金
}
interface IHousingFundRange {
    min: number;
    max: number;
}
```

详细配置与返回结果请参考 [声明文件](https://github.com/theajack/salary/blob/master/src/calculator/index.d.ts) 或 [在线使用](https://theajack.github.io/salary)

**cdn 引入**

```html
<script src="https://cdn.jsdelivr.net/npm/easy-salary/easy-salary.min.js"></script>
<script>
const result = (new window.Salary({
    salary: 10000,
    // ... 其他配置
})).calculate();
</script>
```

#### 2. 在线使用

[点击前往](https://theajack.github.io/salary)

### 1. 工资算法

分为基本工资和年终奖

#### 1.1 基本工资

几个概念

`累计应纳税所得额` = 累计应税收入 - 累计免税收入 - 累计减除费用 - 累计专项扣除 - 累计专项附加扣除 - 累计依法确定的其他扣除

`累计应税收入` = 月薪 * 月数

`累计免税收入` = 无 （这部分不清楚，目前当0处理）

`累计减除费用` = 起征点 （上海为5000） * 月数

`累计专项扣除` = 五险一金 * 月数 = 月薪 * (五险一金比例) * 月数

`累计专项附加扣除` = 专项扣除数值 * 月数 （就是个税app里填的 包括租房、房贷、赡养、子女教育等专项附加扣除）

`累计依法确定的其他扣除` = 无（这部分不清楚，目前当0处理）

所以

`累计应纳税所得额` = (月薪 - 0 - 起征点 - 月薪 * 五险一金比例 - 专项扣除数值 - 0) * 月数

`当月个税` = （累计应纳税所得额 * 预扣率 - 速算扣除数）- 累计减免税额【这部分不清楚，目前当0处理】 - 累计已缴税额

`税后收入` = 月薪 - 月薪 * 五险一金比例 - 当月个税

**预扣率与速算扣除数表**

```js
const levels = [
    {value: 36000, rate: 0.03, deduction: 0},
    {value: 144000, rate: 0.1, deduction: 2520},
    {value: 300000, rate: 0.2, deduction: 16920},
    {value: 420000, rate: 0.25, deduction: 31920},
    {value: 660000, rate: 0.3, deduction: 52920},
    {value: 960000, rate: 0.35, deduction: 85920},
    {value: 0, rate: 0.45, deduction: 181920},
];
```

规则是累计应纳税所得额

不超过36000，预扣率=3%，速算扣除数=0，

不超过144000，预扣率=10%，速算扣除数=2520，

后续依次类推


**五险一金比例**

上海市：

养老保险单位缴费费率为20%，个人缴费费率为8%;

医疗保险单位缴费比例为10%，个人缴费比例为2%;

工伤保险单位缴费比例为0.2-1.9%，个人不缴费;

生育保险单位缴费比例为1%，个人不缴费;

失业保险单位缴费比例为1%，个人缴费比例为0.5%;

住房公积金单位和个人缴费比例各为7%。

如果有补充公积金的话另算： 一般补充为5%

**住房公积金缴存基数范围**

上海市：住房公积金和补充住房公积金缴存基数最高不超过`34188`元, 最低不低于`2590`元

也就是工资超过 34188 按照 34188计算，低于 2590 按 2590计算


#### 1.2 年终奖部分

年终奖部分计税规则

1、发放年终奖的当月工资高于`个税起征点`时，年终奖扣税方式为：年终奖乘税率-速算扣除数，税率是按年终奖/12作为“应纳税所得额”对应的税率。

2、当月工资低于`个税起征点`元时，年终奖个人所得税=(年终奖-(`个税起征点`-月工资))乘税率-速算扣除数，税率是按年终奖-(`个税起征点`-月工资)除以12作为“应纳税所得额”对应的税率。


年终奖应纳税所得额与税率和速算扣除数关系

表如下

```js
const levels = [
    {value: 3000, rate: 0.03, deduction: 0},
    {value: 12000, rate: 0.1, deduction: 210},
    {value: 25000, rate: 0.2, deduction: 1410},
    {value: 35000, rate: 0.25, deduction: 2660},
    {value: 55000, rate: 0.3, deduction: 4410},
    {value: 80000, rate: 0.35, deduction: 7360},
    {value: 0, rate: 0.45, deduction: 15160},
];
```

规则是年终奖应纳税所得额

不超过3000，预扣率=3%，速算扣除数=0，

不超过12000，预扣率=10%，速算扣除数=210，

后续依次类推

**综上整理出公式**


> 年终奖税前 = 月薪 * 年终奖系数

>> 当 月薪 > 起征点：

>>>  年终奖税率、速算扣除数 = 查表（年终奖税前 / 12）

>>>  年终奖个人所得税 = 年终奖税前 * 税率 - 速算扣除数

>> 当 月薪 < 起征点

>>>  年终奖税率、速算扣除数 = 查表（ 年终奖 - ( 个税起征点 - 月薪 ））/ 12）

>>>  年终奖个人所得税 = (年终奖税前 - ( 个税起征点 - 月薪 ) ) * 税率 - 速算扣除数

> 然后年终奖税后收入

> 年终奖税后收入 = 年终奖税前 - 年终奖个人所得税


#### 1.3 示例

综上，那么可以举个例子

假设张三月工资3万（抬高工资是为了更方便体现累计跳档），年终奖系数为2个月，五险一金是 22.5%，每月专项附加扣除为1500


调用 `easy-salary` 计算

```js
calculateSalary({
    salary: 30000, // 月薪
    specialAdditionalDeduction: 1500, // 每月专项附加扣除 租房扣除
    yearEndAwardsNumber: 2, // 年终奖月数
    startingSalary: 5000, // 个税起征点
    insuranceAndFundRate: {
        pension: 0.08, // 养老保险 个人缴费费率为8%;
        medicalInsurance: 0.02, // 医疗保险 个人缴费比例为2%;
        unemploymentInsurance: 0.005, // 失业保险 个人缴费比例为0.5%;
        housingFund: 0.07, // 住房公积金 7%
        supplementaryFund: 0.05, // 补充公积金 5%
    },
})
```

得到结果：

```js
{
    salaryAfterTax: [22747.5, 22747.5, 21750, 21575, 21575, 21575, 21575, 21575, 20900, 19900, 19900, 19900],
    totalSalaryAfterTax: 309930,
    awardsAfterTax: 54210,
    insuranceAndFund: housingFund: 2100,
    medicalInsurance: 600,
    pension: 2400,
    supplementaryFund: 1500,
    totalFund: 6750,
    totalHousingFund: 3600,
    unemploymentInsurance: 150,
    salaryTax: [502.5, 502.5, 1500, 1675, 1675, 1675, 1675, 1675, 2350, 3350, 3350, 3350],
    salaryPreTax: 30000,
    totalSalaryPreTax: 420000,
    awardsPreTax: 60000,
    awardsTax: 5790,
}
```

其中主要的有

salaryAfterTax 表示12个月税后收入

totalSalaryAfterTax 表示年税后总收入(含年终)

awardsAfterTax 年终奖税后收入

salaryTax 12个月的个税数值

接下来分解一下计算过程

首先上公式：

`累计应纳税所得额` = (月薪 - 0 - 起征点 - 月薪 * 五险一金比例 - 专项扣除数值 - 0) * 月数

`当月个税` = （累计应纳税所得额 * 预扣率 - 速算扣除数）- 累计减免税额【这部分不清楚，目前当0处理】 - 累计已缴税额

`税后收入` = 月薪 - 月薪 * 五险一金比例 - 当月个税

则1月份

`累计应纳税所得额` = (30000 - 0 - 5000 - 30000 * 0.225 - 1500 - 0) * 1 = 16750

`当月个税` = 16750 * 0.03 - 0 - 0 = 502.5

`税后收入` = 30000 - 30000 * 0.225 - 502.5 = 22747.5

2月份

`累计应纳税所得额` = (30000 - 0 - 5000 - 30000 * 0.225 - 1500 - 0) * 2 = 33500

`当月个税` = 33500 * 0.03 - 0 - 502.5 = 502.5

`税后收入` = 30000 - 30000 * 0.225 - 502.5 = 22747.5

2月份

`累计应纳税所得额` = (30000 - 0 - 5000 - 30000 * 0.225 - 1500 - 0) * 3 = 50250

`当月个税` = 50250 * 0.1 - 2520 - 1005 = 1500 （超过了36000，发生跳档）

`税后收入` = 30000 - 30000 * 0.225 - 1500 = 21750

后续依次类推

![]()