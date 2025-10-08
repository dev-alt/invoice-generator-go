"use client";

import React from 'react';
import { InvoiceItemsProps } from '@/(lib)/types';
import { Button } from '@/(components)/ui/button';
import { Input } from '@/(components)/ui/input';
import { Card } from '@/(components)/ui/card';
import { Plus, Trash2, Package } from 'lucide-react';

const InvoiceItems = ({
                          register,
                          fieldArray: { fields, append, remove },
                          items,
                          currencyCode,
                          formatCurrency,
                      }: InvoiceItemsProps) => {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Package className="h-4 w-4" />
                <h3 className="font-medium">Invoice Items</h3>
            </div>

            <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-12 gap-2 px-2 text-sm font-medium text-gray-500">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-right">Quantity</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-2 text-right">Total</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100"
                        >
                            <div className="col-span-5">
                                <Input
                                    {...register(`items.${index}.description`)}
                                    placeholder="Item description"
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
                                    className="text-right"
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    {...register(`items.${index}.unit_price`, {
                                        valueAsNumber: true,
                                        min: 0
                                    })}
                                    placeholder="Price"
                                    className="text-right"
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    value={formatCurrency(items[index]?.total_price || 0, currencyCode)}
                                    disabled
                                    className="text-right bg-gray-100"
                                />
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

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ description: '', quantity: 1, unit_price: 0, total_price: 0 })}
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                </Button>
            </div>
        </Card>
    );
};

export default InvoiceItems;
