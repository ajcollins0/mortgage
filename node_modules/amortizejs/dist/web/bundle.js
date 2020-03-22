(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mortgage_1 = require("./methods/mortgage");
var Calculator = /** @class */ (function () {
    function Calculator() {
    }
    /**
     * Calculates an amortization schedule.
     * @param {calculatorConfig} config
     */
    Calculator.calculate = function (config) {
        var method = undefined;
        //Pick from integrated amortization methods.
        if (typeof config.method === 'string') {
            switch (config.method) {
                case 'mortgage':
                default:
                    method = mortgage_1.MortgageAmortization;
                    break;
            }
        }
        else if (typeof config.method === 'function') {
            method = config.method;
        }
        //Turn APR into periodic interest
        var periodicInterest = (config.apr / 100) / 12;
        //Return the amortization
        return new method(config.balance, periodicInterest, config.loanTerm, config.startDate);
    };
    /**
     * Returns the amortization methods that are available.
     * @return {string[]} List of amortization methods.
     */
    Calculator.availableMethods = function () {
        return [
            'mortgage'
        ];
    };
    return Calculator;
}());
exports.Calculator = Calculator;
//If module is used in browser we attach it to the window.
if (typeof window !== 'undefined') {
    window.AmortizeJS = Calculator;
}

},{"./methods/mortgage":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
