export interface PaymentBreakdownInfo {
    singlePayment: PaymentBreakdown;
    multiPayment: Array<PaymentBreakdown>;
}

export interface PaymentBreakdown {
    principal: number;
    interestRate: number;
    grantDuration: number;
    grantPercentage: number;
    duration: number;
}


  