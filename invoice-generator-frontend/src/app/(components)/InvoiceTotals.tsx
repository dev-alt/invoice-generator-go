"use client";

import React, { memo } from 'react';
import { InvoiceTotalsProps } from '@/(lib)/types';
import { Input } from '@/(components)/ui/input';
import { Label } from '@/(components)/ui/label';
import { Separator } from '@/(components)/ui/separator';
import { Calculator, Percent } from 'lucide-react';

const InvoiceTotals = memo(({
                                register,
                                subtotal,
                                taxAmount,
                                totalAmount,
                                taxRate,
                                currencyCode,
                                formatCurrency
                            }: InvoiceTotalsProps) => {
    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                    <Calculator className="h-5 w-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Invoice Totals</h3>
                </div>

                <div className="space-y-4">
                    {/* Tax Rate Input */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                            <Percent className="h-3.5 w-3.5" />
                            Tax Rate (%)
                        </Label>
                        <Input
                            type="number"
                            step="0.01"
                            {...register('tax_rate', { valueAsNumber: true, min: 0 })}
                            className="w-full sm:w-32 font-mono"
                            placeholder="0.00"
                        />
                    </div>

                    <Separator className="my-4" />

                    {/* Calculations */}
                    <div className="space-y-3 bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm sm:text-base">Subtotal</span>
                            <span className="font-semibold text-slate-900 font-mono text-sm sm:text-base">
                                {formatCurrency(subtotal, currencyCode)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">
                                Tax ({taxRate || 0}%)
                            </span>
                            <span className="font-medium text-slate-700 font-mono text-sm">
                                {formatCurrency(taxAmount, currencyCode)}
                            </span>
                        </div>
                        <Separator />
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 sm:py-4 rounded-lg -mx-4">
                            <div className="flex justify-between items-center">
                                <span className="text-base sm:text-lg font-bold">Total Amount</span>
                                <span className="text-xl sm:text-2xl font-bold font-mono">
                                    {formatCurrency(totalAmount, currencyCode)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

InvoiceTotals.displayName = 'InvoiceTotals';

export default InvoiceTotals;
