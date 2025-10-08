import React, { useEffect, useCallback } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Invoice, InvoiceFormData, InvoiceFormProps } from '@/(lib)/types';
import { Button } from '@/(components)/ui/button';
import { Card, CardContent } from '@/(components)/ui/card';
import InvoiceDetails from './InvoiceDetails';
import InvoiceItems from './InvoiceItems';
import InvoiceTotals from './InvoiceTotals';
import TemplateManager from './TemplateManager';
import CurrencySelector, { formatCurrency, CurrencyCode, currencies } from './CurrencySelector';
import apiClient from '@/(lib)/api-client';
import { FileText } from 'lucide-react';

const DEFAULT_FORM_VALUES: Partial<InvoiceFormData> = {
    items: [{ description: '', quantity: 1, unit_price: 0, total_price: 0 }],
    currencyCode: 'USD',
    currency: '$',
    tax_rate: 0,
    status: 'draft',
    subtotal: 0,
    tax_amount: 0,
    total_amount: 0,
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({
                                                     initialInvoice,
                                                     onChange,
                                                 }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
        getValues,
        watch,
    } = useForm<InvoiceFormData>({
        defaultValues: {
            ...DEFAULT_FORM_VALUES,
            ...initialInvoice,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    // Watch the required fields
    const items = watch('items');
    const tax_rate = watch('tax_rate');
    const currencyCode = watch('currencyCode');

    const calculateTotals = useCallback(() => {
        if (!items) return { subtotal: 0, taxAmount: 0, totalAmount: 0 };

        const subtotal = fields.reduce((sum, _, index) => {
            const quantity = Number(getValues(`items.${index}.quantity`)) || 0;
            const unitPrice = Number(getValues(`items.${index}.unit_price`)) || 0;
            const total = quantity * unitPrice;
            setValue(`items.${index}.total_price`, total);
            return sum + total;
        }, 0);

        const taxAmount = subtotal * ((tax_rate || 0) / 100);
        const totalAmount = subtotal + taxAmount;

        return { subtotal, taxAmount, totalAmount };
    }, [fields, getValues, tax_rate, setValue, items]);

    useEffect(() => {
        const totals = calculateTotals();
        setValue('subtotal', totals.subtotal);
        setValue('tax_amount', totals.taxAmount);
        setValue('total_amount', totals.totalAmount);

        const currentValues = getValues();
        onChange({
            ...currentValues,
            subtotal: totals.subtotal,
            tax_amount: totals.taxAmount,
            total_amount: totals.totalAmount,
        });
    }, [items, tax_rate, calculateTotals, setValue, getValues, onChange]);

    const handleCurrencyChange = useCallback((newCurrency: CurrencyCode) => {
        setValue('currencyCode', newCurrency);
        setValue('currency', currencies[newCurrency].symbol);
    }, [setValue]);

    const handleTemplateSelect = useCallback((templateId: string) => {
        setValue('template_id', templateId);
    }, [setValue]);

    const onSubmit: SubmitHandler<InvoiceFormData> = async (data) => {
        try {
            const { currencyCode: _, ...invoiceData } = data;

            const formattedData: Partial<Invoice> = {
                ...invoiceData,
                status: 'draft',
                currency: currencies[data.currencyCode].symbol,
                invoice_date: data.invoice_date ? new Date(data.invoice_date).toISOString() : undefined,
                due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
            };

            const response = await apiClient.post<Invoice>('/api/invoices', formattedData);
            console.log('Invoice created:', response.data);
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    return (
        <Card className="bg-white shadow-md">
            <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">New Invoice</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Template and Logo Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Template
                            </label>
                            <TemplateManager onTemplateSelect={handleTemplateSelect} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Logo
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                    {/* Logo preview would go here */}
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Upload Logo
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Top Section: Currency and Invoice Details */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Currency
                            </label>
                            <CurrencySelector
                                value={currencyCode}
                                onChange={handleCurrencyChange}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InvoiceDetails
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <InvoiceItems
                            register={register}
                            fieldArray={{ fields, append, remove }}
                            items={items || []}
                            currencyCode={currencyCode}
                            formatCurrency={formatCurrency}
                        />
                    </div>

                    {/* Bottom Section: Totals and Notes */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                {...register('notes')}
                                rows={4}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Additional notes or payment terms..."
                            />
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <InvoiceTotals
                                register={register}
                                subtotal={getValues('subtotal') || 0}
                                taxAmount={getValues('tax_amount') || 0}
                                totalAmount={getValues('total_amount') || 0}
                                taxRate={tax_rate || 0}
                                currencyCode={currencyCode}
                                formatCurrency={formatCurrency}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Invoice'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default InvoiceForm;
