// app/(components)/NavHeader.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Menu, FileText, User, LogIn, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/(components)/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/(components)/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/(components)/ui/dropdown-menu';

interface NavHeaderProps {
    onOpenLogin: () => void;
    onOpenRegister: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToCreate?: () => void;
}

const NavHeader: React.FC<NavHeaderProps> = ({
    onOpenLogin,
    onOpenRegister,
    onNavigateToDashboard,
    onNavigateToCreate
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        setIsLoggedIn(!!token);
        setUserEmail(email);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        setUserEmail(null);
        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="container mx-auto flex h-16 items-center px-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                Invoice Generator
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-2 mt-6">
                            {isLoggedIn ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={onNavigateToDashboard}
                                    >
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={onNavigateToCreate}
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Create Invoice
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={onOpenLogin}
                                    >
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={onOpenRegister}
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Register
                                    </Button>
                                </>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="flex items-center gap-3 ml-2 md:ml-0">
                    <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Invoice Generator
                    </h1>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            <Button
                                variant="ghost"
                                onClick={onNavigateToCreate}
                                className="hidden md:inline-flex"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Create Invoice
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="hidden md:inline-flex gap-2">
                                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {userEmail ? userEmail[0].toUpperCase() : 'U'}
                                        </div>
                                        <span className="max-w-[120px] truncate">{userEmail || 'User'}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={onNavigateToDashboard}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="hidden md:flex gap-2">
                            <Button variant="ghost" onClick={onOpenLogin}>
                                Login
                            </Button>
                            <Button
                                onClick={onOpenRegister}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                            >
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NavHeader;
