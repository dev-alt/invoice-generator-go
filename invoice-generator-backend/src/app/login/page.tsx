import { Metadata } from 'next';
import LoginForm from "@/(components)/LoginForm";
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Login | Invoice Generator',
    description: 'Login to your Invoice Generator account',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-blue-100 p-2">
                        <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Register here
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
