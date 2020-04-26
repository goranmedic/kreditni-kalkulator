export class RatePaymentCalculator {
    private firstRate: number;
    private totalInterestPaid: number;
    private totalGrant: number;
    private totalPaymentWithGrant: number;
    private totalPayment: number;

    private borrowedAmountPaymentPerMonth: number;
    private borrowedAmountPaymentPerMonthCoveredByGrant: number;

    private interestRate: number;
    private creditLength: number;
    private amountBorrowed: number;
    private amountBorrowedCoveredByGrant: number;
    private grantPercentage: number;
    private grantDuration: number;
    private propertySize: number;

    private maxGrantPerSquaredMeter: number = 1500;
    private maxGrantTotal: number = 100000;

    constructor(interestRate: number, creditLength: number, amountBorrowed: number, grantPercentage: number, grantDuration: number, propertySize: number) { 
        this.interestRate = interestRate;
        this.creditLength = creditLength*12;
        this.amountBorrowed = amountBorrowed;
        this.grantDuration = grantDuration;
        this.grantPercentage = grantPercentage;
        this.propertySize = propertySize;

        this.amountBorrowedCoveredByGrant = propertySize * this.maxGrantPerSquaredMeter > this.maxGrantTotal ? this.maxGrantTotal : propertySize * this.maxGrantPerSquaredMeter;

        this.firstRate = this.calculateFirstRate();
        this.borrowedAmountPaymentPerMonth = this.calculateBorrowedAmountPaymentPerMonth();
        this.borrowedAmountPaymentPerMonthCoveredByGrant = this.calculateBorrowedAmountCoveredByGrantPaymentPerMonth();
        this.totalInterestPaid = this.calculateTotalInterestPaid();
        this.totalPayment = this.calculateTotalPayment();
        this.totalGrant = this.calculateTotalGrant();
        this.totalPaymentWithGrant = this.calculateTotalPaymentWithGrant();
    }
    
    public getCreditLength() {
        return this.creditLength;
    }

    public getAmountBorrowed(){
        return this.amountBorrowed;
    }

    public getBorrowedAmountPaymentPerMonth() {
        return this.borrowedAmountPaymentPerMonth;
    }
    public getTotalInterestPaid(){
        return this.totalInterestPaid;
    }

    public getTotalPayment(){
        return this.totalPayment;
    }

    public getTotalGrant(){
        return this.totalGrant;
    }

    public getTotalPaymentWithGrant(){
        return this.totalPaymentWithGrant;
    }

    private calculateTotalInterestPaid(){
        var interest = 0;

        for(let i = 1; i <= this.creditLength; i++){
            interest += this.interestPaidForMonth(i);
        }

        return Math.round(interest * 100) / 100;
    }

    private calculateFirstRate() {
        var C0 = this.amountBorrowed;
        var r = this.interestRate / 100;
        var n = this.creditLength;
        var g = C0 / n;
        var k = (C0 * r) / 12;

        var result = g + k;

        return Math.round(result * 100) / 100;
    }

    public calculateTotalPayment(){
        var result = this.amountBorrowed + this.calculateTotalInterestPaid();

        return Math.round(result * 100) / 100;
    }

    public calculateTotalGrant(){
        var grant = 0;
        for(let i = 1; i <= this.creditLength; i++){
            grant += this.grantedPaymentForMonth(i);
        }

        return Math.round(grant * 100) / 100;
    }

    public calculateTotalPaymentWithGrant(){
        return Math.round((this.totalPayment - this.totalGrant) / 100) * 100;
    }

    public calculateBorrowedAmountPaymentPerMonth(){
        var C0 = this.amountBorrowed;
        var n = this.creditLength;
        var g = C0 / n;

        return Math.round(g * 100) / 100;
    }

    public calculateBorrowedAmountCoveredByGrantPaymentPerMonth(){
        var C0 = this.amountBorrowedCoveredByGrant;
        var n = this.creditLength;
        var g = C0 / n;

        return Math.round(g * 100) / 100;
    }

    //////////

    public borrowedAmountLeft(month: number){
        var C0 = this.amountBorrowed;
        var n = this.creditLength;
        var g = C0 / n;
        var C1 = C0 - (g * (month));

        return Math.round(C1 * 100) / 100;
    }


    public grantedAmountForMonth(month: number){
        return Math.round(this.borrowedAmountPaymentPerMonthCoveredByGrant + this.grantInterestPaidForMonth(month));
    }

    public grantedPaymentForMonth(month: number){ //subvencijaRata
        if((this.grantDuration * 12) <= month) return 0;
        var r = this.grantPercentage / 100;

        var result = this.grantedAmountForMonth(month) * r;

        return Math.round(result * 100) / 100;
    }

    public amountToPayForMonth(month: number){
        return Math.round(this.borrowedAmountPaymentPerMonth + this.interestPaidForMonth(month))
    }

    public amountToPayWithGrantForMonth(month: number){ //subvencijaOstatakRata
        if((this.grantDuration * 12) <= month) return this.amountToPayForMonth(month);

        var r = this.grantPercentage / 100;
        var result = this.amountToPayForMonth(month) - this.grantedPaymentForMonth(month);

        return Math.round(result * 100) / 100;
    }

    public interestPaidForMonth(month: number){
        var n = this.creditLength;
        var C0 = this.amountBorrowed;
        var g = C0 / n;
        var C1 = C0 - (g * (month - 1));
        var r = this.interestRate / 100;
        var k = (C1 * r) / 12;

        return Math.round(k * 100) / 100;
    }

    public grantInterestPaidForMonth(month: number){
        var n = this.creditLength;
        var C0 = this.amountBorrowedCoveredByGrant;
        var g = C0 / n;
        var C1 = C0 - (g * (month - 1));
        var r = this.interestRate / 100;
        var k = (C1 * r) / 12;

        return Math.round(k * 100) / 100;
    }
}