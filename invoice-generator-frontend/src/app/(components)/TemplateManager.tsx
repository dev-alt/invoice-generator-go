"use client";

import React, { useState, useEffect } from 'react';
import { Template } from '@/(lib)/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/(components)/ui/select";
import { FileBadge2 } from 'lucide-react';
import { templateAPI } from '@/(lib)/api-client';

interface TemplateManagerProps {
    onTemplateSelect?: (templateId: string) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onTemplateSelect }) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await templateAPI.list();
                setTemplates(response.data.templates || []);
            } catch (err) {
                console.error('Error loading templates:', err);
                setError(err instanceof Error ? err.message : 'Failed to load templates');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const handleValueChange = (templateId: string) => {
        onTemplateSelect?.(templateId);
    };

    return (
        <div className="space-y-2">
            <Select onValueChange={handleValueChange}>
                <SelectTrigger id="template-select" className="w-full">
                    <SelectValue placeholder={
                        loading ? "Loading templates..." :
                            error ? "Error loading templates" :
                                templates.length === 0 ? "No templates available" :
                                    "Select a template"
                    } />
                </SelectTrigger>
                <SelectContent>
                    {templates.map((template) => (
                        <SelectItem
                            key={template.id}
                            value={template.id.toString()}
                            className="flex items-center space-x-2"
                        >
                            <div className="flex items-center gap-2">
                                <FileBadge2 className="h-4 w-4" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{template.name}</span>
                                    <span className="text-xs text-gray-500">
                                        {template.language || 'No language specified'}
                                    </span>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};

export default TemplateManager;
