'use client';

import React, { useCallback, useRef } from 'react';
import { useController, FieldValues } from 'react-hook-form';
import { X } from 'lucide-react';
import { FileUploadFieldProps } from '@/types';
import { cn } from '@/lib/utils';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const FileUploader = <T extends FieldValues>({
    control,
    name,
    label,
    acceptTypes,
    disabled,
    icon: Icon,
    placeholder,
    hint,
    compact = false,
}: FileUploadFieldProps<T>) => {
    const {
        field: { onChange, value },
    } = useController({ name, control });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                onChange(file);
            }
        },
        [onChange]
    );

    const onRemove = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onChange(null);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        },
        [onChange]
    );

    const isUploaded = !!value;

    return (
        <FormItem className="flex h-full w-full flex-col">
            <FormLabel
              className={cn(
                "font-medium text-[var(--landing-ink)]",
                compact ? "mb-1.5 text-sm" : "form-label",
              )}
            >
              {label}
            </FormLabel>
            <FormControl>
                <div
                    className={cn(
                        'upload-dropzone flex-1 border-2 border-dashed border-[var(--border-medium)]',
                        compact && 'upload-dropzone-compact',
                        isUploaded && 'upload-dropzone-uploaded'
                    )}
                    onClick={() => !disabled && inputRef.current?.click()}
                >
                    <input
                        type="file"
                        accept={acceptTypes.join(',')}
                        className="hidden"
                        ref={inputRef}
                        onChange={handleFileChange}
                        disabled={disabled}
                    />

                    {isUploaded ? (
                        <div className="relative flex w-full flex-col items-center px-4">
                            <p className="upload-dropzone-text line-clamp-1">{(value as File).name}</p>
                            <button
                                type="button"
                                onClick={onRemove}
                                className="upload-dropzone-remove mt-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Icon className={cn("upload-dropzone-icon", compact && "mb-1 size-8")} />
                            <p className={cn("upload-dropzone-text", compact && "text-sm")}>{placeholder}</p>
                            <p className={cn("upload-dropzone-hint", compact && "mt-0.5 text-xs")}>{hint}</p>
                        </>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export default FileUploader;
