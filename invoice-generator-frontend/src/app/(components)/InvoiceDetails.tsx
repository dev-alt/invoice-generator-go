import React from 'react';
import { InvoiceDetailsProps } from "@/(lib)/types";
import { Input } from "@/(components)/ui/input";
import { Textarea } from "@/(components)/ui/textarea";
import { Label } from "@/(components)/ui/label";
import { User, Mail, MapPin } from 'lucide-react';

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ register, errors }) => {
    return (
        <div className="w-full">
            {/* Invoice Number and Customer Row */}
            <div className="space-y-4">
                <div>
                    <Label htmlFor="invoice_number" className="text-sm font-medium text-gray-700">
                        Invoice Number
                    </Label>
                    <Input
                        id="invoice_number"
                        {...register('invoice_number', { required: 'Required' })}
                        className="font-mono"
                        placeholder="INV-001"
                    />
                    {errors.invoice_number?.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.invoice_number.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="customer_name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <User className="h-4 w-4" />
                        Customer Name
                    </Label>
                    <Input
                        id="customer_name"
                        {...register('customer_name', { required: 'Required' })}
                        placeholder="Enter customer name"
                    />
                    {errors.customer_name?.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="customer_email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail className="h-4 w-4" />
                        Email
                    </Label>
                    <Input
                        id="customer_email"
                        type="email"
                        {...register('customer_email')}
                        placeholder="customer@example.com"
                    />
                </div>

                <div>
                    <Label htmlFor="customer_address" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin className="h-4 w-4" />
                        Address
                    </Label>
                    <Textarea
                        id="customer_address"
                        {...register('customer_address')}
                        className="resize-none"
                        rows={2}
                        placeholder="Enter customer address"
                    />
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetails;
