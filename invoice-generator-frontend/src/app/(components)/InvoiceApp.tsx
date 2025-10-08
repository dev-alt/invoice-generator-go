"use client"
import React, { useState, useCallback } from 'react';
import InvoiceForm from '@/(components)/InvoiceForm';
import InvoicePreview from '@/(components)/InvoicePreview';
import LoginForm from '@/(components)/LoginForm';
import RegisterForm from '@/(components)/RegisterForm';
import { Invoice } from '@/(lib)/types';
import NavHeader from "@/(components)/NavHeader";
import AuthDialog from "@/(components)/AuthDialog";
import { FileText, Eye } from 'lucide-react';

export default function InvoiceApp() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({});

    const handleInvoiceChange = useCallback((data: Partial<Invoice>) => {
        setInvoiceData(data);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavHeader
                onOpenLogin={() => setIsLoginOpen(true)}
                onOpenRegister={() => setIsRegisterOpen(true)}
            />

            <main className="container mx-auto p-4 md:p-6 xl:p-8 2xl:max-w-[1920px]">
                <div className="grid lg:grid-cols-2 gap-6 xl:gap-8">
                    {/* Form Section */}
                    <div className="flex flex-col">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 xl:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-semibold">Create New Invoice</h2>
                            </div>
                            <InvoiceForm onChange={handleInvoiceChange} />
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="flex flex-col lg:sticky lg:top-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 xl:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Eye className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-semibold">Invoice Preview</h2>
                            </div>
                            <InvoicePreview invoice={invoiceData} />
                        </div>
                    </div>
                </div>
            </main>

            <AuthDialog
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
                title="Login"
            >
                <LoginForm />
            </AuthDialog>

            <AuthDialog
                isOpen={isRegisterOpen}
                onOpenChange={setIsRegisterOpen}
                title="Register"
            >
                <RegisterForm />
            </AuthDialog>
        </div>
    );
}
