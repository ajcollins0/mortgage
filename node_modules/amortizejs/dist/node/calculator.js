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
