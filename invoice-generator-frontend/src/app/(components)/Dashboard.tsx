"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(components)/ui/card';
import { Button } from '@/(components)/ui/button';
import InvoiceList from '@/(components)/InvoiceList';
import {
    FileText,
    DollarSign,
    TrendingUp,
    Clock,
    Plus,
    Download,
    Filter,
    Search
} from 'lucide-react';
import { Input } from '@/(components)/ui/input';

interface DashboardProps {
    onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateNew }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus] = useState<string>('all');

    // Mock statistics
    const stats = [
        {
            title: 'Total Invoices',
            value: '24',
            change: '+12% from last month',
            icon: FileText,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Revenue',
            value: '$45,231',
            change: '+18% from last month',
            icon: DollarSign,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Paid Invoices',
            value: '18',
            change: '75% payment rate',
            icon: TrendingUp,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Pending',
            value: '6',
            change: 'Awaiting payment',
            icon: Clock,
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-600 mt-1">Manage and track all your invoices in one place</p>
                </div>
                <Button
                    onClick={onCreateNew}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Invoice
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`h-10 w-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">Recent Invoices</CardTitle>
                            <CardDescription>View and manage all your invoices</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search invoices..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-full sm:w-64"
                                />
                            </div>

                            {/* Filter */}
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <InvoiceList searchQuery={searchQuery} filterStatus={filterStatus} />
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Templates</CardTitle>
                                <CardDescription>Manage your invoice templates</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card className="border-2 hover:border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Reports</CardTitle>
                                <CardDescription>View detailed financial reports</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
