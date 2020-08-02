import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RepaymentSummary } from 'src/app/shared/models/RepaymentSummary';
import { PaymentCalculatorType } from 'src/app/shared/enums/PaymentCalculatorType';
import { LoanSummaryTableRow } from 'src/app/shared/models/LoanSummaryTableRow';

@Component({
    selector: 'loan-summary',
    templateUrl: 'loan-summary.component.html',
    styleUrls:['./loan-summary.component.css']
})

export class LoanSummaryComponent implements OnInit, OnChanges {
    @Input() paymentSummary: RepaymentSummary;
    @Input() paymentSummaryWithRefinancing: Array<RepaymentSummary>;

    annuitySummaryTableData: Array<LoanSummaryTableRow> = [];
    rateSummaryTableData: Array<LoanSummaryTableRow> = [];
    summaryDisplayedColumns: Array<string> = ['duration', 'cashPaymentAmount', 'totalInterestPaid', 'totalGrant', 'totalPayment'];

    annuityMultiplePaymentDetailsTableData: any;
    rateMultiplePaymentDetailsTableData: any;

    annuitySinglePaymentDetailsTableData: any;
    rateSinglePaymentDetailsTableData: any;

    annuitySinglePaymentTotalPaymentRowClass: string = "";
    annuityMultiplepaymentsTotalPaymentRowClass: string = "";
    annuitySinglePaymentTotalInterestPaymentRowClass: string ="";
    annuityMultiplepaymentsTotalInterestPaymentRowClass: string ="";
    rateSinglePaymentTotalPaymentRowClass: string = "";
    rateMultiplepaymentsTotalPaymentRowClass: string = "";
    rateSinglePaymentTotalInterestPaymentRowClass: string ="";
    rateMultiplepaymentsTotalInterestPaymentRowClass: string ="";

    annuityDisplayedColumns: Array<string> = ['duration', 'principal', 'annuity', 'totalInterestPaid', 'totalGrant', 'totalPayment'];
    rateDisplayedColumns: Array<string> = ['duration', 'principal', 'firstRate', 'lastRate', 'totalInterestPaid', 'totalGrant', 'totalPayment'];

    calcType: PaymentCalculatorType = PaymentCalculatorType.Rate;


    get PaymentCalculatorType() { return PaymentCalculatorType; }
    constructor() { }

    updateTableCssClasses = () => {
        if(this.annuitySummaryTableData.length > 1 && this.rateSummaryTableData.length > 1) {
            this.annuitySinglePaymentTotalPaymentRowClass = this.annuitySummaryTableData[0].totalPayment > this.annuitySummaryTableData[1].totalPayment ? 'mod-color-red-9' : 'mod-color-green-9';
            this.annuityMultiplepaymentsTotalPaymentRowClass = this.annuitySummaryTableData[0].totalPayment < this.annuitySummaryTableData[1].totalPayment ? 'mod-color-red-9' : 'mod-color-green-9';
            this.annuitySinglePaymentTotalInterestPaymentRowClass = this.annuitySummaryTableData[0].totalInterestPaid > this.annuitySummaryTableData[1].totalInterestPaid ? 'mod-color-red-9' : 'mod-color-green-9';
            this.annuityMultiplepaymentsTotalInterestPaymentRowClass = this.annuitySummaryTableData[0].totalInterestPaid < this.annuitySummaryTableData[1].totalInterestPaid ? 'mod-color-red-9' : 'mod-color-green-9';
            this.rateSinglePaymentTotalPaymentRowClass = this.rateSummaryTableData[0].totalPayment > this.rateSummaryTableData[1].totalPayment ? 'mod-color-red-9' : 'mod-color-green-9';
            this.rateMultiplepaymentsTotalPaymentRowClass = this.rateSummaryTableData[0].totalPayment < this.rateSummaryTableData[1].totalPayment ? 'mod-color-red-9' : 'mod-color-green-9';
            this.rateSinglePaymentTotalInterestPaymentRowClass = this.rateSummaryTableData[0].totalInterestPaid > this.rateSummaryTableData[1].totalInterestPaid ? 'mod-color-red-9' : 'mod-color-green-9';
            this.rateMultiplepaymentsTotalInterestPaymentRowClass = this.rateSummaryTableData[0].totalInterestPaid < this.rateSummaryTableData[1].totalInterestPaid ? 'mod-color-red-9' : 'mod-color-green-9';
        }
    }

    constructAnnuitySummaryTableValues = () => {
        this.annuitySummaryTableData = [];
        const singlePayment: LoanSummaryTableRow = {
            duration: this.paymentSummary.annuity.duration,
            totalInterestPaid: this.paymentSummary.annuity.totalInterestPaid,
            totalGrant: this.paymentSummary.annuity.totalGrant,
            totalPayment: this.paymentSummary.annuity.totalPayment,
            cashPaymentAmount: 0
        }
        this.annuitySummaryTableData.push(singlePayment)

        if(this.paymentSummaryWithRefinancing.length > 1) {
            let duration = 0;
            let totalInterestPaid = 0;
            let totalPayment = 0;
            let cashPaymentAmount = 0;
            let totalGrant = 0;
            
            for(let i = 0; i < this.paymentSummaryWithRefinancing.length; i++) {
                
                duration += this.paymentSummaryWithRefinancing[i].annuity.duration;
                totalGrant += this.paymentSummaryWithRefinancing[i].annuity.totalGrant;
                totalInterestPaid += this.paymentSummaryWithRefinancing[i].annuity.totalInterestPaid;
                totalPayment = totalPayment + this.paymentSummaryWithRefinancing[i].annuity.totalPayment + this.paymentSummaryWithRefinancing[i].cashPaymentAmount;
                cashPaymentAmount += this.paymentSummaryWithRefinancing[i].cashPaymentAmount;
            }
    
            const multiplePayments: LoanSummaryTableRow = {
                duration,
                totalInterestPaid,
                totalPayment,
                totalGrant,
                cashPaymentAmount
            }
            this.annuitySummaryTableData.push(multiplePayments)
        }
    };

