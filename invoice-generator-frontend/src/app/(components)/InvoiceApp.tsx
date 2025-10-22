"use client"
import React, { useState, useCallback, useEffect } from 'react';
import InvoiceForm from '@/(components)/InvoiceForm';
import InvoicePreview from '@/(components)/InvoicePreview';
import LoginForm from '@/(components)/LoginForm';
import RegisterForm from '@/(components)/RegisterForm';
import LandingPage from '@/(components)/LandingPage';
import Dashboard from '@/(components)/Dashboard';
import Footer from '@/(components)/Footer';
import { Invoice } from '@/(lib)/types';
import NavHeader from "@/(components)/NavHeader";
import AuthDialog from "@/(components)/AuthDialog";
import { Eye } from 'lucide-react';

type ViewMode = 'landing' | 'create' | 'dashboard';

export default function InvoiceApp() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentView, setCurrentView] = useState<ViewMode>('landing');

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);

        // If logged in, show create view by default
        if (loggedIn) {
            setCurrentView('create');
        }
    }, []);

    const handleInvoiceChange = useCallback((data: Partial<Invoice>) => {
        setInvoiceData(data);
    }, []);


    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <NavHeader
                onOpenLogin={() => setIsLoginOpen(true)}
                onOpenRegister={() => setIsRegisterOpen(true)}
                onNavigateToDashboard={() => setCurrentView('dashboard')}
                onNavigateToCreate={() => setCurrentView('create')}
            />

            {/* Main Content */}
            {!isLoggedIn && currentView === 'landing' ? (
                <LandingPage
                    onOpenLogin={() => setIsLoginOpen(true)}
                    onOpenRegister={() => setIsRegisterOpen(true)}
                />
            ) : currentView === 'create' ? (
                <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 2xl:max-w-[1920px]">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                        {/* Form Section */}
                        <div className="w-full">
                            <InvoiceForm onChange={handleInvoiceChange} />
                        </div>

                        {/* Preview Section - Sticky on large screens */}
                        <div className="w-full xl:sticky xl:top-24 xl:self-start">
                            <div className="bg-white rounded-xl shadow-sm border-2 border-slate-200 p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200">
                                    <Eye className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Live Preview</h2>
                                </div>
                                <div className="max-h-[800px] overflow-y-auto pr-2">
                                    <InvoicePreview invoice={invoiceData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            ) : (
                <main className="flex-1 container mx-auto p-4 md:p-6 xl:p-8 2xl:max-w-[1920px]">
                    <Dashboard onCreateNew={() => setCurrentView('create')} />
                </main>
            )}

            <Footer />

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
