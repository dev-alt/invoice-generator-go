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
import { invoiceAPI } from '@/(lib)/api-client';
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
            const { currencyCode, ...invoiceData } = data;

            const formattedData: Partial<Invoice> = {
                ...invoiceData,
                status: 'draft',
                currency: currencies[currencyCode].symbol,
                invoice_date: data.invoice_date ? new Date(data.invoice_date).toISOString() : undefined,
                due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
            };

            const response = await invoiceAPI.create(formattedData);
            console.log('Invoice created:', response.data);
            alert('Invoice created successfully!');
            // Optionally redirect to invoice list or reset form
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert('Error creating invoice. Please try again.');
        }
    };

    return (
        <Card className="bg-white shadow-xl border-2 border-slate-200">
            <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 p-6 sm:p-8 mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3">
                        <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">New Invoice</h2>
                    </div>
                    <p className="text-blue-100 mt-2 text-sm sm:text-base">Create a professional invoice for your client</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                    {/* Currency and Template Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Currency
                            </label>
                            <CurrencySelector
                                value={currencyCode}
                                onChange={handleCurrencyChange}
                            />
                        </div>

                        <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Template
                            </label>
                            <TemplateManager onTemplateSelect={handleTemplateSelect} />
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <InvoiceDetails
                        register={register}
                        errors={errors}
                    />

                    {/* Items Section */}
                    <InvoiceItems
                        register={register}
                        fieldArray={{ fields, append, remove }}
                        items={items || []}
                        currencyCode={currencyCode}
                        formatCurrency={formatCurrency}
                    />

                    {/* Bottom Section: Notes and Totals */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 sm:p-6 rounded-lg border border-amber-200 order-2 lg:order-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Additional Notes
                            </label>
                            <textarea
                                {...register('notes')}
                                rows={6}
                                className="bg-white border border-amber-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-3 resize-none"
                                placeholder="Add payment terms, thank you message, or other notes..."
                            />
                        </div>

                        <div className="order-1 lg:order-2">
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
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t-2 border-slate-200">
                        <Button
                            type="button"
                            variant="outline"
                            className="px-6 py-3 border-2 border-slate-300 hover:bg-slate-100"
                        >
                            Save as Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold shadow-lg"
                        >
                            {isSubmitting ? 'Creating Invoice...' : 'Create Invoice'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default InvoiceForm;
