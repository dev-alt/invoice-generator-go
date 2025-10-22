import React from 'react';
import { InvoiceDetailsProps } from "@/(lib)/types";
import { Input } from "@/(components)/ui/input";
import { Textarea } from "@/(components)/ui/textarea";
import { Label } from "@/(components)/ui/label";
import { User, Mail, MapPin, Calendar, FileText } from 'lucide-react';

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ register, errors }) => {
    return (
        <div className="w-full space-y-6">
            {/* Invoice Number and Dates Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Invoice Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="invoice_number" className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Invoice Number *
                        </Label>
                        <Input
                            id="invoice_number"
                            {...register('invoice_number', { required: 'Invoice number is required' })}
                            className="font-mono bg-white"
                            placeholder="INV-001"
                        />
                        {errors.invoice_number?.message && (
                            <p className="text-red-500 text-xs mt-1">{errors.invoice_number.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="invoice_date" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Invoice Date
                        </Label>
                        <Input
                            id="invoice_date"
                            type="date"
                            {...register('invoice_date')}
                            className="bg-white"
                        />
                    </div>
                    <div>
                        <Label htmlFor="due_date" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Due Date
                        </Label>
                        <Input
                            id="due_date"
                            type="date"
                            {...register('due_date')}
                            className="bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Customer Information Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Customer Information</h3>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="customer_name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Customer Name *
                            </Label>
                            <Input
                                id="customer_name"
                                {...register('customer_name', { required: 'Customer name is required' })}
                                placeholder="Enter customer name"
                                className="bg-white"
                            />
                            {errors.customer_name?.message && (
                                <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="customer_email" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                Email
                            </Label>
                            <Input
                                id="customer_email"
                                type="email"
                                {...register('customer_email')}
                                placeholder="customer@example.com"
                                className="bg-white"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="customer_address" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            Address
                        </Label>
                        <Textarea
                            id="customer_address"
                            {...register('customer_address')}
                            className="resize-none bg-white"
                            rows={3}
                            placeholder="Enter customer address"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetails;
