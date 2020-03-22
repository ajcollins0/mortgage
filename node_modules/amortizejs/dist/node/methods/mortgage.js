"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MortgageAmortization = /** @class */ (function () {
    /**
     * Creates a new Mortgage Amortization
     * @param {number} balance
     * @param {number} periodicInterest
     * @param {number} periods
     */
    function MortgageAmortization(balance, periodicInterest, periods, startDate) {
        this.balance = balance;
        this.periodicInterest = periodicInterest;
        this.periods = periods;
        this.startDate = startDate;
        this.periodicPayment = this.calculatePeriodicPaymentAmount();
        this.schedule = this.calculateSchedule();
        this.totalPayment = this.calculateTotalPayment();
        this.totalInterest = this.calculateTotalInterest();
    }
    /**
     * Calculates the periodic payment amount
     * @return {number}                  The total payment that needs to be made per period.
     */
    MortgageAmortization.prototype.calculatePeriodicPaymentAmount = function () {
        return this.balance * (this.periodicInterest + (this.periodicInterest / (Math.pow((1 + this.periodicInterest), this.periods) - 1)));
    };
    /**
     * Calculates the total payment amount over the term
     * @return {number}
     */
    MortgageAmortization.prototype.calculateTotalPayment = function () {
        return this.periods * this.periodicPayment;
    };
    /**
     * Calculates the total interest over the term
     * @return {number}
     */
    MortgageAmortization.prototype.calculateTotalInterest = function () {
        return this.totalPayment - this.balance;
    };
    /**
     * Calculates Payment interest, principal, and remaining balance.
     * @param  {number}  balance           The remaining loan amount
     * @return {Payment}
     */
    MortgageAmortization.prototype.calculatePayment = function (balance) {
        var result = { interest: undefined, principal: undefined, remainingBalance: undefined };
        result.interest = balance * this.periodicInterest;
        result.principal = this.periodicPayment - result.interest;
        if (balance < this.periodicPayment) {
            //If balance is less then periodicPayment we manually set 
            //remaining balance to 0 to minize rounding errors that could
            //cause the remaining balance to be slightly larger than 0.00
            result.remainingBalance = 0;
        }
        else {
            //Otherwise calculate remaining balance as normal.
            result.remainingBalance = balance - result.principal;
        }
        return result;
    };
    /**
     * Calculates the Amortization Schedule
     * If startDate was defined then it also calculates payment dates and date of payoff.
     * @return {Payment[]}
     */
    MortgageAmortization.prototype.calculateSchedule = function () {
        var balance = this.balance;
        var result = [];
        //If startDate was defined we will attach dates to the payments and calculate endDate
        if (this.startDate) {
            this.endDate = new Date(this.startDate.toString());
        }
        //Calculate each payment until balance is paid off.
        while (balance > 0) {
            var payment = this.calculatePayment(balance);
            balance = payment.remainingBalance;
            if (this.endDate) {
                payment.date = new Date(this.endDate.toString());
                this.endDate.setMonth(this.endDate.getMonth() + 1);
            }
            result.push(payment);
        }
        return result;
    };
    return MortgageAmortization;
}());
exports.MortgageAmortization = MortgageAmortization;
