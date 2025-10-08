"use client";

import React, { memo } from 'react';
import { InvoiceTotalsProps } from '@/(lib)/types';
import { Card } from '@/(components)/ui/card';
import { Input } from '@/(components)/ui/input';
import { Label } from '@/(components)/ui/label';
import { Separator } from '@/(components)/ui/separator';
import { Calculator } from 'lucide-react';

const InvoiceTotals = memo(({
                                register,
                                subtotal,
                                taxAmount,
                                totalAmount,
                                currencyCode,
                                formatCurrency
                            }: InvoiceTotalsProps) => {
    return (
        <div className="space-y-6">
            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calculator className="h-4 w-4" />
                    <h3 className="font-medium">Invoice Totals</h3>
                </div>

                <div className="space-y-4">
                    {/* Tax Rate */}
                    <div>
                        <Label>Tax Rate (%)</Label>
                        <Input
                            type="number"
                            {...register('tax_rate', { valueAsNumber: true, min: 0 })}
                            className="w-32"
                        />
                    </div>

                    <Separator />

                    {/* Calculations */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                                {formatCurrency(subtotal, currencyCode)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax Amount</span>
                            <span className="font-medium">
                                {formatCurrency(taxAmount, currencyCode)}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(totalAmount, currencyCode)}</span>
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    );
});

InvoiceTotals.displayName = 'InvoiceTotals';

export default InvoiceTotals;
