# AmortizeJS

[![Website][web-img]][web-url]
[![Version][version-img]][npm-url]
[![npm][npm-img]][npm-url]
[![license][license-img]]()

Loan calculation and amortization schedule utility with support for custom amortization methods, available for node and browser.

```js
AmortizeJS.calculate({
    method:   'mortgage', 
    apr:      3.5, 
    balance:  280350, 
    loanTerm: 60,
    startDate: new Date('December 24 2017')
});
```

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Quickstart](#quickstart)
4. [API Docs](#api-docs)
   - [AmortizeJS](#amortizejs-1)
   - [CalculatorConfig](#calculatorconfig)
   - [AmortizationMethod](#amortizationmethod)
   - [Payment](#payment)
5. [Formatting of results in examples](#formatting-of-results-in-examples)
6. [Contributing](#contributing)


## Features
* Periodic payment calculation
* Total interest calculation
* Total payment calculation
* Calculate a payment's interest amount, principal amount and remaining balance
* Amortization schedule creation with optional payment date support
* Easily customize and create new amortization methods

### Supported amortization methods
* Mortgage-Style/Constant-Payment method

## Installation

Using Bower:
```html
$ bower install amortizejs

<script src="./bower_components/AmortizeJS/dist/web/bundle.js"></script>
```

Using npm:
```bash
$ npm install amortizejs
```

## Usage

In Browser: `AmortizeJS` class is available on the window object.

In Node.js
```js
var AmortizeJS = require('amortizejs').Calculator;
```

## Quickstart
To calculate a mortgage amortization schedule including payment dates:

```js
var mortgage = AmortizeJS.calculate({
    method:   'mortgage',
    apr:      3.5, 
    balance:  280350,    
    loanTerm: 60,         
    startDate: new Date('December 24 2017')
});

console.log( mortgage.periodicPayment );    // 5100.06
console.log( mortgage.periodicInterest );   // 0.00292
console.log( mortgage.totalInterest );      // 25653.34
console.log( mortgage.totalPayment );       // 306003.34
console.log( mortgage.endDate );            // Sat Dec 24 2022 00:00:00 GMT-0500 (EST)
console.log( mortgage.schedule );           // [{"interest": 817.69, "principal": 4282.37, "remainingBalance": 276067.63, "date":"2017-12-24T05:00:00.000Z"} ...]

```

To retrieve list of available amortization methods:

```js
AmortizeJS.availableMethods(); // ['mortgage']
```

## API Docs

### AmortizeJS
| Command | Params | Return | Description |
| --- | --- | --- | --- |
| `calculate(config)` | [calculatorConfig](#calculatorconfig) | [AmortizationMethod](#amortizationmethod) | Calculates amortization details and schedule. |
| `availableMethods()` | none | string[] | Returns the amortization methods that are available. |

### CalculatorConfig
An object conforming to the CalculatorConfig Interface is required when calling `AmortizeJS.calculate(config)`, the following options are available:

| Attribute | Type | Description |
| --- | --- | --- |
|   method     | string \| function | A string identifying the amortization method to use, or a custom amortization function.
|   balance    | number | The loan amount.
|   loanTerm   | number | Loan term in month.
|   apr        | number | The Anual Percentage Rate (ex: 3.5%)
|   startDate | Date (Optional)  | Optional start date, will cause monthly payments to have dates attached to them.


### AmortizationMethod
An object conforming to the AmortizationMethod Interface is returned when calling `AmortizeJS.calculate(config)`, the following attributes are available on it:

| Attribute | Type | Description |
| --- | --- | --- |
| balance           |  number   | The loan amount. |
| periods           |  number   | The total number of periods. |
| periodicInterest  |  number   | The interest payed per period, if the period is month then the APR will be divided by 12 (ex: APR = 3.5%, i = 0.035/12). |
| periodicPayment   |  number   | The total payment that needs to be made per period. |
| schedule          |  [Payment[]](#payment) | Array of payments required to pay off the balance. |
| totalPayment      |  number   | The total amount of all payments over the term. |
| totalInterest     |  number   | The total amount of interest spend over the term. |
| startDate        |  Date (Optional)     | The start date of the loan. |
| endDate          |  Date (Optional)     | The pay off date (Will only be calculated if startDate was given). |


### Payment
A payment for the loan, will include the following:

| Attribute | Type | Description |
| --- | --- | --- |
|    interest         | number | Portion of the payment that goes to interest.
|    principal        | number | Portion of the payment that goes to principal.
|    remainingBalance | number | Remaining balance after this payment.
|    date             | Date  | The date of the payment.



## Formatting of results in examples
Results are not truncated or formatted in any way, the results in the examples are truncated for clarity. 


## Contributing
It is easy to extend AmortizeJS with custom amortization methods, all you need to do is create a javascript class or function that can be initiated via the `new` operator. This constructor will be supplied the following arguments in order: 

| Argument | Type | Description |
| --- | --- | --- |
|    balance          | number | The loan amount.
|    periodicInterest | number | The interest payed per period.
|    periods          | number | The total number of periods.
|    startDate        | Date (Optional)   | The start date of the loan.

The constructor should return an object that conforms to the [AmortizationMethod](#amortizationmethod) interface.

### Using a custom method

```js
function customFunction(balance, periodicInterest, loanTerm, startDate){
    //Your custom amortization algorithm here
    return arguments;
}

var mortgage = Calculator.calculate({
    method:   customFunction,
    apr:      3.5, 
    balance:  280350, 
    loanTerm: 60,
    startDate: new Date('December 24 2017')
});

console.log(mortgage); //{"0": 280350, "1": 0.00292, "2": 60, "3": "2017-12-24T05:00:00.000Z"}
```

### Using a custom class

```js
class CustomMethod{
    constructor(balance, periodicInterest, loanTerm, startDate){
        //Your custom amortization algorithm here
        return arguments;
    }
}

var mortgage = Calculator.calculate({
    method:   CustomMethod,
    apr:      3.5, 
    balance:  280350, 
    loanTerm: 60,
    startDate: new Date('December 24 2017')
});

console.log(mortgage); //{"0": 280350, "1": 0.00292, "2": 60, "3": "2017-12-24T05:00:00.000Z"}
```

[npm-url]: https://www.npmjs.com/package/amortizejs
[npm-img]: https://img.shields.io/npm/dt/amortizejs.svg
[web-img]: https://img.shields.io/website-up-down-green-red/http/amortize.me.svg?label=amortize.me
[web-url]: http://amortize.me
[version-img]: https://img.shields.io/npm/v/amortizejs.svg
[bower-img]: https://img.shields.io/bower/v/amortizejs.svg
[license-img]: https://img.shields.io/github/license/davidbooth/amortizejs.svg
