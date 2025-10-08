import React from 'react';
import { Card, CardContent } from '@/(components)/ui/card';
import { Invoice } from '@/(lib)/types';
import { Separator } from '@/(components)/ui/separator';

const InvoicePreview = ({ invoice }: { invoice: Partial<Invoice> }) => {
    return (
        <div className="h-full w-full">
            <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="text-lg font-semibold">Invoice Preview</div>

                        {/* Header Section */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">
                                Invoice # {invoice.invoice_number || '-----'}
                            </h2>
                            <div className="text-gray-600 text-sm">
                                <div>Date: {invoice.invoice_date || 'Not set'}</div>
                                <div>Due: {invoice.due_date || 'Not set'}</div>
                            </div>
                        </div>

                        <Separator />

                        {/* Customer Section */}
                        <div className="space-y-2">
                            <div className="font-semibold">Bill To:</div>
                            <div>{invoice.customer_name || 'Customer Name'}</div>
                            <div className="text-gray-600">{invoice.customer_email || 'customer@email.com'}</div>
                            <div className="text-gray-600 whitespace-pre-line">
                                {invoice.customer_address || 'Customer Address'}
                            </div>
                        </div>

                        <Separator />

                        {/* Invoice Items Section */}
                        <div>
                            <div className="font-semibold mb-3">Items:</div>
                            <table className="w-full">
                                <thead>
                                <tr className="text-sm text-gray-600">
                                    <th className="text-left pb-2">Description</th>
                                    <th className="text-right pb-2">Quantity</th>
                                    <th className="text-right pb-2">Unit Price</th>
                                    <th className="text-right pb-2">Total</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y">
                                {(invoice.items || []).map((item, index) => (
                                    <tr key={index} className="text-sm">
                                        <td className="py-2">{item.description || '-'}</td>
                                        <td className="text-right py-2">{item.quantity || 1}</td>
                                        <td className="text-right py-2">
                                            {invoice.currency || '$'}
                                            {(item.unit_price || 0).toFixed(2)}
                                        </td>
                                        <td className="text-right py-2">
                                            {invoice.currency || '$'}
                                            {(item.total_price || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {(!invoice.items || invoice.items.length === 0) && (
                                    <tr className="text-sm text-gray-500">
                                        <td className="py-2">-</td>
                                        <td className="text-right py-2">1</td>
                                        <td className="text-right py-2">$0.00</td>
                                        <td className="text-right py-2">$0.00</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t pt-4">
                            {/* Amounts Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">
                                        {invoice.currency || '$'}{' '}
                                        {(invoice.subtotal || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax ({invoice.tax_rate || 0}%):</span>
                                    <span>
                                        {invoice.currency || '$'}{' '}
                                        {(invoice.tax_amount || 0).toFixed(2)}
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-base font-semibold">
                                    <span>Total:</span>
                                    <span>
                                        {invoice.currency || '$'}{' '}
                                        {(invoice.total_amount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        {invoice.notes && (
                            <>
                                <Separator />
                                <div>
                                    <div className="font-semibold mb-2">Notes:</div>
                                    <div className="text-sm text-gray-600 whitespace-pre-line">
                                        {invoice.notes}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoicePreview;