    constructRateSummaryTableValues = () => {
        this.rateSummaryTableData = [];

        const singlePayment: LoanSummaryTableRow = {
            duration: this.paymentSummary.rate.duration,
            totalInterestPaid: this.paymentSummary.rate.totalInterestPaid,
            totalGrant: this.paymentSummary.rate.totalGrant,
            totalPayment: this.paymentSummary.rate.totalPayment,
            cashPaymentAmount: 0
        }

        this.rateSummaryTableData.push(singlePayment)

        if(this.paymentSummaryWithRefinancing.length > 1) {
            let duration = 0;
            let totalInterestPaid = 0;
            let totalPayment = 0;
            let cashPaymentAmount = 0;
            let totalGrant = 0;
    
            for(let i = 0; i < this.paymentSummaryWithRefinancing.length; i++) {
                duration += this.paymentSummaryWithRefinancing[i].rate.duration;
                totalInterestPaid += this.paymentSummaryWithRefinancing[i].rate.totalInterestPaid;
                totalGrant += this.paymentSummaryWithRefinancing[i].rate.totalGrant;
                totalPayment = totalPayment + this.paymentSummaryWithRefinancing[i].rate.totalPayment + this.paymentSummaryWithRefinancing[i].cashPaymentAmount;
                cashPaymentAmount += this.paymentSummaryWithRefinancing[i].cashPaymentAmount;
            }
    
            const multiplePayments: LoanSummaryTableRow = {
                duration,
                totalInterestPaid,
                totalPayment,
                totalGrant,
                cashPaymentAmount
            }
    
            this.rateSummaryTableData.push(multiplePayments)
        }
    }

    constructMultiplePaymentAnnuityDetailsTableValues = () => {
        this.annuityMultiplePaymentDetailsTableData = [];
        for(let i = 0; i < this.paymentSummaryWithRefinancing.length; i++) {
            this.annuityMultiplePaymentDetailsTableData.push({
                principal: this.paymentSummaryWithRefinancing[i].annuity.principal,
                annuity: this.paymentSummaryWithRefinancing[i].annuity.annuity,
                duration: this.paymentSummaryWithRefinancing[i].annuity.duration,
                totalGrant: this.paymentSummaryWithRefinancing[i].annuity.totalGrant,
                totalInterestPaid: this.paymentSummaryWithRefinancing[i].annuity.totalInterestPaid,
                totalPayment: this.paymentSummaryWithRefinancing[i].annuity.totalPayment
            })
        }
    }
    constructMultiplePaymentRateDetailsTableValues = () => {
        this.rateMultiplePaymentDetailsTableData = [];
        for(let i = 0; i < this.paymentSummaryWithRefinancing.length; i++) {
            this.rateMultiplePaymentDetailsTableData.push({
                principal: this.paymentSummaryWithRefinancing[i].rate.principal,
                firstRate: this.paymentSummaryWithRefinancing[i].rate.firstRate,
                lastRate: this.paymentSummaryWithRefinancing[i].rate.lastRate,
                duration: this.paymentSummaryWithRefinancing[i].rate.duration,
                totalGrant: this.paymentSummaryWithRefinancing[i].rate.totalGrant,
                totalInterestPaid: this.paymentSummaryWithRefinancing[i].rate.totalInterestPaid,
                totalPayment: this.paymentSummaryWithRefinancing[i].rate.totalPayment
            })
        }
    }

    constructSinglePaymentAnnuityDetailsTableValues = () => {
        this.annuitySinglePaymentDetailsTableData = [];
        this.annuitySinglePaymentDetailsTableData.push({
            principal: this.paymentSummary.annuity.principal,
            annuity: this.paymentSummary.annuity.annuity,
            duration: this.paymentSummary.annuity.duration,
            totalGrant: this.paymentSummary.annuity.totalGrant,
            totalInterestPaid: this.paymentSummary.annuity.totalInterestPaid,
            totalPayment: this.paymentSummary.annuity.totalPayment
        })
    }
    constructSinglePaymentRateDetailsTableValues = () => {
        this.rateSinglePaymentDetailsTableData = [];
        this.rateSinglePaymentDetailsTableData.push({
            principal: this.paymentSummary.rate.principal,
            firstRate: this.paymentSummary.rate.firstRate,
            lastRate: this.paymentSummary.rate.lastRate,
            duration: this.paymentSummary.rate.duration,
            totalGrant: this.paymentSummary.rate.totalGrant,
            totalInterestPaid: this.paymentSummary.rate.totalInterestPaid,
            totalPayment: this.paymentSummary.rate.totalPayment
        })
    }

    updateValues = () => {
        this.constructAnnuitySummaryTableValues();
        this.constructRateSummaryTableValues();
        this.constructMultiplePaymentAnnuityDetailsTableValues();
        this.constructMultiplePaymentRateDetailsTableValues();
        this.constructSinglePaymentAnnuityDetailsTableValues();
        this.constructSinglePaymentRateDetailsTableValues();
        this.updateTableCssClasses();
    }

    ngOnInit() { 
        this.updateValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateValues();
    }
}