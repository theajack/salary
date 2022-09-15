
export interface IInsuranceAndFund {

}

export interface IInsuranceAndFundResult extends I {
    
}

export interface ICalculateOptions {
    salary?: number | undefined;
    specialAdditionalDeduction?: number | undefined;
    finalNumber?: number | undefined;
    insuranceAndFundBase?: number | undefined;
    startingSalary?: number | undefined;
    insuranceAndFundRate?: {
        pension: number;
        medicalInsurance: number;
        unemploymentInsurance: number;
        housingFund: number;
        supplementaryFund: number;
    };
    extraBonus?: never[] | undefined;
}