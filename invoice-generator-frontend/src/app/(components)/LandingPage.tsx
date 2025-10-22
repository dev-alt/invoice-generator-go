"use client"

import React from 'react';
import { Button } from '@/(components)/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/(components)/ui/card';
import { FileText, Zap, Shield, Download, CreditCard, Globe, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
    onOpenLogin: () => void;
    onOpenRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenRegister }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20 -z-10">
                    <div className="w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full" />
                </div>
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-20 -z-10">
                    <div className="w-96 h-96 bg-gradient-to-br from-indigo-400 to-cyan-600 rounded-full" />
                </div>

                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            <span>Professional Invoice Generation Made Simple</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            Create Beautiful Invoices in
                            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Seconds, Not Hours
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            The modern invoice generator for freelancers, startups, and businesses.
                            Create, customize, and send professional invoices with ease.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button
                                size="lg"
                                onClick={onOpenRegister}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg shadow-blue-500/25 group"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={onOpenLogin}
                                className="border-2 border-slate-300 hover:border-slate-400 px-8 py-6 text-lg"
                            >
                                Sign In
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
                            <div>
                                <div className="text-3xl font-bold text-slate-900">10K+</div>
                                <div className="text-sm text-slate-600 mt-1">Invoices Created</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-slate-900">500+</div>
                                <div className="text-sm text-slate-600 mt-1">Active Users</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-slate-900">99.9%</div>
                                <div className="text-sm text-slate-600 mt-1">Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Everything you need to manage invoices
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600">
                            Powerful features to help you create, send, and track professional invoices effortlessly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Feature 1 */}
                        <Card className="border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                            <CardHeader>
                                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl">Custom Templates</CardTitle>
                                <CardDescription className="text-base">
                                    Upload your own HTML templates or use our professionally designed options to match your brand.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="border-2 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group">
                            <CardHeader>
                                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl">Lightning Fast</CardTitle>
                                <CardDescription className="text-base">
                                    Generate professional PDF invoices in seconds with our optimized processing engine.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="border-2 hover:border-green-200 hover:shadow-lg transition-all duration-300 group">
                            <CardHeader>
                                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl">Secure & Private</CardTitle>
                                <CardDescription className="text-base">
                                    Your data is encrypted and secure. We never share your information with third parties.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Feature 4 */}
                        <Card className="border-2 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
                            <CardHeader>
                                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Download className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl">Instant PDF Export</CardTitle>
                                <CardDescription className="text-base">
                                    Download your invoices as professional PDF documents ready to send to clients.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Feature 5 */}
                        <Card className="border-2 hover:border-cyan-200 hover:shadow-lg transition-all duration-300 group">
                            <CardHeader>
                                <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <CreditCard className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl">Multi-Currency</CardTitle>
                                <CardDescription className="text-base">
                                    Support for multiple currencies to invoice clients worldwide with proper formatting.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Feature 6 */}
                        <Card className="border-2 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
                            <CardHeader>
                                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Globe className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl">Cloud-Based</CardTitle>
                                <CardDescription className="text-base">
                                    Access your invoices from anywhere, anytime. All your data synced in the cloud.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Create invoices in 3 simple steps
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600">
                            Our streamlined process makes invoicing quick and painless
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row items-start gap-6 p-8 bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                1
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Fill in the details</h3>
                                <p className="text-lg text-slate-600">
                                    Enter your client information, invoice items, and payment terms in our intuitive form.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col md:flex-row items-start gap-6 p-8 bg-white rounded-2xl border-2 border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                2
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Choose your template</h3>
                                <p className="text-lg text-slate-600">
                                    Select from professionally designed templates or upload your own custom design.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row items-start gap-6 p-8 bg-white rounded-2xl border-2 border-slate-100 hover:border-green-200 hover:shadow-lg transition-all">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                3
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Generate and download</h3>
                                <p className="text-lg text-slate-600">
                                    Click generate and get your professional PDF invoice ready to send to your client.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                            Ready to streamline your invoicing?
                        </h2>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
                            Join hundreds of professionals who trust our platform for their invoicing needs.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button
                                size="lg"
                                onClick={onOpenRegister}
                                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg shadow-xl group"
                            >
                                Start Creating Invoices
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                <span>Free to get started</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
