import React, { useState, useCallback } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/(components)/ui/select';

// Common currencies with symbols and formatting info
export const currencies = {
    USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
    EUR: { symbol: '€', locale: 'de-DE', name: 'Euro' },
    GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
    JPY: { symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
    CNY: { symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan' },
    INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
    AUD: { symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
    NZD: { symbol: 'NZ$', locale: 'en-NZ', name: 'New Zealand Dollar' },
    CAD: { symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
} as const;

export type CurrencyCode = keyof typeof currencies;

interface CurrencySelectorProps {
    value: CurrencyCode;
    onChange: (currency: CurrencyCode) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
    return (
        <Select value={value} onValueChange={onChange as (value: string) => void}>
            <SelectTrigger className="w-full">
                <SelectValue>
                    {currencies[value].symbol} - {currencies[value].name}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {Object.entries(currencies).map(([code, info]) => (
                    <SelectItem key={code} value={code}>
                        {info.symbol} - {info.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export const formatCurrency = (amount: number, currencyCode: CurrencyCode): string => {
    const { locale } = currencies[currencyCode];
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
};

export default CurrencySelector;
