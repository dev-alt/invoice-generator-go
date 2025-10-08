import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    // Allow access to public routes
    if (publicRoutes.includes(pathname)) {
        // If user is already logged in, redirect to home page
        if (token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Check auth for protected routes
    if (!token) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Specify which routes the middleware should run on
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
