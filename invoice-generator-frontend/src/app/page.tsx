import type { Metadata } from 'next';
import InvoiceApp from '@/(components)/InvoiceApp';

export const metadata: Metadata = {
    title: 'Invoice Generator',
    description: 'Create and manage invoices',
};

export default function Home() {
    return <InvoiceApp />;
}
