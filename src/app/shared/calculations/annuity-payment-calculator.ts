export class AnnuityPaymentCalculator {
    private firstAnnuity: number;
    private firstAnnuityCoveredByGrant: number;
    private totalInterestPaid: number;
    private totalGrant: number;
    private totalPaymentWithGrant: number;
    private totalPayment: number;

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

        this.firstAnnuity = this.calculateFirstAnnuity();
        this.firstAnnuityCoveredByGrant = this.calculateFirstAnnuityCoveredByGrant();
        this.totalInterestPaid = this.calculateTotalInterestPaid();
        this.totalPayment = this.calculateTotalPayment();
        this.totalGrant = this.calculateTotalGrant();
        this.totalPaymentWithGrant = this.calculateTotalPaymentWithGrant();
    }

    public getCreditLength() {
        return this.creditLength;
    }

    public getAnnuity(){
        return this.firstAnnuity;
    }
    public getAmountBorrowed(){
        return this.amountBorrowed;
    }
    public getTotalInterestPaid(){
        return this.totalInterestPaid;
    }
    public getTotalGrant(){
        return this.totalGrant;
    }
    public getTotalPayment(){
        return this.totalPayment;
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

    public calculateTotalPayment(){
        return this.amountBorrowed + this.totalInterestPaid;
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
    //////

    public calculateFirstAnnuity(){
        var r = (this.interestRate / 100) + 1
        var r2 = Math.pow(r, 1 / 12);
        var n = this.creditLength;
        var C0 = this.amountBorrowed;

        var b = Math.pow(r2, n);

        var result = C0 * ((b * (r2 - 1)) / (b - 1));

        return Math.round(result * 100) / 100;
    }

    public calculateFirstAnnuityCoveredByGrant(){
        var r = (this.interestRate / 100) + 1
        var r2 = Math.pow(r, 1 / 12);
        var n = this.creditLength;
        var C0 = this.amountBorrowedCoveredByGrant;

        var b = Math.pow(r2, n);

        var result = C0 * ((b * (r2 - 1)) / (b - 1));

        return Math.round(result * 100) / 100;
    }

    public borrowedAmountPaymentForMonth(month: number){
        var result = this.firstAnnuity - this.interestPaidForMonth(month);

        return Math.round(result * 100) / 100;

    }

    /*public borrowedAmountCoveredByGrantPaymentForMonth(month:number){
        var result = this.firstAnnuityCoveredByGrant - this.grantInterestPaidForMonth(month);
    }*/

    public interestPaidForMonth(month: number){
        var r = (this.interestRate / 100) / 12;
        var result = this.borrowedAmountLeft(month - 1) * r;

        return Math.round(result * 100) / 100;
    }

    /*public grantInterestPaidForMonth(month: number){
        var r = (this.interestRate / 100) / 12;
        var result = this.borrowedAmountCoveredByGrantleft(month - 1) * r;

        return Math.round(result * 100) / 100;
    }*/

    public borrowedAmountLeft(month: number){
        var r = (this.interestRate / 100) + 1
        var r2 = Math.pow(r, 1 / 12);
        var n = this.creditLength;
        var C0 = this.amountBorrowed;

        var b = Math.pow(r2, n);

        var A = C0 * ((b * (r2 - 1)) / (b - 1));

        var p = n - month;

        var result = A * ((Math.pow(r2, p) - 1) / (Math.pow(r2, p) * (r2 - 1)));

        return Math.round(result * 100) / 100;
    }

    /*public borrowedAmountCoveredByGrantleft(month: number){
        var r = (this.interestRate / 100) + 1
        var r2 = Math.pow(r, 1 / 12);
        var n = this.creditLength;
        var C0 = this.amountBorrowedCoveredByGrant;

        var b = Math.pow(r2, n);

        var A = C0 * ((b * (r2 - 1)) / (b - 1));

        var p = n - month;

        var result = A * ((Math.pow(r2, p) - 1) / (Math.pow(r2, p) * (r2 - 1)));

        return Math.round(result * 100) / 100;        
    }*/

    public grantedPaymentForMonth(month: number){ //subvencijaRata
        if((this.grantDuration * 12) <= month) return 0;
        var r = this.grantPercentage / 100;

        var result = this.grantedAmountForAnuity() * r;

        return Math.round(result * 100) / 100;
    }

    public grantedAmountForAnuity() {
        var r = (this.interestRate / 100) + 1
        var r2 = Math.pow(r, 1 / 12);
        var n = this.creditLength;
        var C0 = this.amountBorrowedCoveredByGrant;
        var b = Math.pow(r2, n);

        var result = C0 * ((b * (r2 - 1)) / (b - 1));

        return Math.round(result * 100) / 100;
    }

    public amountToPayWithGrantForMonth(month: number){ //subvencijaOstatakAnuiter
        if((this.grantDuration * 12) <= month) return this.firstAnnuity;

        var r = this.grantPercentage / 100;
        var result = this.firstAnnuity - this.grantedPaymentForMonth(month);

        return Math.round(result * 100) / 100;
    }
}