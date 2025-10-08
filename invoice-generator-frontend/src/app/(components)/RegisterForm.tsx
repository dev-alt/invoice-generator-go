"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/(components)/ui/button';
import { Input } from "@/(components)/ui/input";
import { Label } from "@/(components)/ui/label";
import { Alert, AlertDescription } from "@/(components)/ui/alert";
import { AlertCircle } from 'lucide-react';

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    company_name?: string;
}

const RegisterForm = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const password = watch('password');

    const onSubmit = async (formData: RegisterFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            // Create a new object without confirmPassword
            const registerData = {
                email: formData.email,
                password: formData.password,
                company_name: formData.company_name
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setError(responseData.error || 'Registration failed');
                return;
            }

            // Redirect to login page after successful registration
            router.push('/login?registered=true');
        } catch {
            setError('An error occurred during registration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="company_name">Company Name (Optional)</Label>
                <Input
                    id="company_name"
                    type="text"
                    {...register('company_name')}
                    placeholder="Your Company"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
                        },
                    })}
                    className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value =>
                            value === password || 'The passwords do not match',
                    })}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>

            <div className="text-sm">
                <p className="text-gray-500">
                    By registering, you agree to our{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                    </a>
                </p>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
        </form>
    );
};

export default RegisterForm;
