import { RepaymentType } from '../enums/RepaymentType';

export interface LoanSummaryTableRow {
    totalPayment: number;
    totalGrant: number;
    totalInterestPaid: number;
    duration: number;
    cashPaymentAmount: number;
    repaymentType: RepaymentType;
}