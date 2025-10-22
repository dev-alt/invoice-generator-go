"use client";

import React from 'react';
import { InvoiceItemsProps } from '@/(lib)/types';
import { Button } from '@/(components)/ui/button';
import { Input } from '@/(components)/ui/input';
import { Label } from '@/(components)/ui/label';
import { Plus, Trash2, Package } from 'lucide-react';

const InvoiceItems = ({
                          register,
                          fieldArray: { fields, append, remove },
                          items,
                          currencyCode,
                          formatCurrency,
                      }: InvoiceItemsProps) => {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
                <Package className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Invoice Items</h3>
            </div>

            <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    {/* Headers */}
                    <div className="grid grid-cols-12 gap-3 px-3 pb-3 text-sm font-semibold text-slate-600 border-b-2 border-slate-300">
                        <div className="col-span-5">Description</div>
                        <div className="col-span-2 text-right">Quantity</div>
                        <div className="col-span-2 text-right">Unit Price</div>
                        <div className="col-span-2 text-right">Total</div>
                        <div className="col-span-1"></div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mt-3">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                            >
                                <div className="col-span-5">
                                    <Input
                                        {...register(`items.${index}.description`)}
                                        placeholder="Item description"
                                        className="border-slate-300"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        {...register(`items.${index}.quantity`, {
                                            valueAsNumber: true,
                                            min: 0
                                        })}
                                        placeholder="Qty"
                                        className="text-right border-slate-300"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.unit_price`, {
                                            valueAsNumber: true,
                                            min: 0
                                        })}
                                        placeholder="0.00"
                                        className="text-right border-slate-300 font-mono"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <div className="bg-slate-100 px-3 py-2 rounded-md text-right font-mono font-semibold text-slate-900">
                                        {formatCurrency(items[index]?.total_price || 0, currencyCode)}
                                    </div>
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden space-y-3">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="bg-white p-4 rounded-lg border border-slate-200 space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <Label className="text-sm font-semibold text-slate-700">
                                    Item {index + 1}
                                </Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div>
                                <Label className="text-xs text-slate-600 mb-1.5">Description</Label>
                                <Input
                                    {...register(`items.${index}.description`)}
                                    placeholder="Item description"
                                    className="border-slate-300"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs text-slate-600 mb-1.5">Quantity</Label>
                                    <Input
                                        type="number"
                                        {...register(`items.${index}.quantity`, {
                                            valueAsNumber: true,
                                            min: 0
                                        })}
                                        placeholder="1"
                                        className="border-slate-300"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-600 mb-1.5">Unit Price</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.unit_price`, {
                                            valueAsNumber: true,
                                            min: 0
                                        })}
                                        placeholder="0.00"
                                        className="border-slate-300 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">Total</span>
                                    <span className="text-lg font-bold text-slate-900 font-mono">
                                        {formatCurrency(items[index]?.total_price || 0, currencyCode)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {fields.length === 0 && (
                    <div className="text-center py-8 text-slate-400 italic">
                        No items added yet. Click &quot;Add Item&quot; to get started.
                    </div>
                )}

                {/* Add Item Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ description: '', quantity: 1, unit_price: 0, total_price: 0 })}
                    className="w-full border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                </Button>
            </div>
        </div>
    );
};

export default InvoiceItems;
