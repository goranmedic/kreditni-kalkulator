export interface RepaymentSummary {
    annuity: AnnuityRepaymentSummary;
    rate: RateRepaymentSummary;
    cashPaymentAmount: number;
}

interface AnnuityRepaymentSummary extends BaseRepaymentSummary {
    annuity: number;
}

interface RateRepaymentSummary extends BaseRepaymentSummary {
    firstRate: number;
    lastRate: number;

}

interface BaseRepaymentSummary {
    totalPayment: number;
    principal: number;
    totalInterestPaid: number;
    totalGrant: number;
    duration: number;
}
  