# Invoice Generator Frontend

> Next.js application for invoice management

Modern, responsive React frontend built with Next.js 15, TypeScript, and Tailwind CSS for the Invoice Generator application.

---

## Technology Stack

- **Framework**: Next.js 15.1.3 with App Router
- **React**: 19.0.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form 7.54
- **HTTP Client**: Axios 1.7
- **Icons**: Lucide React
- **Build Tool**: Turbopack (Next.js 15)

---

## Project Structure

```
invoice-generator-frontend/
├── src/
│   └── app/                    # Next.js App Router
│       ├── layout.tsx          # Root layout with providers
│       ├── page.tsx            # Home page
│       ├── login/
│       │   └── page.tsx        # Login page
│       ├── register/
│       │   └── page.tsx        # Registration page
│       └── api/                # API route handlers
│
├── components/                 # React components
│   ├── ui/                    # shadcn/ui components
│   └── ...                    # Feature components
│
├── public/                     # Static assets
│
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind CSS config
├── next.config.ts             # Next.js config
└── components.json            # shadcn/ui config
```

---

## Features

### UI Components (shadcn/ui)

The frontend uses shadcn/ui components built on Radix UI primitives:

- **Dialog** — Modal dialogs for forms and confirmations
- **Label** — Accessible form labels
- **Select** — Custom dropdown selects
- **Separator** — Visual dividers
- **Button** — Styled button variants

All components are customizable via `class-variance-authority` and `tailwind-merge`.

### Form Handling

Forms use React Hook Form for:
- Type-safe form validation
- Efficient re-rendering
- Easy error handling
- Controlled inputs

### Authentication

- JWT token storage (likely localStorage/cookies)
- Protected routes
- Login/Registration forms
- Axios interceptors for auth headers

### Theming

Next-themes integration for:
- Light/dark mode support
- System preference detection
- Persistent theme selection

---

## Development

### Prerequisites

- Node.js 20 or higher
- npm (or yarn/pnpm/bun)

### Setup

```bash
# Install dependencies
npm install

# Or use clean install
npm ci
```

### Run Development Server

```bash
# Start with Turbopack (fast refresh)
npm run dev

# Open browser
# http://localhost:3000
```

The development server includes:
- Hot Module Replacement (HMR)
- Fast Refresh for React components
- TypeScript type checking
- Turbopack for faster builds

### Build for Production

```bash
# Create optimized production build
npm run build

# Run production server
npm run start
```

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

---

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

### TypeScript

The project uses strict TypeScript configuration:
- Strict mode enabled
- No implicit any
- Type checking on build

### Tailwind CSS

Tailwind is configured with:
- Custom color schemes
- shadcn/ui theming
- Responsive design utilities
- Custom animations (tailwindcss-animate)

---

## API Integration

### Axios Setup

The frontend communicates with the backend API using Axios:

```typescript
// Example API call
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Include JWT token
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Endpoints Used

- `POST /api/register` — User registration
- `POST /api/login` — User authentication
- `GET /api/invoices` — Fetch invoices
- `POST /api/invoices` — Create invoice
- `GET /api/templates` — List templates

---

## Component Development

### Adding shadcn/ui Components

```bash
# Add a new component
npx shadcn@latest add [component-name]

# Examples
npx shadcn@latest add button
npx shadcn@latest add form
npx shadcn@latest add table
```

Components are added to `components/ui/` and can be customized.

### Creating Custom Components

```typescript
// components/InvoiceCard.tsx
import { Card } from "@/components/ui/card"

export function InvoiceCard({ invoice }) {
  return (
    <Card>
      <h3>{invoice.invoiceNumber}</h3>
      <p>{invoice.customerName}</p>
    </Card>
  )
}
```

### Using React Hook Form

```typescript
import { useForm } from "react-hook-form"

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: true })} />
      {errors.email && <span>Email is required</span>}
    </form>
  )
}
```

---

## Styling

### Tailwind Utilities

```tsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Dark mode
<div className="bg-white dark:bg-slate-900">

// Custom variants (via CVA)
<Button variant="destructive" size="lg">Delete</Button>
```

### CSS Classes

Utility classes are composed using:
- `clsx` — Conditional classes
- `tailwind-merge` — Merge Tailwind classes safely

```typescript
import { cn } from "@/lib/utils"

cn("px-4 py-2", isActive && "bg-blue-500")
```

---

## Routing

### App Router (Next.js 15)

The app uses Next.js App Router:

- **File-based routing** — Each folder in `app/` is a route
- **Layouts** — Shared UI across routes
- **Loading states** — `loading.tsx` files
- **Error boundaries** — `error.tsx` files

### Navigation

```typescript
import { useRouter } from 'next/navigation'

function Component() {
  const router = useRouter()

  const navigate = () => {
    router.push('/invoices')
  }
}
```

---

## Performance

### Optimizations

- **Turbopack** — Fast bundler (Next.js 15)
- **React 19** — Latest React features and optimizations
- **Code splitting** — Automatic route-based splitting
- **Image optimization** — Next.js Image component
- **Font optimization** — Automatic font loading

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
# Check .next/analyze/ output
```

---

## Testing

### Component Testing (Future)

Recommended setup:
- **Vitest** or **Jest** for unit tests
- **React Testing Library** for component tests
- **Playwright** or **Cypress** for E2E tests

```bash
# Example test structure
__tests__/
├── components/
│   └── InvoiceCard.test.tsx
└── pages/
    └── login.test.tsx
```

---

## Deployment

### Production Build

```bash
# Build
npm run build

# Start production server
npm run start
```

### Docker

The frontend includes a Dockerfile for containerization:

```bash
# Build image
docker build -t invoice-frontend .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api:8080 invoice-frontend
```

### Vercel Deployment

This Next.js app can be easily deployed to Vercel:

1. Connect your Git repository
2. Configure environment variables
3. Deploy automatically on push

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Type Errors

```bash
# Check TypeScript errors
npx tsc --noEmit

# Update types
npm install --save-dev @types/node @types/react @types/react-dom
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clean build
npm run build
```

### Hydration Errors

If you see hydration mismatches (common with browser extensions):
- Use `'use client'` directive for client-only components
- Use dynamic imports with `ssr: false`
- Wrap components with ClientOnly wrapper

```typescript
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(
  () => import('./ClientComponent'),
  { ssr: false }
)
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Dependencies Overview

### Production Dependencies

- `next` — React framework
- `react` & `react-dom` — React library
- `axios` — HTTP client
- `react-hook-form` — Form management
- `@radix-ui/*` — Headless UI components
- `lucide-react` — Icon library
- `next-themes` — Theme switching
- `tailwindcss` — Utility-first CSS
- `class-variance-authority` — Component variants
- `clsx` & `tailwind-merge` — Class utilities

### Development Dependencies

- `typescript` — Type checking
- `@types/*` — Type definitions
- `eslint` — Code linting
- `postcss` — CSS processing

---

## Best Practices

1. **Use TypeScript** — Type all components and functions
2. **Component composition** — Break down complex UIs into smaller components
3. **Server Components** — Use React Server Components where possible (Next.js 15)
4. **Error boundaries** — Handle errors gracefully
5. **Loading states** — Provide feedback during async operations
6. **Accessibility** — Use semantic HTML and ARIA attributes
7. **Responsive design** — Mobile-first approach with Tailwind

---

**Ready to build?** Run `npm run dev` and start developing at http://localhost:3000
