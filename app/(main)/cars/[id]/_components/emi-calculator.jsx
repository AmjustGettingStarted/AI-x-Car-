"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

function EmiCalculator({ price = 1000 }) {
  const [loanAmount, setLoanAmount] = useState(price);
  const [downPayment, setDownPayment] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(0);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTenure, setLoanTenure] = useState(1);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleLoanAmountChange = (value) => {
    const newLoanAmount = Math.min(Math.max(value, 1000), 150000);
    setLoanAmount(newLoanAmount);
    const newDownPayment = (downPaymentPercent / 100) * newLoanAmount;
    setDownPayment(newDownPayment);
    calculateLoan(newLoanAmount, newDownPayment, interestRate, loanTenure);
  };

  const handleDownPaymentChange = (value) => {
    const newDownPayment = Math.min(Math.max(value, 0), loanAmount);
    setDownPayment(newDownPayment);
    setDownPaymentPercent((newDownPayment / loanAmount) * 100);
    calculateLoan(loanAmount, newDownPayment, interestRate, loanTenure);
  };

  const handleDownPaymentPercentChange = (percent) => {
    const newPercent = Math.min(Math.max(percent, 0), 100);
    setDownPaymentPercent(newPercent);
    const newDownPayment = (newPercent / 100) * loanAmount;
    setDownPayment(newDownPayment);
    calculateLoan(loanAmount, newDownPayment, interestRate, loanTenure);
  };

  const handleInterestRateChange = (value) => {
    const newRate = Math.min(Math.max(value, 0.1), 25);
    setInterestRate(newRate);
    calculateLoan(loanAmount, downPayment, newRate, loanTenure);
  };

  const handleLoanTenureChange = (value) => {
    const newTenure = Math.min(Math.max(value, 1), 8);
    setLoanTenure(newTenure);
    calculateLoan(loanAmount, downPayment, interestRate, newTenure);
  };

  const calculateLoan = (principal, down, rate, years) => {
    const loanPrincipal = principal - down;
    if (loanPrincipal <= 0) {
      setResults(null);
      return;
    }

    const monthlyRate = rate / 100 / 12;
    const months = years * 12;

    const emi =
      (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanPrincipal;

    setResults({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      loanPrincipal: loanPrincipal.toFixed(2),
      downPayment: down.toFixed(2),
    });
  };

  useEffect(() => {
    calculateLoan(loanAmount, downPayment, interestRate, loanTenure);
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const field = "border-white/10 bg-[#111113] text-white";

  return (
    <div className="space-y-4 text-white">
      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#111113] p-4">
        <Label htmlFor="emi-price">Vehicle Price</Label>
        <Input
          id="emi-price"
          type="number"
          value={loanAmount}
          onChange={(e) => handleLoanAmountChange(parseFloat(e.target.value))}
          className={field}
        />
        <Slider
          min={1000}
          max={150000}
          step={100}
          value={[loanAmount]}
          onValueChange={([value]) => handleLoanAmountChange(value)}
        />
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#111113] p-4">
        <Label htmlFor="emi-down">Down Payment</Label>
        <Input
          id="emi-down"
          type="number"
          value={downPayment}
          onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value))}
          className={field}
        />
        <Slider
          min={0}
          max={loanAmount || 0}
          step={100}
          value={[Math.min(downPayment, loanAmount || 0)]}
          onValueChange={([value]) => handleDownPaymentChange(value)}
        />
        <p className="text-sm text-white/50">
          Down payment: {downPaymentPercent.toFixed(1)}% of vehicle price
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#111113] p-4">
          <Label htmlFor="emi-rate">Interest Rate</Label>
          <Input
            id="emi-rate"
            type="number"
            value={interestRate}
            onChange={(e) => handleInterestRateChange(parseFloat(e.target.value))}
            className={field}
          />
          <Slider
            min={0.1}
            max={25}
            step={0.1}
            value={[interestRate]}
            onValueChange={([value]) => handleInterestRateChange(value)}
          />
        </div>
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#111113] p-4">
          <Label htmlFor="emi-term">Loan Term (years)</Label>
          <Input
            id="emi-term"
            type="number"
            value={loanTenure}
            onChange={(e) => handleLoanTenureChange(parseFloat(e.target.value))}
            className={field}
          />
          <Slider
            min={1}
            max={8}
            step={1}
            value={[loanTenure]}
            onValueChange={([value]) => handleLoanTenureChange(value)}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {results ? (
        <div className="rounded-2xl border border-white/10 bg-[#111113] p-4">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/50">
            Monthly Payment
          </p>
          <p className="mt-1 text-center font-[family-name:var(--font-clash)] text-4xl font-semibold text-[#1a5cff]">
            ${formatNumber(results.emi)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Vehicle Price", loanAmount],
              ["Down Payment", results.downPayment],
              ["Loan Amount", results.loanPrincipal],
              ["Total Interest", results.totalInterest],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-[#0b0b0c] p-3">
                <p className="text-white/50">{label}</p>
                <p className="mt-1 font-semibold">${formatNumber(value)}</p>
              </div>
            ))}
            <div className="col-span-2 rounded-xl border border-white/10 bg-[#0b0b0c] p-3">
              <p className="text-white/50">Total amount</p>
              <p className="mt-1 font-semibold">
                $
                {formatNumber(
                  parseFloat(results.downPayment) + parseFloat(results.totalPayment)
                )}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <p className="text-center text-sm text-white/50">
        This is an estimate. Actual EMI may vary based on your credit score and
        lender terms.
      </p>
    </div>
  );
}

export default EmiCalculator;
