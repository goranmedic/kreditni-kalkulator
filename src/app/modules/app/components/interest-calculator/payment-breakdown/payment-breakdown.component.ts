import { Component, OnInit } from '@angular/core';
import { AnnuityPaymentCalculator } from 'src/app/shared/calculations/annuity-payment-calculator';
import { RatePaymentCalculator } from 'src/app/shared/calculations/rate-payment-calculator';

@Component({
    selector: 'payment-breakdown',
    templateUrl: 'payment-breakdown.component.html',
    styleUrls:['./payment-breakdown.component.css']
})

export class PaymentBreakdownComponent implements OnInit {

    private _amountBorrowed: number;
    private _creditLength: number;
    private _interestRate: number;
    private _grantPercentage: number;
    private _grantDuration: number;
    private _propertySize: number;
    private _annuityCalculator: AnnuityPaymentCalculator;
    private _rateCalculator: RatePaymentCalculator;

    public set amountBorrowed(value: number) {
        this._amountBorrowed = value;
        this.updateCalculators();
    }
    public set creditLength(value: number) {
        this._creditLength = value;
        this.months = [...Array(value*12).keys()].map(x => ++x);
        this.updateCalculators();
    }
    public set interestRate(value: number) {
        this._interestRate = value;
        this.updateCalculators();
    }
    public set grantPercentage(value: number) {
        this._grantPercentage = value;
        this.updateCalculators();
    }
    public set grantDuration(value: number) {
        this._grantDuration = value;
        this.updateCalculators();
    }
    public set annuityCalculator(value: AnnuityPaymentCalculator){
        this._annuityCalculator = value;
    }
    public set rateCalculator(value: RatePaymentCalculator){
        this._rateCalculator = value;
    }
    public set propertySize(value: number) {
        this._propertySize = value;
    }

    public get amountBorrowed() {return this._amountBorrowed};
    public get creditLength() {return this._creditLength};
    public get interestRate() {return this._interestRate};
    public get grantPercentage() {return this._grantPercentage};
    public get grantDuration() {return this._grantDuration};
    public get propertySize() {return this._propertySize};
    public get annuityCalculator() {return this._annuityCalculator};
    public get rateCalculator() {return this._rateCalculator};

    public months: Array<number>;

    constructor() { }

    ngOnInit() {
        this.amountBorrowed = 220000;
        this.creditLength = 30;
        this.interestRate = 2.09;
        this.grantDuration = 5;
        this.grantPercentage = 30;
        this.propertySize = 60;
        this.annuityCalculator = new AnnuityPaymentCalculator(this.interestRate, this.creditLength, this.amountBorrowed, this.grantPercentage, this.grantDuration, this.propertySize);
        this.rateCalculator = new RatePaymentCalculator(this.interestRate, this.creditLength, this.amountBorrowed, this.grantPercentage, this.grantDuration, this.propertySize);
    }

    updateCalculators(){
        this.annuityCalculator = new AnnuityPaymentCalculator(this.interestRate, this.creditLength, this.amountBorrowed, this.grantPercentage, this.grantDuration, this.propertySize);
        this.rateCalculator = new RatePaymentCalculator(this.interestRate, this.creditLength, this.amountBorrowed, this.grantPercentage, this.grantDuration, this.propertySize);
    }
}