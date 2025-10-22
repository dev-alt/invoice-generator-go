"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/(components)/ui/button';
import {
    MoreVertical,
    Download,
    Trash2,
    Send,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    Loader2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/(components)/ui/dropdown-menu';
import { invoiceAPI } from '@/(lib)/api-client';
import { Invoice as InvoiceType } from '@/(lib)/types';

interface InvoiceListProps {
    searchQuery?: string;
    filterStatus?: string;
    onRefresh?: () => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ searchQuery = '', filterStatus = 'all', onRefresh }) => {
    const [invoices, setInvoices] = useState<InvoiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await invoiceAPI.list();
            setInvoices(response.data.invoices || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return;

        try {
            await invoiceAPI.delete(id);
            await fetchInvoices();
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error('Error deleting invoice:', err);
            alert('Failed to delete invoice');
        }
    };

    const handleGeneratePDF = async (id: string) => {
        try {
            await invoiceAPI.generatePDF(id);
            alert('PDF generated successfully!');
            await fetchInvoices();
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Failed to generate PDF. Make sure a template is selected.');
        }
    };

    const handleDownloadPDF = async (id: string, invoiceNumber: string) => {
        try {
            const response = await invoiceAPI.downloadPDF(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${invoiceNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error downloading PDF:', err);
            alert('Failed to download PDF. Please generate the PDF first.');
        }
    };

    const getStatusBadge = (status: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const configs: Record<string, { icon: any; text: string; className: string }> = {
            paid: {
                icon: CheckCircle,
                text: 'Paid',
                className: 'bg-green-100 text-green-700 border-green-200',
            },
            sent: {
                icon: Send,
                text: 'Sent',
                className: 'bg-blue-100 text-blue-700 border-blue-200',
            },
            draft: {
                icon: AlertCircle,
                text: 'Draft',
                className: 'bg-slate-100 text-slate-700 border-slate-200',
            },
            overdue: {
                icon: XCircle,
                text: 'Overdue',
                className: 'bg-red-100 text-red-700 border-red-200',
            },
            void: {
                icon: XCircle,
                text: 'Void',
                className: 'bg-gray-100 text-gray-700 border-gray-200',
            },
        };

        const config = configs[status] || configs.draft;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
                <Icon className="h-3.5 w-3.5" />
                {config.text}
            </span>
        );
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            invoice.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number | undefined, currency: string | undefined) => {
        if (amount === undefined) return 'N/A';
        const symbol = currency || '$';
        return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600">Loading invoices...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-2 py-12 text-red-500">
                <AlertCircle className="h-12 w-12" />
                <p className="text-lg font-medium">{error}</p>
                <Button onClick={fetchInvoices} variant="outline">Retry</Button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-y border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Invoice
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="h-12 w-12 text-slate-300" />
                                        <p className="text-lg font-medium">No invoices found</p>
                                        <p className="text-sm">Create your first invoice to get started</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900">
                                                {invoice.invoice_number}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {formatDate(invoice.created_at)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-900">{invoice.customer_name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-slate-900">
                                            {formatCurrency(invoice.total_amount, invoice.currency)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(invoice.status || 'draft')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-slate-600">{formatDate(invoice.due_date)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleGeneratePDF(invoice.id!)}>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Generate PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDownloadPDF(invoice.id!, invoice.invoice_number!)}>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(invoice.id!)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
                {filteredInvoices.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-12 text-slate-500">
                        <FileText className="h-12 w-12 text-slate-300" />
                        <p className="text-lg font-medium">No invoices found</p>
                        <p className="text-sm text-center">Create your first invoice to get started</p>
                    </div>
                ) : (
                    filteredInvoices.map((invoice) => (
                        <div key={invoice.id} className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{invoice.invoice_number}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{invoice.customer_name}</p>
                                </div>
                                {getStatusBadge(invoice.status || 'draft')}
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl font-bold text-slate-900">
                                    {formatCurrency(invoice.total_amount, invoice.currency)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                <span>Due: {formatDate(invoice.due_date)}</span>
                                <span>Created: {formatDate(invoice.created_at)}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleGeneratePDF(invoice.id!)}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generate
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleDownloadPDF(invoice.id!, invoice.invoice_number!)}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(invoice.id!)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InvoiceList;
