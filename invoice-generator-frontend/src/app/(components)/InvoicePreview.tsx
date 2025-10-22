import React from 'react';
import { Card, CardContent } from '@/(components)/ui/card';
import { Invoice } from '@/(lib)/types';
import { Separator } from '@/(components)/ui/separator';
import { Calendar, Mail, MapPin, FileText, Building2 } from 'lucide-react';

const InvoicePreview = ({ invoice }: { invoice: Partial<Invoice> }) => {
    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'Not set';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return 'Not set';
        }
    };

    const formatCurrency = (amount: number = 0, currency: string = '$') => {
        return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="h-full w-full">
            {/* Professional Invoice Document */}
            <Card className="shadow-xl border-2 border-slate-200 bg-white overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-8 w-8" />
                                <h1 className="text-3xl md:text-4xl font-bold">INVOICE</h1>
                            </div>
                            <p className="text-blue-100">Professional Invoice Document</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20">
                            <div className="text-sm text-blue-100 mb-1">Invoice Number</div>
                            <div className="text-2xl font-bold font-mono">
                                {invoice.invoice_number || '#-----'}
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6 md:p-8 space-y-8">
                    {/* Date Info Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-600 text-sm mb-2">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">Issue Date</span>
                            </div>
                            <div className="text-slate-900 font-semibold">
                                {formatDate(invoice.invoice_date)}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-600 text-sm mb-2">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">Due Date</span>
                            </div>
                            <div className="text-slate-900 font-semibold">
                                {formatDate(invoice.due_date)}
                            </div>
                        </div>
                    </div>

                    {/* Bill From & Bill To */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bill From */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-600 font-semibold mb-3">
                                <Building2 className="h-5 w-5" />
                                <span>Bill From</span>
                            </div>
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
                                <div className="text-slate-900 font-semibold text-lg mb-2">
                                    Your Company Name
                                </div>
                                <div className="text-slate-600 text-sm space-y-1">
                                    <div>Your Company Address</div>
                                    <div>City, State 12345</div>
                                    <div>contact@yourcompany.com</div>
                                </div>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-600 font-semibold mb-3">
                                <Mail className="h-5 w-5" />
                                <span>Bill To</span>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                                <div className="text-slate-900 font-semibold text-lg mb-2">
                                    {invoice.customer_name || 'Customer Name'}
                                </div>
                                <div className="text-slate-600 text-sm space-y-1">
                                    {invoice.customer_email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
                                            {invoice.customer_email}
                                        </div>
                                    )}
                                    {invoice.customer_address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                                            <span className="whitespace-pre-line">{invoice.customer_address}</span>
                                        </div>
                                    )}
                                    {!invoice.customer_email && !invoice.customer_address && (
                                        <div className="text-slate-400">No contact information provided</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Invoice Items Table */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Invoice Items
                        </h3>

                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                                        <th className="text-left py-3 px-4 text-slate-600 font-semibold text-sm">Description</th>
                                        <th className="text-right py-3 px-4 text-slate-600 font-semibold text-sm">Qty</th>
                                        <th className="text-right py-3 px-4 text-slate-600 font-semibold text-sm">Unit Price</th>
                                        <th className="text-right py-3 px-4 text-slate-600 font-semibold text-sm">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(invoice.items || []).map((item, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-4 text-slate-900">{item.description || '-'}</td>
                                            <td className="text-right py-4 px-4 text-slate-700">{item.quantity || 1}</td>
                                            <td className="text-right py-4 px-4 text-slate-700 font-mono">
                                                {formatCurrency(item.unit_price || 0, invoice.currency || '$')}
                                            </td>
                                            <td className="text-right py-4 px-4 text-slate-900 font-semibold font-mono">
                                                {formatCurrency(item.total_price || 0, invoice.currency || '$')}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!invoice.items || invoice.items.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                                                No items added yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-3">
                            {(invoice.items || []).map((item, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <div className="font-semibold text-slate-900 mb-2">{item.description || 'Item'}</div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-slate-600">Qty:</span>
                                            <span className="ml-2 text-slate-900 font-semibold">{item.quantity || 1}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-600">Unit:</span>
                                            <span className="ml-2 text-slate-900 font-semibold font-mono">
                                                {formatCurrency(item.unit_price || 0, invoice.currency || '$')}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-right pt-2 border-t border-slate-200">
                                            <span className="text-slate-600">Total:</span>
                                            <span className="ml-2 text-slate-900 font-bold font-mono text-lg">
                                                {formatCurrency(item.total_price || 0, invoice.currency || '$')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!invoice.items || invoice.items.length === 0) && (
                                <div className="py-8 text-center text-slate-400 italic">
                                    No items added yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end">
                        <div className="w-full sm:w-80 space-y-3">
                            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between text-slate-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold font-mono">
                                        {formatCurrency(invoice.subtotal || 0, invoice.currency || '$')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 text-sm">
                                    <span>Tax ({invoice.tax_rate || 0}%)</span>
                                    <span className="font-mono">
                                        {formatCurrency(invoice.tax_amount || 0, invoice.currency || '$')}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg -mx-4">
                                    <span className="text-lg font-bold">Total Amount</span>
                                    <span className="text-2xl font-bold font-mono">
                                        {formatCurrency(invoice.total_amount || 0, invoice.currency || '$')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {invoice.notes && (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <div className="font-semibold text-amber-900 mb-2">Notes</div>
                            <div className="text-sm text-amber-800 whitespace-pre-line">
                                {invoice.notes}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-200">
                        <p>Thank you for your business!</p>
                        <p className="mt-1">Please remit payment by the due date</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoicePreview;
