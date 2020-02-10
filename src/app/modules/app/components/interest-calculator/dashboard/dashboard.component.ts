import { Component, OnInit, DoCheck, IterableDiffers, KeyValueDiffer, KeyValueDiffers, KeyValueChangeRecord } from '@angular/core';
import { AnnuityPaymentCalculator } from 'src/app/shared/calculations/annuity-payment-calculator';
import { RatePaymentCalculator } from 'src/app/shared/calculations/rate-payment-calculator';
import { EarlyRepayment } from 'src/app/shared/models/EarlyRepayment';
import { RepaymentSummary } from 'src/app/shared/models/RepaymentSummary';
import {isUndefined} from "util";
import { PaymentBreakdownInfo, PaymentBreakdown } from 'src/app/shared/models/PaymentBreakdownInfo';
import deepCopy from 'src/app/shared/utility/deepCopy';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
    private _amountBorrowed: number;
    private _creditLength: number;
    private _interestRate: number;
    private _grantDuration: number;
    private _grantPercentage: number;
    private _annuityCalculator: AnnuityPaymentCalculator;
    private _rateCalculator: RatePaymentCalculator;
    private _hasGrant: boolean;
    public  earlyRepayments: Array<EarlyRepayment> = [];
    public repaymentProjections: Array<RepaymentSummary> = [];
    public initialRepaymentProjection: RepaymentSummary;

    public set hasGrant(value: boolean){
        this._hasGrant = value;
        if(!value){
            this._grantDuration = 0;
            this._grantPercentage = 0;
        }
        this.updateProjections();
    }
    public set amountBorrowed(value: number) {
        this._amountBorrowed = value;
        this.updateProjections();
    }
    public set interestRate(value: number) {
        this._interestRate = value;
        this.updateProjections();
    }
    public set grantDuration(value: number) {
        this._grantDuration = value;
        this.updateProjections();
    }
    public set creditLength(value: number) {
        this._creditLength = value;
        this.updateProjections();
    }
    public set grantPercentage(value: number) {
        this._grantPercentage = value;
        this.updateProjections();
    }
    public set annuityCalculator(value: AnnuityPaymentCalculator){
        this._annuityCalculator = value;
    }
    public set rateCalculator(value: RatePaymentCalculator){
        this._rateCalculator = value;
    }

    public get amountBorrowed() {return this._amountBorrowed};
    public get creditLength() {return this._creditLength};
    public get interestRate() {return this._interestRate};
    public get grantDuration() {return this._grantDuration};
    public get grantPercentage() {return this._grantPercentage};
    public get annuityCalculator() {return this._annuityCalculator};
    public get rateCalculator() {return this._rateCalculator};
    public get hasGrant() {return this._hasGrant};

    constructor() {
    }

    ngOnInit() { 
        this.hasGrant = false;
        this.amountBorrowed = 220000;
        this.creditLength = 30;
        this.interestRate = 2.09;
        this.grantDuration = 0;
        this.grantPercentage = 0;
    }
    
    updateCalculators(){
       this.updateAnnuityCalculator();
       this.updateRateCalculator();
    }

    updateAnnuityCalculator(amountBorrowed?: number, creditLength?: number, interestRate?: number, grantPercentage?: number, grantDuration?: number){
        this.annuityCalculator = new AnnuityPaymentCalculator(
            isUndefined(interestRate) ? this.interestRate : interestRate, 
            isUndefined(creditLength) ? this.creditLength : creditLength, 
            isUndefined(amountBorrowed) ? this.amountBorrowed : amountBorrowed, 
            isUndefined(grantPercentage) ? this.grantPercentage : grantPercentage, 
            isUndefined(grantDuration) ? this.grantDuration : grantDuration);
    }
    updateRateCalculator(amountBorrowed?: number, creditLength?: number, interestRate?: number, grantPercentage?: number, grantDuration?: number){

        this.rateCalculator = new RatePaymentCalculator(
            isUndefined(interestRate) ? this.interestRate : interestRate, 
            isUndefined(creditLength) ? this.creditLength : creditLength, 
            isUndefined(amountBorrowed) ? this.amountBorrowed : amountBorrowed, 
            isUndefined(grantPercentage) ? this.grantPercentage : grantPercentage, 
            isUndefined(grantDuration) ? this.grantDuration : grantDuration);
    }

    updateProjections = () => {
        this.updateCalculators();
        this.repaymentProjections.length = 0;
        let initialRepayment = {
            annuity: {
                annuity: this.annuityCalculator.calculateFirstAnnuity(),
                duration: this.annuityCalculator.getCreditLength(),
                totalGrant: this.annuityCalculator.getTotalGrant(),
                totalInterestPaid:this.annuityCalculator.getTotalInterestPaid(),
                totalPayment: this.annuityCalculator.getTotalPayment(),
                principal: this.annuityCalculator.getAmountBorrowed()
            },
            rate: {
                firstRate: this.rateCalculator.amountToPayForMonth(0),
                lastRate: this.rateCalculator.amountToPayForMonth(this.rateCalculator.getCreditLength()),
                duration: this.rateCalculator.getCreditLength(),
                totalGrant: this.rateCalculator.getTotalGrant(),
                totalInterestPaid:this.rateCalculator.getTotalInterestPaid(),
                totalPayment: this.rateCalculator.getTotalPayment(),
                principal: this.rateCalculator.getAmountBorrowed()
            },
            cashPaymentAmount: 0
        } as RepaymentSummary;

        this.initialRepaymentProjection = deepCopy(initialRepayment);
        this.repaymentProjections.push(initialRepayment);
        this.earlyRepayments.forEach((earlyRepayment: EarlyRepayment, index: number) => {
            this.calculateEarlyRepayment(earlyRepayment, index);
        })
        
    }

    updateEarlierProjection = (nextRepayment: EarlyRepayment, index: number) => {
        const principalLeftAnnuity = this.annuityCalculator.borrowedAmountLeft(nextRepayment.year*12) - nextRepayment.amount;
        const principalLeftRate = this.rateCalculator.borrowedAmountLeft(nextRepayment.year*12) - nextRepayment.amount;
        const lastRateBeforeEarlyRepayment = this.rateCalculator.amountToPayForMonth(nextRepayment.year*12);

        let durationOfRepaymentsBeforeAnnuity = 0;
        let durationOfRepaymentsBeforeRate = 0;
        
        for(let i = 0; i < index; i++){
            durationOfRepaymentsBeforeAnnuity += this.repaymentProjections[i].annuity.duration;
            durationOfRepaymentsBeforeRate += this.repaymentProjections[i].rate.duration;
        }

        const creditDurationAnnuity = nextRepayment.year*12 - durationOfRepaymentsBeforeAnnuity;
        const creditDurationRate = nextRepayment.year*12 - durationOfRepaymentsBeforeRate;
        let totalInterestPaidAnnuity = 0;
        let totalInterestPaidRate = 0;
        let totalPaymentAnnuity = 0;
        let totalPaymentRate = 0;

        totalPaymentAnnuity = this.annuityCalculator.getAnnuity() * creditDurationAnnuity;

        for(let i = 1; i <= creditDurationAnnuity; i++) {
            totalInterestPaidAnnuity += this.annuityCalculator.interestPaidForMonth(i);
        }
        for(let i = 1; i <= creditDurationRate; i++) {
            totalInterestPaidRate += this.rateCalculator.interestPaidForMonth(i);
            totalPaymentRate += this.rateCalculator.amountToPayForMonth(i);
        }

        this.repaymentProjections[this.repaymentProjections.length-1].annuity.totalInterestPaid = totalInterestPaidAnnuity;
        this.repaymentProjections[this.repaymentProjections.length-1].annuity.totalPayment = totalPaymentAnnuity;
        this.repaymentProjections[this.repaymentProjections.length-1].annuity.duration = creditDurationAnnuity;
        this.repaymentProjections[this.repaymentProjections.length-1].rate.totalInterestPaid = totalInterestPaidRate;
        this.repaymentProjections[this.repaymentProjections.length-1].rate.totalPayment = totalPaymentRate;
        this.repaymentProjections[this.repaymentProjections.length-1].rate.lastRate = lastRateBeforeEarlyRepayment;
        this.repaymentProjections[this.repaymentProjections.length-1].rate.duration = creditDurationRate;

        this.updateAnnuityCalculator(principalLeftAnnuity, nextRepayment.newLoanDuration, nextRepayment.newInterestRate, 0, 0);
        this.updateRateCalculator(principalLeftRate, nextRepayment.newLoanDuration, nextRepayment.newInterestRate, 0, 0);
    }

    calculateEarlyRepayment = (earlyRepayment: EarlyRepayment, index: number) => {
        this.updateEarlierProjection(earlyRepayment, index);

        this.repaymentProjections.push({
            annuity: {
                annuity: this.annuityCalculator.calculateFirstAnnuity(),
                duration: this.annuityCalculator.getCreditLength(),
                totalGrant: this.annuityCalculator.getTotalGrant(),
                totalInterestPaid:this.annuityCalculator.getTotalInterestPaid(),
                totalPayment: this.annuityCalculator.getTotalPayment(),
                principal: this.annuityCalculator.getAmountBorrowed()
            },
            rate: {
                firstRate: this.rateCalculator.amountToPayForMonth(0),
                lastRate: this.rateCalculator.amountToPayForMonth(this.rateCalculator.getCreditLength()),
                duration: this.rateCalculator.getCreditLength(),
                totalGrant: this.rateCalculator.getTotalGrant(),
                totalInterestPaid:this.rateCalculator.getTotalInterestPaid(),
                totalPayment: this.rateCalculator.getTotalPayment(),
                principal: this.rateCalculator.getAmountBorrowed()
            },
            cashPaymentAmount: earlyRepayment.amount
        } as RepaymentSummary);
    }

    addEarlyRepayment = () => {
        this.earlyRepayments.push({year: 7, amount: 25000, newLoanDuration: 23, newInterestRate: 2.09} as EarlyRepayment);
    }

    removeEarlyRepayment = (index: number) => {
        this.earlyRepayments.splice(index,1);
    }

    calculateEarlyRepayments = () => {
        if(this.validateParameters()){
            this.updateProjections();
        }
        else {
            alert("RIP")
        }
    }

    validateParameters = (): boolean => {
        let principalValid = this.amountBorrowed > 0;
        let creditLengthValid = this.creditLength < 31 && this.creditLength > 0;
        let interestRateValid =  this.interestRate > 0;
        let grantDurationValid = this.grantDuration > 0;
        let grantPercentageValid = this.grantPercentage > 29 && this.grantPercentage < 101;
        let grantValid = this.hasGrant ? grantDurationValid && grantPercentageValid : true;

        let earlyRepaymentsValid = true;
        if(this.earlyRepayments.length > 0) {
            for(let i = 1; i < this.earlyRepayments.length; i++){
                if(this.earlyRepayments[i].year <= this.earlyRepayments[i-1].year){
                    earlyRepaymentsValid = false;
                    break;
                }
            }
        }

        return principalValid && creditLengthValid && interestRateValid && grantValid && earlyRepaymentsValid;
    }
}