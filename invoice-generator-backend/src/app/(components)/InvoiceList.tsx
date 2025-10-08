"use client";
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Invoice } from '@/(lib)/types';

interface InvoiceFormProps {
    onSubmit?: (data: Invoice) => void;initialValues?: Invoice;
}

const InvoiceForm: React.FC<InvoiceFormProps> = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Invoice>();

    const onSubmit: SubmitHandler<Invoice> = async (data) => {
        try {
            // Replace with your actual API endpoint
            const response = await axios.post<Invoice>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invoices`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from local storage
                    },
                }
            );

            console.log('Invoice created:', response.data);
            // Handle successful invoice creation (e.g., display success message, redirect, etc.)
        } catch (error) {
            console.error('Error creating invoice:', error);
            // Handle errors (e.g., display error message)
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Invoice Number */}
            <div>
                <label htmlFor="invoice_number">Invoice Number:</label>
                <input
                    type="text"
                    id="invoice_number"
                    {...register('invoice_number', { required: true })}
                />
                {errors.invoice_number && <span>This field is required</span>}
            </div>

            {/* Customer Name */}
            <div>
                <label htmlFor="customer_name">Customer Name:</label>
                <input
                    type="text"
                    id="customer_name"
                    {...register('customer_name', { required: true })}
                />
                {errors.customer_name && <span>This field is required</span>}
            </div>

            {/* Customer Email */}
            <div>
                <label htmlFor="customer_email">Customer Email:</label>
                <input type="email" id="customer_email" {...register('customer_email')} />
                {/* Add validation for email format if needed */}
            </div>

            {/* Customer Address */}
            <div>
                <label htmlFor="customer_address">Customer Address:</label>
                <textarea id="customer_address" {...register('customer_address')} />
            </div>

            {/* Invoice Date */}
            <div>
                <label htmlFor="invoice_date">Invoice Date:</label>
                <input
                    type="date"
                    id="invoice_date"
                    {...register('invoice_date', { required: true })}
                />
                {errors.invoice_date && <span>This field is required</span>}
            </div>

            {/* Due Date */}
            <div>
                <label htmlFor="due_date">Due Date:</label>
                <input
                    type="date"
                    id="due_date"
                    {...register('due_date', { required: true })}
                />
                {errors.due_date && <span>This field is required</span>}
            </div>

            {/* Currency */}
            <div>
                <label htmlFor="currency">Currency:</label>
                <input type="text" id="currency" {...register('currency')} />
            </div>

            {/* Subtotal */}
            <div>
                <label htmlFor="subtotal">Subtotal:</label>
                <input
                    type="number"
                    id="subtotal"
                    {...register('subtotal', { required: true, valueAsNumber: true })}
                />
                {errors.subtotal && <span>This field is required</span>}
            </div>

            {/* Tax Rate */}
            <div>
                <label htmlFor="tax_rate">Tax Rate:</label>
                <input
                    type="number"
                    id="tax_rate"
                    {...register('tax_rate', { valueAsNumber: true })}
                />
            </div>

            {/* Tax Amount */}
            <div>
                <label htmlFor="tax_amount">Tax Amount:</label>
                <input
                    type="number"
                    id="tax_amount"
                    {...register('tax_amount', { valueAsNumber: true })}
                />
            </div>

            {/* Total Amount */}
            <div>
                <label htmlFor="total_amount">Total:</label>
                <input
                    type="number"
                    id="total_amount"
                    {...register('total_amount', { required: true, valueAsNumber: true })}
                />
                {errors.total_amount && <span>This field is required</span>}
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="notes">Notes:</label>
                <textarea id="notes" {...register('notes')} />
            </div>

            {/* Add more fields as needed (items, etc.) */}

            <button type="submit">Create Invoice</button>
        </form>
    );
};

export default InvoiceForm;
