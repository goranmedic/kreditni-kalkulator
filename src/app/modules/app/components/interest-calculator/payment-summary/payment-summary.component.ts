import { Component, OnInit, Input } from '@angular/core';
import { RepaymentSummary } from 'src/app/shared/models/RepaymentSummary';
import { PaymentCalculatorType } from 'src/app/shared/enums/PaymentCalculatorType';

@Component({
    selector: 'payment-summary',
    templateUrl: 'payment-summary.component.html'
})

export class PaymentSummaryComponent implements OnInit {

    @Input() paymentSummary: RepaymentSummary;
    public calcType: PaymentCalculatorType = PaymentCalculatorType.Rate;

    get PaymentCalculatorType() { return PaymentCalculatorType; }
    
    constructor() { }

    ngOnInit() { }

    switchToCalcType(switchTo: PaymentCalculatorType) {
        this.calcType = switchTo;
    }
}