// app/(components)/NavHeader.tsx
"use client";

import React from 'react';
import { Menu, FileText, User, LogIn } from 'lucide-react';
import { Button } from '@/(components)/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/(components)/ui/sheet';

interface NavHeaderProps {
    onOpenLogin: () => void;
    onOpenRegister: () => void;
}

const NavHeader: React.FC<NavHeaderProps> = ({ onOpenLogin, onOpenRegister }) => {
    return (
        <header className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <SheetHeader>
                            <SheetTitle>Invoice Generator</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-4 mt-4">
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
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2 ml-4">
                    <FileText className="h-6 w-6" />
                    <h1 className="font-semibold">Invoice Generator</h1>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden md:flex gap-2">
                        <Button variant="ghost" onClick={onOpenLogin}>
                            Login
                        </Button>
                        <Button variant="default" onClick={onOpenRegister}>
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavHeader;
