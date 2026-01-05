import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string; // Class for the wrapper
    handleClassName?: string; // Class for the handle
}

export function SortableItem({ id, children, className, handleClassName }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        setActivatorNodeRef
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 1,
        position: 'relative' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative bg-white rounded-xl border border-stone-200 shadow-sm transition-all hover:shadow-md",
                className
            )}
        >
            {/* Drag Handle - Distinct Left Zone */}
            <div
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className={cn(
                    "absolute top-0 bottom-0 left-0 w-10 flex items-center justify-center cursor-grab active:cursor-grabbing text-stone-300 hover:text-stone-500 hover:bg-stone-50 border-r border-stone-100 rounded-l-xl z-20 touch-none transition-colors",
                    handleClassName
                )}
            >
                <GripVertical size={20} />
            </div>

            {/* Content Area - shifted right to accommodate handle */}
            <div className="pl-10">
                {children}
            </div>
        </div>
    );
}
